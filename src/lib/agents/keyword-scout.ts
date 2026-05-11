/* ── Keyword Scout Agent ──
 * Reads GSC daily keyword data, finds queries the site ranks for that aren't
 * yet tracked, and queues each as a `keyword_candidate` AgentArtifact for
 * one-click approval. Approving creates a TrackedKeyword row.
 *
 * Heuristics only — no LLM call. Intent + tier + suggested target page are
 * inferred from the query and existing site pages. Keeps the agent fast and
 * deterministic; the human is the judgment layer.
 */

import { prisma } from "@/lib/prisma";
import { createArtifact } from "@/lib/agent-artifacts";
import type { Prisma } from "@prisma/client";

const LOOKBACK_DAYS = 28;
const MIN_IMPRESSIONS = 50;
const MAX_CANDIDATES_PER_RUN = 15;
const MIN_QUERY_LENGTH = 3;

type KeywordTier = "tier1" | "tier2" | "tier3";
type KeywordIntent = "transactional" | "commercial" | "informational" | "navigational";

export interface KeywordCandidatePayload {
  keyword: string;
  intent: KeywordIntent;
  tier: KeywordTier;
  targetPage: string;
  clicks28d: number;
  impressions28d: number;
  ctr28d: number;
  position: number;
  reason: string;
}

export interface KeywordScoutResult {
  candidatesFound: number;
  artifactsQueued: number;
  artifactIds: string[];
  skippedExisting: number;
}

export async function runKeywordScout(siteId: string): Promise<KeywordScoutResult> {
  const result: KeywordScoutResult = {
    candidatesFound: 0,
    artifactsQueued: 0,
    artifactIds: [],
    skippedExisting: 0,
  };

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - LOOKBACK_DAYS);

  // Aggregate GSC by query
  const rows = await prisma.gscDailyKeyword.findMany({
    where: { siteId, date: { gte: since } },
    select: { query: true, clicks: true, impressions: true, position: true },
  });
  if (rows.length === 0) return result;

  interface Agg { clicks: number; impressions: number; positionSum: number; positionCount: number }
  const byQuery = new Map<string, Agg>();
  for (const r of rows) {
    const q = r.query.trim().toLowerCase();
    if (q.length < MIN_QUERY_LENGTH) continue;
    const cur = byQuery.get(q) ?? { clicks: 0, impressions: 0, positionSum: 0, positionCount: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    if (r.position > 0) {
      cur.positionSum += r.position;
      cur.positionCount += 1;
    }
    byQuery.set(q, cur);
  }

  // Already-tracked keywords (case-insensitive)
  const existing = await prisma.trackedKeyword.findMany({
    where: { siteId },
    select: { keyword: true },
  });
  const tracked = new Set(existing.map((k) => k.keyword.toLowerCase()));

  // Already-queued candidates (don't duplicate)
  const openArtifacts = await prisma.agentArtifact.findMany({
    where: { siteId, type: "keyword_candidate", state: { in: ["pending_review", "approved"] } },
    select: { payload: true },
  });
  const openKeywords = new Set(
    openArtifacts
      .map((a) => (a.payload as { keyword?: string }).keyword?.toLowerCase())
      .filter((k): k is string => !!k)
  );

  const sitePages = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    select: { path: true, kind: true, title: true },
  });
  const businessProfile = await prisma.businessProfile.findUnique({
    where: { siteId },
    select: { companyName: true, brandEntities: true },
  });
  const brandTokens = new Set(
    [businessProfile?.companyName, ...(businessProfile?.brandEntities ?? [])]
      .filter(Boolean)
      .flatMap((s) => (s as string).toLowerCase().split(/\s+/))
      .filter((t) => t.length > 2)
  );

  // Build candidates list, filter, score, take top N
  const candidates: KeywordCandidatePayload[] = [];
  for (const [query, agg] of Array.from(byQuery.entries())) {
    if (agg.impressions < MIN_IMPRESSIONS) continue;
    if (tracked.has(query) || openKeywords.has(query)) {
      result.skippedExisting++;
      continue;
    }
    candidates.push({
      keyword: query,
      intent: inferIntent(query, brandTokens),
      tier: inferTier(agg.impressions),
      targetPage: suggestTargetPage(query, sitePages),
      clicks28d: agg.clicks,
      impressions28d: agg.impressions,
      ctr28d: agg.impressions > 0 ? agg.clicks / agg.impressions : 0,
      position: agg.positionCount > 0 ? agg.positionSum / agg.positionCount : 0,
      reason: explainCandidate(agg.impressions, agg.clicks, agg.positionCount > 0 ? agg.positionSum / agg.positionCount : 0),
    });
  }
  result.candidatesFound = candidates.length;

  // Sort by impressions desc, take top N
  candidates.sort((a, b) => b.impressions28d - a.impressions28d);
  const toQueue = candidates.slice(0, MAX_CANDIDATES_PER_RUN);

  for (const c of toQueue) {
    const artifact = await createArtifact({
      siteId,
      agent: "keyword-scout",
      type: "keyword_candidate",
      title: `Track "${c.keyword}" (${c.tier} · ${c.intent})`,
      summary: c.reason,
      payload: c as unknown as Prisma.InputJsonValue,
    });
    result.artifactIds.push(artifact.id);
    result.artifactsQueued++;
  }

  return result;
}

/* ── Heuristics ── */

const TRANSACTIONAL_HINTS = ["buy", "order", "book", "schedule", "hire", "quote", "pricing", "price", "cost", "appointment"];
const TRANSACTIONAL_PHRASES = ["near me"];
const COMMERCIAL_HINTS = ["best", "top", "vs", "review", "reviews", "compare", "comparison", "alternatives"];
const COMMERCIAL_PHRASES = ["versus"];
const INFORMATIONAL_HINTS = ["how", "what", "why", "when", "where", "guide", "tips", "ideas", "examples", "tutorial", "explained", "definition", "meaning"];

function hasWord(spacedQuery: string, words: string[]): boolean {
  for (const w of words) if (spacedQuery.includes(` ${w} `)) return true;
  return false;
}
function hasPhrase(spacedQuery: string, phrases: string[]): boolean {
  for (const p of phrases) if (spacedQuery.includes(p)) return true;
  return false;
}

export function inferIntent(query: string, brandTokens: Set<string>): KeywordIntent {
  const q = ` ${query.toLowerCase()} `;
  for (const t of Array.from(brandTokens)) {
    if (q.includes(` ${t} `)) return "navigational";
  }
  if (hasWord(q, TRANSACTIONAL_HINTS) || hasPhrase(q, TRANSACTIONAL_PHRASES)) return "transactional";
  if (hasWord(q, COMMERCIAL_HINTS) || hasPhrase(q, COMMERCIAL_PHRASES)) return "commercial";
  if (hasWord(q, INFORMATIONAL_HINTS)) return "informational";
  return "informational";
}

export function inferTier(impressions: number): KeywordTier {
  if (impressions >= 1000) return "tier1";
  if (impressions >= 200) return "tier2";
  return "tier3";
}

export function suggestTargetPage(
  query: string,
  pages: Array<{ path: string; kind: string; title: string | null }>
): string {
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3);
  if (tokens.length === 0) return "/";

  let best: { path: string; score: number } | null = null;
  for (const p of pages) {
    if (p.path === "/") continue;
    const haystack = `${p.path} ${p.title ?? ""}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (haystack.includes(t)) score += 1;
    if (score === 0) continue; // service-page boost only kicks in when there's a real match
    if (p.kind === "service") score += 0.5;
    if (best == null || score > best.score) best = { path: p.path, score };
  }
  if (best && best.score > 0) return best.path;
  return "/";
}

function explainCandidate(impressions: number, clicks: number, position: number): string {
  const parts = [`${impressions} impressions, ${clicks} clicks (last ${LOOKBACK_DAYS}d)`];
  if (position > 0) parts.push(`avg position ${position.toFixed(1)}`);
  if (impressions >= 500 && clicks === 0) parts.push("ranking but not clicked — opportunity");
  if (position > 10 && position < 30) parts.push("page 2-3 candidate");
  return parts.join(" · ");
}
