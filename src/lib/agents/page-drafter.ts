/* ── Page Drafter Agent ──────────────────────────────────────────────────────
 * Reads SeoInsight rows with type="page_opportunity" (written by the Page
 * Opportunity Scout) and drafts optimised page copy for each. Produces
 * `page_draft` AgentArtifact rows queued in the Inbox for human review.
 *
 * On approval the publisher updates the PageMetadata row (title, description,
 * og fields) and marks the insight as resolved. The actual .tsx page file
 * is NOT touched — the copy is surfaced for the developer to apply manually.
 *
 * Runs Monday 11:30 AM UTC — after Strategy Analyst (10:30) so the weekly
 * strategy context is available, before GBP Post Drafter (12:00).
 * ─────────────────────────────────────────────────────────────────────────── */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { createArtifact } from "@/lib/agent-artifacts";
import { callClaude, stripJsonFences, addUsage, ZERO_USAGE, type ClaudeUsage } from "@/lib/claude";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const MODEL = "claude-sonnet-4-6";
const MAX_DRAFTS_PER_RUN = 4;

export interface PageDraftSection {
  heading: string;   // H2 heading for the section
  copy: string;      // 2–4 paragraphs of body copy
}

export interface PageDraftPayload {
  /** Back-reference to the SeoInsight that triggered this draft */
  opportunityInsightId: string;
  path: string;
  pageKind: string;
  targetKeyword: string;
  // Current state (before optimisation)
  currentTitle: string | null;
  currentDescription: string | null;
  // Drafted outputs
  draftTitle: string;           // ≤ 60 chars, includes primary keyword
  draftDescription: string;     // ≤ 160 chars, benefit-led, includes keyword
  draftH1: string;              // page headline
  sections: PageDraftSection[]; // 3–6 rewritten body sections
  faqItems: { q: string; a: string }[]; // 4–6 FAQs optimised for PAA
  internalLinksToAdd: { anchorText: string; targetPath: string }[];
  reasoning: string;            // why this page + what data triggered it
}

export interface PageDrafterResult {
  draftsCreated: number;
  artifactIds: string[];
  errors: string[];
  model: string;
  usage: ClaudeUsage;
}

export async function runPageDrafter(siteId: string): Promise<PageDrafterResult> {
  const result: PageDrafterResult = {
    draftsCreated: 0,
    artifactIds: [],
    errors: [],
    model: MODEL,
    usage: { ...ZERO_USAGE },
  };

  // ── Fetch active page_opportunity insights ───────────────────────────────
  const insights = await db.seoInsight.findMany({
    where: {
      siteId,
      type: "page_opportunity",
      status: "active",
    },
    orderBy: { priority: "desc" },
    take: MAX_DRAFTS_PER_RUN,
  });

  if (insights.length === 0) return result;

  // Dedup: skip pages that already have a pending page_draft artifact
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _insightPaths = insights.map((i: any) => {
    const m = i.metadata as { path?: string } | null;
    return m?.path ?? null;
  }).filter(Boolean) as string[];

  const existingDrafts = await prisma.agentArtifact.findMany({
    where: {
      siteId,
      type: "page_draft",
      state: { in: ["pending_review", "approved"] },
    },
    select: { payload: true },
  });
  const alreadyDraftedPaths = new Set<string>(
    existingDrafts
      .map((d) => {
        try {
          return (d.payload as { path?: string })?.path ?? null;
        } catch { return null; }
      })
      .filter(Boolean) as string[]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toProcess = insights.filter((ins: any) => {
    const m = ins.metadata as { path?: string } | null;
    return m?.path && !alreadyDraftedPaths.has(m.path);
  });

  if (toProcess.length === 0) return result;

  // ── Context data ─────────────────────────────────────────────────────────
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  const strategyDoc = await prisma.seoStrategyDoc.findFirst({
    where: { siteId, source: "ai-strategy-analyst", isActive: true },
    orderBy: { updatedAt: "desc" },
    select: { content: true },
  });

  // Internal link targets for suggestions
  const internalLinks = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    select: { path: true, title: true, kind: true },
    take: 40,
  });
  const linkMenu = internalLinks
    .map((p) => `${p.path} — ${p.title ?? p.kind}`)
    .join("\n");

  // ── Draft each page ──────────────────────────────────────────────────────
  for (const insight of toProcess) {
    const meta = insight.metadata as {
      path?: string;
      pageId?: string;
      avgPosition?: number | null;
      impressions28d?: number;
      ctr28d?: number | null;
      targetKeyword?: string | null;
      currentTitle?: string | null;
      crawlStatus?: string | null;
      reasons?: string[];
    } | null;

    const path = meta?.path;
    if (!path) continue;

    // Fetch existing PageMetadata for current copy
    const currentMeta = await prisma.pageMetadata.findUnique({
      where: { siteId_path: { siteId, path } },
      select: { title: true, description: true, ogTitle: true, ogDescription: true },
    });

    // Fetch PageContext for additional context
    const pageContext = await prisma.pageContext.findUnique({
      where: { siteId_path: { siteId, path } },
      select: { description: true, keywords: true, pageType: true },
    });

    const opportunity = [
      `Path: ${path}`,
      meta?.avgPosition ? `Current avg ranking: #${meta.avgPosition.toFixed(1)}` : null,
      meta?.impressions28d ? `Impressions (28d): ${meta.impressions28d}` : null,
      meta?.ctr28d != null ? `CTR: ${(meta.ctr28d * 100).toFixed(1)}%` : null,
      meta?.targetKeyword ? `Primary keyword: ${meta.targetKeyword}` : null,
      meta?.crawlStatus ? `Crawl status: ${meta.crawlStatus}` : null,
      meta?.reasons?.length ? `Reasons flagged:\n${meta.reasons.map((r) => `  - ${r}`).join("\n")}` : null,
    ].filter(Boolean).join("\n");

    const currentCopy = [
      currentMeta?.title ? `Current title: ${currentMeta.title}` : "Current title: (none)",
      currentMeta?.description ? `Current meta description: ${currentMeta.description}` : "Current meta description: (none)",
      pageContext?.description ? `Page context: ${pageContext.description}` : null,
      pageContext?.keywords?.length ? `Page keywords: ${pageContext.keywords.join(", ")}` : null,
    ].filter(Boolean).join("\n");

    const prompt = `${businessPrompt}

${strategyDoc ? `## Weekly Strategy Context\n${strategyDoc.content.slice(0, 1500)}` : ""}

## Page Optimisation Task

You are a senior SEO copywriter. Rewrite and optimise the following page to improve its search performance. Focus on: (1) a compelling title/meta that earns the click, (2) clear benefit-led H1, (3) structured body sections that address user intent, (4) FAQ section targeting People Also Ask queries, (5) natural internal links to related pages.

## Page Performance Data
${opportunity}

## Current Copy
${currentCopy}

## Available Internal Link Targets
${linkMenu}

## Output Format
Return ONLY valid JSON matching this exact structure:
{
  "draftTitle": "string (≤60 chars, includes primary keyword naturally)",
  "draftDescription": "string (≤160 chars, benefit-led, includes keyword, ends with soft CTA)",
  "draftH1": "string (compelling page headline, can be longer than title)",
  "sections": [
    { "heading": "string (H2)", "copy": "string (2-4 paragraphs)" }
  ],
  "faqItems": [
    { "q": "string (natural language question)", "a": "string (2-4 sentences, direct answer)" }
  ],
  "internalLinksToAdd": [
    { "anchorText": "string", "targetPath": "string (must be from the available targets list)" }
  ],
  "reasoning": "string (1-2 sentences: why this page was chosen and what the main change is)"
}

Rules:
- sections: 3–6 H2 sections covering the topic comprehensively
- faqItems: 4–6 questions targeting common user queries and PAA boxes
- internalLinksToAdd: 2–4 links to genuinely related pages
- draftTitle MUST be ≤ 60 characters
- draftDescription MUST be ≤ 160 characters
- Do not fabricate statistics or claims not supported by the business profile
- Write in the brand's tone of voice`;

    try {
      const { text, usage } = await callClaude({
        model: MODEL,
        maxTokens: 4096,
        prompt,
      });
      result.usage = addUsage(result.usage, usage);

      const raw = stripJsonFences(text);
      const parsed = JSON.parse(raw) as {
        draftTitle: string;
        draftDescription: string;
        draftH1: string;
        sections: PageDraftSection[];
        faqItems: { q: string; a: string }[];
        internalLinksToAdd: { anchorText: string; targetPath: string }[];
        reasoning: string;
      };

      const payload: PageDraftPayload = {
        opportunityInsightId: insight.id,
        path,
        pageKind: pageContext?.pageType ?? "page",
        targetKeyword: meta?.targetKeyword ?? parsed.draftTitle.split(" ").slice(0, 3).join(" "),
        currentTitle: currentMeta?.title ?? null,
        currentDescription: currentMeta?.description ?? null,
        draftTitle: parsed.draftTitle,
        draftDescription: parsed.draftDescription,
        draftH1: parsed.draftH1,
        sections: parsed.sections ?? [],
        faqItems: parsed.faqItems ?? [],
        internalLinksToAdd: parsed.internalLinksToAdd ?? [],
        reasoning: parsed.reasoning,
      };

      const artifact = await createArtifact({
        siteId,
        agent: "page-drafter",
        type: "page_draft",
        title: `Page draft: ${parsed.draftTitle}`,
        summary: `${path} — ${parsed.reasoning}`,
        payload: payload as unknown as import("@prisma/client").Prisma.InputJsonValue,
        entityType: "SeoInsight",
        entityId: insight.id,
      });

      result.artifactIds.push(artifact.id);
      result.draftsCreated++;
    } catch (e) {
      result.errors.push(`${path}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return result;
}
