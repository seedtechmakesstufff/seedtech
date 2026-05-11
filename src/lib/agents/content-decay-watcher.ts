/* ── Content Decay Watcher ──
 * Daily agent that detects published blog posts losing traction and queues
 * a refresh-style content_brief for each. Decay signals (any one triggers):
 *   • Conversions dropped to 0 (already emitted as metrics.conversion_drop event)
 *   • Sessions in last 14d are <50% of prior 14d AND prior had ≥30 sessions
 *   • Tracked keyword for the post lost ≥5 positions vs previousPosition
 *   • Post hasn't been updated in 9+ months and impressions trending down
 *
 * For each detected post, generates a refresh content_brief via Claude using
 * the post body + decay reason as context. The brief lands in Inbox (state
 * pending_review) so the human approves before the Blog Drafter rewrites.
 *
 * Idempotency: skip posts that already have a pending_review or approved
 * content_brief targeting the same slug.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { createArtifact } from "@/lib/agent-artifacts";
import { EVENT_TYPES, logEvent } from "@/lib/events";
import type { ContentBriefPayload } from "@/lib/agents/brief-generator";
import type { Prisma } from "@prisma/client";
import { callClaude, stripJsonFences, addUsage, ZERO_USAGE, type ClaudeUsage } from "@/lib/claude";

const MODEL = "claude-sonnet-4-20250514";
const SESSION_DROP_THRESHOLD = 0.5;        // recent < 50% of prior
const SESSION_FLOOR = 30;                  // ignore tiny pages
const KEYWORD_DROP_POSITIONS = 5;
const STALE_MONTHS = 9;
const MAX_BRIEFS_PER_RUN = 3;              // don't flood the inbox

interface DecayCandidate {
  slug: string;
  postId: string;
  title: string;
  body: string;
  targetKeyword: string;
  url: string;                             // /blog/{slug}
  reasons: string[];                       // human-readable decay signals
  metrics: {
    sessionsRecent: number;
    sessionsPrior: number;
    conversionsRecent: number;
    conversionsPrior: number;
  };
}

export interface ContentDecayResult {
  candidatesFound: number;
  briefsQueued: number;
  artifactIds: string[];
  errors: string[];
  model: string;
  usage: ClaudeUsage;
}

export async function runContentDecayWatcher(siteId: string): Promise<ContentDecayResult> {
  const candidates = await detectDecayCandidates(siteId);
  const result: ContentDecayResult = {
    candidatesFound: candidates.length,
    briefsQueued: 0,
    artifactIds: [],
    errors: [],
    model: MODEL,
    usage: { ...ZERO_USAGE },
  };
  if (candidates.length === 0) return result;

  // Filter out slugs that already have an open brief
  const existing = await prisma.agentArtifact.findMany({
    where: {
      siteId,
      type: "content_brief",
      state: { in: ["pending_review", "approved"] },
    },
    select: { payload: true },
  });
  const openSlugs = new Set(
    existing
      .map((e) => (e.payload as { targetSlug?: string }).targetSlug)
      .filter((s): s is string => !!s)
  );
  const fresh = candidates.filter((c) => !openSlugs.has(c.slug)).slice(0, MAX_BRIEFS_PER_RUN);
  if (fresh.length === 0) return result;

  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  for (const c of fresh) {
    try {
      const { brief, usage } = await generateRefreshBrief(c, businessPrompt);
      result.usage = addUsage(result.usage, usage);
      const artifact = await createArtifact({
        siteId,
        agent: "content-decay-watcher",
        type: "content_brief",
        title: `Refresh decaying post: ${c.title}`,
        summary: `Decay signals: ${c.reasons.join(" · ")}`,
        payload: brief as unknown as Prisma.InputJsonValue,
        entityType: "BlogPost",
        entityId: c.postId,
      });
      await logEvent({
        siteId,
        type: EVENT_TYPES.AUDIT_ISSUE_DETECTED,
        severity: "warn",
        title: `Content decay on ${c.url}`,
        body: c.reasons.join("\n"),
        payload: {
          slug: c.slug,
          reasons: c.reasons,
          metrics: c.metrics,
          brief_artifact_id: artifact.id,
        },
        entityType: "BlogPost",
        entityId: c.postId,
      });
      result.artifactIds.push(artifact.id);
      result.briefsQueued++;
    } catch (e) {
      result.errors.push(`${c.slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return result;
}

async function detectDecayCandidates(siteId: string): Promise<DecayCandidate[]> {
  const now = new Date();
  const recentStart = new Date(now);
  recentStart.setUTCDate(recentStart.getUTCDate() - 14);
  const priorStart = new Date(now);
  priorStart.setUTCDate(priorStart.getUTCDate() - 28);
  const staleThreshold = new Date(now);
  staleThreshold.setUTCMonth(staleThreshold.getUTCMonth() - STALE_MONTHS);

  const posts = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      targetKeyword: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
  if (posts.length === 0) return [];

  // Pull metrics for all blog URLs in the 28d window
  const urls = posts.map((p) => `/blog/${p.slug}`);
  const metrics = await prisma.pageMetrics.findMany({
    where: {
      siteId,
      source: "ga4",
      url: { in: urls },
      date: { gte: priorStart },
    },
    select: { url: true, date: true, sessions: true, conversions: true },
  });
  const byUrl = new Map<string, { sR: number; sP: number; cR: number; cP: number }>();
  for (const m of metrics) {
    const bucket = m.date >= recentStart ? "R" : "P";
    const cur = byUrl.get(m.url) ?? { sR: 0, sP: 0, cR: 0, cP: 0 };
    if (bucket === "R") { cur.sR += m.sessions; cur.cR += m.conversions; }
    else { cur.sP += m.sessions; cur.cP += m.conversions; }
    byUrl.set(m.url, cur);
  }

  // Pull tracked keyword movements for post target paths
  const trackedKeywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true, targetPage: { startsWith: "/blog/" } },
    select: { keyword: true, targetPage: true, currentPosition: true, previousPosition: true },
  });
  const kwByUrl = new Map<string, { keyword: string; current: number | null; previous: number | null }[]>();
  for (const k of trackedKeywords) {
    const arr = kwByUrl.get(k.targetPage) ?? [];
    arr.push({ keyword: k.keyword, current: k.currentPosition, previous: k.previousPosition });
    kwByUrl.set(k.targetPage, arr);
  }

  const candidates: DecayCandidate[] = [];
  for (const post of posts) {
    const url = `/blog/${post.slug}`;
    const m = byUrl.get(url) ?? { sR: 0, sP: 0, cR: 0, cP: 0 };
    const reasons: string[] = [];

    if (m.cP >= 3 && m.cR === 0) {
      reasons.push(`Conversions dropped to 0 (had ${m.cP} in prior 14d)`);
    }
    if (m.sP >= SESSION_FLOOR && m.sR < m.sP * SESSION_DROP_THRESHOLD) {
      reasons.push(`Sessions fell to ${m.sR} (was ${m.sP}, ${Math.round(((m.sR - m.sP) / m.sP) * 100)}%)`);
    }
    for (const k of kwByUrl.get(url) ?? []) {
      if (k.current && k.previous && k.previous - k.current <= -KEYWORD_DROP_POSITIONS) {
        reasons.push(`Keyword "${k.keyword}" lost ${k.previous - k.current * -1} positions (${k.previous}→${k.current})`);
      }
    }
    if (post.updatedAt < staleThreshold && m.sR > 0 && m.sR < m.sP) {
      reasons.push(`Post hasn't been updated since ${post.updatedAt.toISOString().slice(0, 10)} and traffic is trending down`);
    }

    if (reasons.length === 0) continue;
    candidates.push({
      slug: post.slug,
      postId: post.id,
      title: post.title,
      body: post.body,
      targetKeyword: post.targetKeyword,
      url,
      reasons,
      metrics: {
        sessionsRecent: m.sR,
        sessionsPrior: m.sP,
        conversionsRecent: m.cR,
        conversionsPrior: m.cP,
      },
    });
  }

  // Severity: prefer posts with strongest signals (conversion drop + traffic drop)
  candidates.sort((a, b) => b.reasons.length - a.reasons.length);
  return candidates;
}

async function generateRefreshBrief(
  c: DecayCandidate,
  businessPrompt: string,
): Promise<{ brief: ContentBriefPayload; usage: ClaudeUsage }> {
  const bodyExcerpt = c.body.slice(0, 4000);

  const prompt = `You are writing a REFRESH content brief for an existing blog post that's losing traction. The Blog Drafter agent will use this brief to rewrite the post. Be specific and pragmatic — surface what's outdated, what's missing, and what should be added.

═══ BUSINESS CONTEXT ═══
${businessPrompt}

═══ THE POST ═══
URL: ${c.url}
Title: ${c.title}
Target keyword: ${c.targetKeyword || "(none specified)"}

Decay signals:
${c.reasons.map((r) => `  • ${r}`).join("\n")}

Last 14d vs prior 14d:
  Sessions: ${c.metrics.sessionsRecent} (was ${c.metrics.sessionsPrior})
  Conversions: ${c.metrics.conversionsRecent} (was ${c.metrics.conversionsPrior})

═══ CURRENT POST BODY (first 4000 chars) ═══
${bodyExcerpt}

═══ TASK ═══
Produce ONE refresh brief. Constraints:
- type MUST be "refresh"
- targetSlug MUST be "${c.slug}" (don't change it)
- title: keep close to the existing title unless it's clearly underperforming
- Suggest 5–8 H2 sections, each with 2–4 bullet sub-points. Carry over what's still good; rewrite/remove what's stale; add the obvious gaps.
- mustInclude items the post is missing now (citeable opening, comparison table, FAQ, etc.)
- internalLinks: 3–6 paths to existing site pages
- sourcesToCite: 2–4 authority domains
- reasoning: cite the specific decay signal(s) and what the refresh fixes

Return ONLY valid JSON, no markdown fences:
{
  "type": "refresh",
  "targetKeyword": "${c.targetKeyword || ""}",
  "targetSlug": "${c.slug}",
  "title": "...",
  "intent": "informational" | "commercial" | "transactional" | "navigational",
  "funnelStage": "TOFU" | "MOFU" | "BOFU",
  "wordCountTarget": 1500,
  "sections": [{"h2": "...", "bullets": ["...", "..."]}],
  "mustInclude": ["..."],
  "internalLinks": ["..."],
  "sourcesToCite": ["..."],
  "reasoning": "..."
}`;

  const { text, usage } = await callClaude({
    model: MODEL,
    maxTokens: 4096,
    prompt,
  });
  const cleaned = stripJsonFences(text);
  const parsed = JSON.parse(cleaned) as ContentBriefPayload;
  if (parsed.type !== "refresh") parsed.type = "refresh";
  parsed.targetSlug = c.slug;
  return { brief: parsed, usage };
}
