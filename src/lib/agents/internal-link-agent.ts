/* ── Internal Link Agent ──
 * After a post publishes (or as a daily sweep), find:
 *   1. Existing posts that should add a link to the new post (incoming links)
 *   2. The new post's missing links to existing pages/posts (outgoing links)
 *
 * Uses TF-IDF similarity (already in semantic-embeddings.ts) over post bodies
 * + tracked-keyword matching to surface candidates, then writes
 * InternalLinkSuggestion rows. Batches the suggestions per source post into
 * a `link_suggestions` AgentArtifact for human review.
 *
 * Approving the artifact applies all selected suggestions: edits the source
 * post body to insert the anchor, and marks the InternalLinkSuggestion row
 * as accepted.
 */

import { prisma } from "@/lib/prisma";
import { tfidfVectorize, cosineSimilarity } from "@/lib/semantic-embeddings";
import { createArtifact } from "@/lib/agent-artifacts";
import type { Prisma } from "@prisma/client";

const MIN_SIMILARITY = 0.18;          // tune empirically
const MAX_SUGGESTIONS_PER_SOURCE = 5;
const MIN_BODY_LENGTH = 400;          // skip tiny posts

export interface LinkSuggestionItem {
  suggestionId: string;
  sourcePageUrl: string;
  targetPageUrl: string;
  anchorText: string;
  context: string;
  reason: string;
}

export interface LinkSuggestionsPayload {
  sourcePageUrl: string;
  sourcePostId: string;
  suggestions: LinkSuggestionItem[];
}

export interface InternalLinkResult {
  posts: number;
  suggestionsCreated: number;
  artifactsQueued: number;
  artifactIds: string[];
}

/**
 * Scope:
 *  - "post": run only for a single post (used by the publish hook)
 *  - "daily": sweep — run for posts published in the last 30 days that don't
 *    yet have a pending link_suggestions artifact.
 */
export async function runInternalLinkAgent(
  siteId: string,
  scope: { mode: "post"; postId: string } | { mode: "daily" }
): Promise<InternalLinkResult> {
  const result: InternalLinkResult = { posts: 0, suggestionsCreated: 0, artifactsQueued: 0, artifactIds: [] };

  const allPublished = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      targetKeyword: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  if (allPublished.length < 2) return result;

  let sources: typeof allPublished;
  if (scope.mode === "post") {
    const single = allPublished.find((p) => p.id === scope.postId);
    if (!single) return result;
    sources = [single];
  } else {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - 30);
    sources = allPublished.filter((p) => p.publishedAt && p.publishedAt >= cutoff);
    // Skip sources that already have an open artifact
    const openSources = await prisma.agentArtifact.findMany({
      where: { siteId, type: "link_suggestions", state: { in: ["pending_review", "approved"] } },
      select: { entityId: true },
    });
    const openIds = new Set(openSources.map((a) => a.entityId).filter(Boolean) as string[]);
    sources = sources.filter((p) => !openIds.has(p.id));
  }
  if (sources.length === 0) return result;

  // Build TF-IDF vectors over the universe of post bodies (used for both
  // incoming and outgoing similarity)
  const corpus = allPublished.map((p) => `${p.title}\n${p.body}`);
  const vectors = tfidfVectorize(corpus);
  const idxById = new Map(allPublished.map((p, i) => [p.id, i]));

  // Site pages — for outgoing-link candidates beyond just blog posts
  const sitePages = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    select: { path: true, kind: true, title: true },
  });

  for (const source of sources) {
    if (source.body.length < MIN_BODY_LENGTH) continue;
    const sourceUrl = `/blog/${source.slug}`;
    const sourceIdx = idxById.get(source.id)!;

    const candidates: Array<{
      targetUrl: string;
      anchorText: string;
      context: string;
      reason: string;
      score: number;
    }> = [];

    // Outgoing: similar published posts the source doesn't already link to
    for (const target of allPublished) {
      if (target.id === source.id) continue;
      const targetUrl = `/blog/${target.slug}`;
      if (source.body.includes(targetUrl)) continue; // already linked
      const targetIdx = idxById.get(target.id)!;
      const sim = cosineSimilarity(vectors[sourceIdx]!, vectors[targetIdx]!);
      if (sim < MIN_SIMILARITY) continue;
      const context = pickContext(source.body, target.targetKeyword || target.title) ?? "";
      candidates.push({
        targetUrl,
        anchorText: target.targetKeyword || target.title,
        context,
        reason: `Topic similarity ${sim.toFixed(2)} — ${target.title}`,
        score: sim,
      });
    }

    // Outgoing: site pages whose path/title appear in the body but aren't linked
    for (const page of sitePages) {
      if (page.path === sourceUrl) continue;
      if (source.body.includes(page.path)) continue;
      const phrase = page.title || page.path.replace(/^\//, "");
      if (!phrase) continue;
      // Cheap check: does the body mention the title or its key segments?
      const tokens = phrase.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3);
      const hits = tokens.filter((t) => source.body.toLowerCase().includes(t)).length;
      if (hits < Math.min(2, tokens.length)) continue;
      const context = pickContext(source.body, phrase) ?? "";
      candidates.push({
        targetUrl: page.path,
        anchorText: phrase,
        context,
        reason: `Source mentions "${phrase}" but doesn't link to ${page.path} (${page.kind})`,
        score: 0.15 + hits / 100,
      });
    }

    candidates.sort((a, b) => b.score - a.score);
    const top = candidates.slice(0, MAX_SUGGESTIONS_PER_SOURCE);
    if (top.length === 0) continue;

    // Persist InternalLinkSuggestion rows (idempotent via @@unique)
    const items: LinkSuggestionItem[] = [];
    for (const t of top) {
      try {
        const row = await prisma.internalLinkSuggestion.upsert({
          where: { siteId_sourcePageUrl_targetPageUrl: { siteId, sourcePageUrl: sourceUrl, targetPageUrl: t.targetUrl } },
          update: { anchorText: t.anchorText, context: t.context, reason: t.reason, status: "pending" },
          create: {
            siteId,
            sourcePageUrl: sourceUrl,
            targetPageUrl: t.targetUrl,
            anchorText: t.anchorText,
            context: t.context,
            reason: t.reason,
            status: "pending",
          },
        });
        items.push({
          suggestionId: row.id,
          sourcePageUrl: sourceUrl,
          targetPageUrl: t.targetUrl,
          anchorText: t.anchorText,
          context: t.context,
          reason: t.reason,
        });
        result.suggestionsCreated++;
      } catch {
        // Concurrent upsert race — ignore
      }
    }
    if (items.length === 0) continue;

    const payload: LinkSuggestionsPayload = {
      sourcePageUrl: sourceUrl,
      sourcePostId: source.id,
      suggestions: items,
    };
    const artifact = await createArtifact({
      siteId,
      agent: "internal-link-agent",
      type: "link_suggestions",
      title: `${items.length} link suggestion${items.length === 1 ? "" : "s"} for ${source.title}`,
      summary: items.map((i) => `→ ${i.targetPageUrl} (${i.anchorText})`).join("\n"),
      payload: payload as unknown as Prisma.InputJsonValue,
      entityType: "BlogPost",
      entityId: source.id,
    });
    result.artifactIds.push(artifact.id);
    result.artifactsQueued++;
    result.posts++;
  }

  return result;
}

/** Find the first sentence in body containing the phrase (case-insensitive). */
function pickContext(body: string, phrase: string): string | null {
  if (!phrase) return null;
  const needle = phrase.toLowerCase();
  // Split by sentence-ish breaks
  const sentences = body.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    if (s.toLowerCase().includes(needle)) return s.slice(0, 280);
  }
  // Fallback: any sentence sharing 2+ tokens
  const tokens = needle.split(/[^a-z0-9]+/).filter((t) => t.length > 3);
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (tokens.filter((t) => lower.includes(t)).length >= 2) return s.slice(0, 280);
  }
  return null;
}

/**
 * Pure helper: insert a markdown link wrapping the first occurrence of
 * `anchor` in `body` that isn't already inside a link. Returns the modified
 * body, or null if the anchor wasn't found in a wrappable position.
 */
export function insertMarkdownLink(body: string, anchor: string, targetUrl: string): string | null {
  if (body.includes(targetUrl)) return null;
  // \b only works between word and non-word chars, so only apply it when the
  // anchor edge is a word character — otherwise the boundary always fails for
  // anchors like "(premium)".
  const startBoundary = /^\w/.test(anchor) ? "\\b" : "";
  const endBoundary = /\w$/.test(anchor) ? "\\b" : "";
  const re = new RegExp(
    `(^|[^\\[])${startBoundary}(${escapeRegex(anchor)})${endBoundary}(?!\\])`,
    "i"
  );
  if (!re.test(body)) return null;
  return body.replace(re, `$1[$2](${targetUrl})`);
}

/* ── Apply approved suggestions ── */

export async function applyLinkSuggestions(payload: LinkSuggestionsPayload): Promise<{ applied: number; skipped: number }> {
  const post = await prisma.blogPost.findUnique({ where: { id: payload.sourcePostId } });
  if (!post) throw new Error("Source BlogPost not found");

  let body = post.body;
  let applied = 0;
  let skipped = 0;
  for (const item of payload.suggestions) {
    const next = insertMarkdownLink(body, item.anchorText, item.targetPageUrl);
    if (next == null) {
      skipped++;
      continue;
    }
    body = next;
    applied++;
    await prisma.internalLinkSuggestion.update({
      where: { id: item.suggestionId },
      data: { status: "accepted" },
    });
  }
  if (applied > 0) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { body },
    });
  }
  return { applied, skipped };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
