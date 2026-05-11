/* ── Duplicate Content Guard ──
 * Deterministic similarity checks for two flows:
 *   1. Brief Generator — before queueing a new-type content_brief, compare
 *      against all published BlogPosts. Convert to refresh / warn / keep.
 *   2. GBP Post Drafter — before queueing a gbp_post_draft, compare against
 *      the last 90 days of GbpPosts. Drop / warn / keep.
 *
 * Uses TF-IDF vectors from semantic-embeddings.ts. No LLM calls — fast,
 * deterministic, runs inline in the agent.
 *
 * Thresholds are tuned conservatively. Real-world TF-IDF similarity on
 * English blog content tends to land at 0.10–0.25 for unrelated posts,
 * 0.30–0.50 for same-topic-different-angle, 0.55+ for near-duplicates.
 */

import { prisma } from "@/lib/prisma";
import { tfidfVectorize, cosineSimilarity } from "@/lib/semantic-embeddings";

export interface SimilarPostHit {
  slug: string;
  url: string;
  title: string;
  score: number;
}

export interface SimilarGbpHit {
  postName: string | null;
  summary: string;
  createdAt: Date;
  score: number;
}

/** Top-N most similar published BlogPosts to `candidateText`. */
export async function findSimilarPublishedPosts(
  siteId: string,
  candidateText: string,
  limit = 3
): Promise<SimilarPostHit[]> {
  const posts = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    select: { slug: true, title: true, body: true, targetKeyword: true, excerpt: true },
  });
  if (posts.length === 0 || candidateText.trim().length === 0) return [];

  const corpus = [
    candidateText,
    ...posts.map((p) => `${p.title}\n${p.targetKeyword}\n${p.excerpt}\n${p.body}`),
  ];
  const vectors = tfidfVectorize(corpus);
  const candVec = vectors[0]!;
  return posts
    .map((p, i) => ({
      slug: p.slug,
      url: `/blog/${p.slug}`,
      title: p.title,
      score: cosineSimilarity(candVec, vectors[i + 1]!),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Top-N most similar GBP posts within the last `days` days. */
export async function findSimilarGbpPosts(
  siteId: string,
  candidateText: string,
  days = 90,
  limit = 3
): Promise<SimilarGbpHit[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const posts = await prisma.gbpPost.findMany({
    where: { location: { siteId }, createdAt: { gte: since } },
    select: { postName: true, summary: true, createdAt: true },
  });
  if (posts.length === 0 || candidateText.trim().length === 0) return [];

  const corpus = [candidateText, ...posts.map((p) => p.summary)];
  const vectors = tfidfVectorize(corpus);
  const candVec = vectors[0]!;
  return posts
    .map((p, i) => ({
      postName: p.postName,
      summary: p.summary,
      createdAt: p.createdAt,
      score: cosineSimilarity(candVec, vectors[i + 1]!),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ── Threshold decisions ── */

export type BriefDecision = "keep" | "warn" | "convert_to_refresh";

export const BRIEF_THRESHOLDS = {
  /** Below this: clearly distinct, no warning. */
  WARN: 0.35,
  /** Above this: too close to an existing post — auto-convert to refresh. */
  CONVERT: 0.55,
} as const;

export function decideForBrief(topScore: number): BriefDecision {
  if (topScore >= BRIEF_THRESHOLDS.CONVERT) return "convert_to_refresh";
  if (topScore >= BRIEF_THRESHOLDS.WARN) return "warn";
  return "keep";
}

export type GbpPostDecision = "keep" | "warn" | "drop";

export const GBP_POST_THRESHOLDS = {
  WARN: 0.35,
  /** Above this: refuse to queue — too close to a recent GBP post. */
  DROP: 0.55,
} as const;

export function decideForGbpPost(topScore: number): GbpPostDecision {
  if (topScore >= GBP_POST_THRESHOLDS.DROP) return "drop";
  if (topScore >= GBP_POST_THRESHOLDS.WARN) return "warn";
  return "keep";
}

/* ── Warning shape persisted in artifact payloads ── */

export interface SimilarityWarning {
  matchedUrl?: string;
  matchedTitle?: string;
  matchedSummary?: string;
  matchedAt?: string;          // ISO date for GBP
  score: number;
  action: "warn" | "converted_to_refresh";
}
