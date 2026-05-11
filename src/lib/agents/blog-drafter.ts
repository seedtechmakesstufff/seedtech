/* ── Blog Drafter Agent ──
 * Picks up content_brief artifacts in state=approved that haven't been
 * drafted yet (still pending_review on the brief means human hasn't approved;
 * already-drafted means brief.state was advanced to "published" with a
 * blog_draft artifact linked).
 *
 * For each, calls Claude to write the full markdown body following the brief's
 * sections + mustInclude rules, creates a BlogPost (status=draft), and queues
 * a blog_draft artifact for human review. Approving the blog_draft publishes
 * the BlogPost via the registered publisher.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { createArtifact } from "@/lib/agent-artifacts";
import type { ContentBriefPayload } from "@/lib/agents/brief-generator";
import type { Prisma } from "@prisma/client";

const MODEL_QUALITY = "claude-sonnet-4-20250514";  // default — better long-form content
const MODEL_FAST = "claude-haiku-4-5-20251001";    // 3-5x faster, used when speed matters
const MAX_BRIEFS_PER_RUN = 3;
const PARALLEL_CONCURRENCY = 2;                    // run 2 drafts in parallel; tune up for daily cron

function pickModel(opts?: { fast?: boolean }) {
  if (opts?.fast || process.env.BLOG_DRAFTER_MODEL === "fast") return MODEL_FAST;
  return MODEL_QUALITY;
}

export interface BlogDraftPayload {
  briefArtifactId: string;
  blogPostId: string;
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  bodyPreview: string;        // first 400 chars for quick review without loading full draft
  wordCount: number;
  targetKeyword: string;
  type: "refresh" | "new";
}

export interface BlogDrafterResult {
  draftsCreated: number;
  artifactIds: string[];
  errors: string[];
}

export interface BlogDrafterOptions {
  briefArtifactIds?: string[];   // restrict to specific briefs (used by per-brief route)
  max?: number;                  // override MAX_BRIEFS_PER_RUN
  fast?: boolean;                // use Haiku — faster, lower quality
}

export async function runBlogDrafter(
  siteId: string,
  options: BlogDrafterOptions = {}
): Promise<BlogDrafterResult> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");
  const model = pickModel({ fast: options.fast });
  const max = options.max ?? MAX_BRIEFS_PER_RUN;

  const briefs = await prisma.agentArtifact.findMany({
    where: {
      siteId,
      type: "content_brief",
      state: "approved",
      ...(options.briefArtifactIds ? { id: { in: options.briefArtifactIds } } : {}),
    },
    orderBy: { reviewedAt: "asc" },
    take: max,
  });

  const result: BlogDrafterResult = { draftsCreated: 0, artifactIds: [], errors: [] };
  if (briefs.length === 0) return result;

  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  // Parallelize across briefs with bounded concurrency. Each draft is independent.
  const queue = [...briefs];
  const workers = Array.from({ length: Math.min(PARALLEL_CONCURRENCY, briefs.length) }, async () => {
    while (queue.length > 0) {
      const briefArtifact = queue.shift();
      if (!briefArtifact) break;
      try {
        const brief = briefArtifact.payload as unknown as ContentBriefPayload;
        const draftArtifactId = await draftOne(siteId, briefArtifact.id, brief, businessPrompt, apiKey, model);
        result.artifactIds.push(draftArtifactId);
        result.draftsCreated++;
        await prisma.agentArtifact.update({
          where: { id: briefArtifact.id },
          data: { state: "published", publishedAt: new Date() },
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        result.errors.push(`brief ${briefArtifact.id}: ${message}`);
        await prisma.agentArtifact.update({
          where: { id: briefArtifact.id },
          data: { state: "failed", publishError: message },
        });
      }
    }
  });
  await Promise.all(workers);

  return result;
}

async function draftOne(
  siteId: string,
  briefArtifactId: string,
  brief: ContentBriefPayload,
  businessPrompt: string,
  apiKey: string,
  model: string
): Promise<string> {
  const prompt = buildDraftPrompt(brief, businessPrompt);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude error: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  let parsed: { title: string; slug: string; excerpt: string; metaTitle: string; metaDescription: string; body: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Drafter returned invalid JSON: ${text.slice(0, 200)}`);
  }
  if (!parsed.body || !parsed.title) throw new Error("Drafter missing body or title");

  const wordCount = parsed.body.split(/\s+/).filter(Boolean).length;
  const slug = (parsed.slug || brief.targetSlug).replace(/^\/+|\/+$/g, "");

  // Refresh: update existing post to draft state with new body. New: create.
  let blogPost;
  if (brief.type === "refresh") {
    const existing = await prisma.blogPost.findFirst({ where: { siteId, slug } });
    if (existing) {
      blogPost = await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          title: parsed.title,
          excerpt: parsed.excerpt,
          body: parsed.body,
          metaTitle: parsed.metaTitle,
          metaDescription: parsed.metaDescription,
          targetKeyword: brief.targetKeyword,
          wordCount,
          status: "draft", // keep as draft until human approves the blog_draft artifact
        },
      });
    } else {
      blogPost = await createBlogPost(siteId, slug, parsed, brief, wordCount);
    }
  } else {
    blogPost = await createBlogPost(siteId, slug, parsed, brief, wordCount);
  }

  const draftArtifact = await createArtifact({
    siteId,
    agent: "blog-drafter",
    type: "blog_draft",
    title: `${brief.type === "refresh" ? "Refreshed" : "New"} draft: ${parsed.title}`,
    summary: parsed.excerpt,
    payload: {
      briefArtifactId,
      blogPostId: blogPost.id,
      title: parsed.title,
      slug: blogPost.slug,
      excerpt: parsed.excerpt,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      bodyPreview: parsed.body.slice(0, 400),
      wordCount,
      targetKeyword: brief.targetKeyword,
      type: brief.type,
    } satisfies BlogDraftPayload as unknown as Prisma.InputJsonValue,
    entityType: "BlogPost",
    entityId: blogPost.id,
  });
  return draftArtifact.id;
}

async function createBlogPost(
  siteId: string,
  slug: string,
  parsed: { title: string; excerpt: string; body: string; metaTitle: string; metaDescription: string },
  brief: ContentBriefPayload,
  wordCount: number
) {
  // Ensure slug uniqueness for new posts — append -2, -3 if needed
  let finalSlug = slug;
  let i = 2;
  while (await prisma.blogPost.findFirst({ where: { siteId, slug: finalSlug } })) {
    finalSlug = `${slug}-${i++}`;
    if (i > 20) throw new Error("Could not find unique slug");
  }
  return prisma.blogPost.create({
    data: {
      siteId,
      title: parsed.title,
      slug: finalSlug,
      excerpt: parsed.excerpt,
      body: parsed.body,
      category: brief.intent,
      targetKeyword: brief.targetKeyword,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      wordCount,
      status: "draft",
    },
  });
}

function buildDraftPrompt(brief: ContentBriefPayload, businessPrompt: string): string {
  return `You are a senior content writer at SeedTech writing ONE blog post from a structured brief. The post will be reviewed by a human before publishing — so write it to be ready to ship, not a sketch.

═══ BUSINESS CONTEXT ═══
${businessPrompt}

═══ THE BRIEF ═══
Type: ${brief.type === "refresh" ? "REFRESH (rewriting an existing post)" : "NEW post"}
Target keyword: "${brief.targetKeyword}" (${brief.intent}, ${brief.funnelStage})
Title: ${brief.title}
Slug: ${brief.targetSlug}
Word count target: ${brief.wordCountTarget}

Sections (use these as your H2 structure — refine wording, but keep coverage):
${brief.sections.map((s, i) => `${i + 1}. ${s.h2}\n${s.bullets.map((b) => `   - ${b}`).join("\n")}`).join("\n")}

Must include:
${brief.mustInclude.map((m) => `  • ${m}`).join("\n")}

Internal links to weave in (use 3-6 of these naturally):
${brief.internalLinks.map((l) => `  • ${l}`).join("\n")}

Sources to cite (where appropriate):
${brief.sourcesToCite.map((s) => `  • ${s}`).join("\n")}

═══ STYLE RULES ═══
- Open with a citeable answer (20–60 words) directly below the H1, before any sections
- Use Q&A-style H2s wherever the topic permits
- Include at least one comparison table (markdown table) and at least one bulleted definition block
- Close with an FAQ section of 4–6 questions
- End with a CTA section linking to a relevant service page
- No marketing fluff: no "top-notch," "cutting-edge," "premier," "elevate"
- Concrete numbers, named entities, and dated references where you can — write to be cited by AI assistants
- Internal links: use markdown link syntax with descriptive anchors

Return ONLY valid JSON, no markdown fences:
{
  "title": "${brief.title}",
  "slug": "${brief.targetSlug}",
  "excerpt": "120-180 char summary for previews",
  "metaTitle": "≤60 chars, includes keyword",
  "metaDescription": "≤155 chars, value prop + soft CTA",
  "body": "FULL markdown post body, starting with the citeable opening paragraph (no top-level # heading — H1 is the title above)"
}`;
}
