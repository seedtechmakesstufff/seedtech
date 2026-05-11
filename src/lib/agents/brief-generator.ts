/* ── Brief Generator Agent ──
 * Reads the latest Strategy Analyst brief + tracked keywords + cluster gaps
 * + recent published posts, and produces 1-3 ContentBrief artifacts that the
 * Blog Drafter agent consumes once approved.
 *
 * A brief is a structured plan for ONE blog post (refresh or new). Approving
 * it moves the brief to `state=approved`; the Blog Drafter cron then picks
 * it up, generates the full draft, and queues a `blog_draft` artifact.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { createArtifact } from "@/lib/agent-artifacts";
import type { Prisma } from "@prisma/client";
import {
  findSimilarPublishedPosts,
  decideForBrief,
  type SimilarityWarning,
} from "@/lib/dedup";
import { callClaude, stripJsonFences, type ClaudeUsage } from "@/lib/claude";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const MODEL = "claude-sonnet-4-20250514";
const ANALYST_SOURCE = "ai-strategy-analyst";

export interface ContentBriefPayload {
  type: "refresh" | "new";
  targetKeyword: string;
  targetSlug: string;
  title: string;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  funnelStage: "TOFU" | "MOFU" | "BOFU";
  wordCountTarget: number;
  sections: { h2: string; bullets: string[] }[];
  mustInclude: string[];
  internalLinks: string[];
  sourcesToCite: string[];
  reasoning: string;
  /** Set when this brief was derived from a ResearchSignal */
  researchSignalId?: string;
  similarityWarning?: SimilarityWarning;
}

interface GeneratorOutput {
  briefs: ContentBriefPayload[];
}

export interface BriefGeneratorResult {
  briefsCreated: number;
  artifactIds: string[];
  model: string;
  usage: ClaudeUsage;
}

export async function runBriefGenerator(siteId: string): Promise<BriefGeneratorResult> {
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  const analystBrief = await prisma.seoStrategyDoc.findFirst({
    where: { siteId, source: ANALYST_SOURCE, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: { content: true, updatedAt: true },
  });

  const keywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ impressions28d: "desc" }],
    take: 40,
    select: {
      keyword: true,
      tier: true,
      intent: true,
      targetPage: true,
      currentPosition: true,
      clicks28d: true,
      impressions28d: true,
    },
  });

  const recentPosts = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: { slug: true, title: true, targetKeyword: true, updatedAt: true },
  });

  const clustersRaw = await prisma.keywordCluster.findMany({
    where: { siteId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      subtopics: {
        select: { title: true, slug: true, contentStatus: true, priority: true },
        orderBy: { priority: "desc" },
        take: 20,
      },
    },
  });
  const clusters = clustersRaw.map((c) => ({
    name: c.name,
    subtopics: c.subtopics.map((s) => ({
      title: s.title,
      slug: s.slug,
      hasContent: s.contentStatus === "published",
      priority: s.priority,
    })),
  }));

  const sitePages = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    orderBy: { kind: "asc" },
    select: { path: true, kind: true, title: true },
    take: 60,
  });

  // ── Research signals — consume fresh ones first (highest shareScore) ──
  const freshSignals = await db.researchSignal.findMany({
    where: { siteId, status: "fresh" },
    orderBy: [{ shareScore: "desc" }, { recencyScore: "desc" }],
    take: 6,
    select: {
      id: true,
      industry: true,
      headline: true,
      insight: true,
      contentAngle: true,
      keywords: true,
      shareScore: true,
      sourceDomain: true,
      sourceTitle: true,
      sourceUrl: true,
      publishedAt: true,
    },
  }) as Array<{
    id: string;
    industry: string;
    headline: string;
    insight: string;
    contentAngle: string;
    keywords: string[];
    shareScore: number;
    sourceDomain: string;
    sourceTitle: string;
    sourceUrl: string;
    publishedAt: Date | null;
  }>;

  const prompt = buildPrompt({
    businessPrompt,
    analystBrief: analystBrief?.content ?? null,
    analystUpdatedAt: analystBrief?.updatedAt ?? null,
    keywords,
    recentPosts,
    clusters,
    sitePages,
    freshSignals,
  });

  const { text, usage, model } = await callClaude({
    model: MODEL,
    maxTokens: 4096,
    prompt,
  });
  const cleaned = stripJsonFences(text);

  let parsed: GeneratorOutput;
  try {
    parsed = JSON.parse(cleaned) as GeneratorOutput;
  } catch {
    throw new Error(`Brief Generator returned invalid JSON: ${text.slice(0, 200)}`);
  }
  if (!Array.isArray(parsed.briefs)) {
    throw new Error("Brief Generator output missing briefs array");
  }

  const ids: string[] = [];
  for (const b of parsed.briefs.slice(0, 5)) {
    // Deduplication guard — only check new-type briefs. Refresh briefs
    // already target a specific existing slug, so similarity is expected.
    if (b.type === "new") {
      const candidateText = [b.title, b.targetKeyword, ...(b.sections ?? []).map((s) => s.h2)].join("\n");
      const hits = await findSimilarPublishedPosts(siteId, candidateText, 3);
      const top = hits[0];
      if (top) {
        const decision = decideForBrief(top.score);
        if (decision === "convert_to_refresh") {
          b.type = "refresh";
          b.targetSlug = top.slug;
          b.similarityWarning = {
            matchedUrl: top.url,
            matchedTitle: top.title,
            score: top.score,
            action: "converted_to_refresh",
          };
        } else if (decision === "warn") {
          b.similarityWarning = {
            matchedUrl: top.url,
            matchedTitle: top.title,
            score: top.score,
            action: "warn",
          };
        }
      }
    }

    const a = await createArtifact({
      siteId,
      agent: "brief-generator",
      type: "content_brief",
      title: `${b.type === "refresh" ? "Refresh" : "New post"}: ${b.title}`,
      summary: b.reasoning,
      payload: b as unknown as Prisma.InputJsonValue,
    });
    ids.push(a.id);

    // Mark the signal consumed so it isn't picked up again
    if (b.researchSignalId) {
      await db.researchSignal.update({
        where: { id: b.researchSignalId },
        data: { status: "consumed", consumedBy: a.id },
      });
    }
  }

  return { briefsCreated: ids.length, artifactIds: ids, model, usage };
}

function buildPrompt(c: {
  businessPrompt: string;
  analystBrief: string | null;
  analystUpdatedAt: Date | null;
  keywords: Array<{ keyword: string; tier: string; intent: string; targetPage: string; currentPosition: number | null; clicks28d: number; impressions28d: number }>;
  recentPosts: Array<{ slug: string; title: string; targetKeyword: string | null; updatedAt: Date }>;
  clusters: Array<{ name: string; subtopics: Array<{ title: string; slug: string; hasContent: boolean; priority: number }> }>;
  sitePages: Array<{ path: string; kind: string; title: string | null }>;
  freshSignals: Array<{ id: string; industry: string; headline: string; insight: string; contentAngle: string; keywords: string[]; shareScore: number; sourceDomain: string; sourceTitle: string; sourceUrl: string; publishedAt: Date | null }>;
}): string {
  const signalBlock =
    c.freshSignals.length === 0
      ? "(none this week — fall back to keyword/cluster analysis)"
      : c.freshSignals
          .map(
            (s, i) =>
              `[Signal ${i + 1}] id=${s.id} industry=${s.industry} score=${s.shareScore}/100
Headline: ${s.headline}
Why it matters: ${s.insight}
Content angle: ${s.contentAngle}
Keywords: ${s.keywords.join(", ")}
Source: ${s.sourceTitle} (${s.sourceDomain}) ${s.publishedAt ? `— ${s.publishedAt.toISOString().slice(0, 10)}` : ""}`
          )
          .join("\n\n");

  return `You are the SeedTech Content Brief Generator. Read the analyst's weekly brief and the underlying data, then write 2–3 content briefs the Blog Drafter agent will use to produce posts. A brief is a SPECIFIC plan for ONE post — refresh an existing one OR create a new one.

PRIORITY: If fresh research signals exist below, use them FIRST. These are real-world events from primary sources — they produce original, shareable content that competitors haven't written yet. Only fall back to pure keyword/cluster briefs if signals are weak or irrelevant.

═══ BUSINESS CONTEXT ═══
${c.businessPrompt}

═══ ANALYST'S WEEKLY BRIEF ${c.analystUpdatedAt ? `(updated ${c.analystUpdatedAt.toISOString().slice(0, 10)})` : ""} ═══
${c.analystBrief ?? "(no analyst brief yet — base your briefs on the data below)"}

═══ FRESH RESEARCH SIGNALS (primary source insights — prioritise these) ═══
${signalBlock}

═══ TRACKED KEYWORDS (top 40 by 28d impressions) ═══
${c.keywords.map((k) => `• "${k.keyword}" [${k.tier}/${k.intent}] target=${k.targetPage} pos=${k.currentPosition ?? "?"} clicks=${k.clicks28d} impr=${k.impressions28d}`).join("\n")}

═══ EXISTING POSTS (do not duplicate; refresh if relevant) ═══
${c.recentPosts.map((p) => `• ${p.slug} — "${p.title}"${p.targetKeyword ? ` [target: ${p.targetKeyword}]` : ""}`).join("\n")}

═══ CLUSTER GAPS (subtopics without content yet) ═══
${c.clusters.length === 0 ? "(no clusters yet)" : c.clusters.map((cl) => `Cluster: ${cl.name}\n${cl.subtopics.filter((s) => !s.hasContent).map((s) => `  • ${s.title} [slug: ${s.slug}, priority: ${s.priority}]`).join("\n")}`).join("\n\n")}

═══ INTERNAL LINK TARGETS (existing site paths) ═══
${c.sitePages.map((p) => `• ${p.path} [${p.kind}]${p.title ? ` — ${p.title}` : ""}`).join("\n")}

═══ TASK ═══
Produce 2–3 briefs. Each must be specific, justified by the data above, and actionable. Mix refresh + new content where appropriate.

Rules:
- If a research signal is used, set "researchSignalId" to the signal's id (e.g. "cm..."). The signal's contentAngle should be the starting point — but develop it with keyword data and your own framing.
- Prefer keywords with high impressions but low CTR (refresh candidate) or rising trend
- For refresh briefs, set type="refresh" and targetSlug to the EXISTING slug
- For new briefs, set type="new" and propose a clean keyword-rich slug (no leading slash)
- sections: 5–8 H2s, each with 2–4 bullet sub-points. Make these CONCRETE, not generic.
- mustInclude: at minimum: "citeable opening (20-60 words)", "entity definition", "Q&A format H2s", "comparison table", "FAQ section (4-6 Q's)", "CTA closing"
- internalLinks: pick 3–6 existing paths from the list above
- sourcesToCite: 2–4 authority domains relevant to the topic — for signal-based briefs, always include the signal's sourceDomain
- reasoning: 2–3 sentences citing the specific data point or signal that triggered this brief

Return ONLY valid JSON, no markdown fences:
{
  "briefs": [
    {
      "type": "refresh" | "new",
      "targetKeyword": "...",
      "targetSlug": "...",
      "title": "Final post title (50-65 chars, includes keyword)",
      "intent": "informational" | "commercial" | "transactional" | "navigational",
      "funnelStage": "TOFU" | "MOFU" | "BOFU",
      "wordCountTarget": 1500,
      "researchSignalId": "cm..." | null,
      "sections": [
        { "h2": "...", "bullets": ["...", "..."] }
      ],
      "mustInclude": ["..."],
      "internalLinks": ["/services/...", "/blog/..."],
      "sourcesToCite": ["..."],
      "reasoning": "..."
    }
  ]
}`;
}
