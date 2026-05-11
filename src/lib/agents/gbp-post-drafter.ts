/* ── GBP Post Drafter Agent ──
 * Weekly: drafts 1–2 GBP local post *ideas* per location.
 * Each idea queues as a gbp_post_draft AgentArtifact for human review.
 * The human uploads an image and edits the copy before approving.
 * On approval the publisher calls the GBP API with both text and image.
 *
 * Key behaviours vs the previous version:
 * - Reads per-post viewCount/clickCount performance data to avoid repeating
 *   low-performers and double-down on high-CTR topic types.
 * - Produces a content *idea* (shorter, rougher) plus an imagePrompt to
 *   guide the user's photo/graphic choice.
 * - uploadedImageUrl is always null at creation — the user sets it in Inbox.
 *   The publisher hard-blocks approval without it.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { createArtifact } from "@/lib/agent-artifacts";
import type { Prisma } from "@prisma/client";
import { callClaude, stripJsonFences, ZERO_USAGE, type ClaudeUsage } from "@/lib/claude";
import {
  findSimilarGbpPosts,
  decideForGbpPost,
  type SimilarityWarning,
} from "@/lib/dedup";

const MODEL = "claude-sonnet-4-6";

// How far back we look for past posts when computing performance benchmarks
const PERF_LOOKBACK_DAYS = 90;
// How far back we pull for the "avoid repeating" context
const RECENT_POSTS_LOOKBACK_DAYS = 60;

export type GbpPostTopic = "STANDARD" | "EVENT" | "OFFER" | "ALERT";
export type GbpCtaType = "LEARN_MORE" | "BOOK" | "ORDER" | "SHOP" | "SIGN_UP" | "CALL" | null;

export interface GbpPerformanceContext {
  topPerformingType: string;     // e.g. "OFFER (avg CTR 8.3%)"
  avoidedTopics: string[];       // topic angles from recent low-performers
  highPerformers: string[];      // topics/angles from posts with best CTR
}

export interface GbpPostDraftPayload {
  locationDbId: string;
  locationResource: string;
  accountResource: string;
  topicType: GbpPostTopic;
  summary: string;
  ctaType: GbpCtaType;
  ctaUrl: string | null;
  imagePrompt: string;             // suggested image/photo description for the human
  uploadedImageUrl: string | null; // set by human in Inbox before approving
  reasoning: string;
  performanceContext: GbpPerformanceContext;
  similarityWarning?: SimilarityWarning;
}

export interface GbpPostDrafterResult {
  postsDrafted: number;
  artifactIds: string[];
  errors: string[];
  model: string;
  usage: ClaudeUsage;
}

interface DrafterOutput {
  posts: Array<{
    locationDbId: string;
    topicType: GbpPostTopic;
    summary: string;
    ctaType: GbpCtaType;
    ctaUrl: string | null;
    imagePrompt: string;
    reasoning: string;
  }>;
}

// ── Performance analyser ──────────────────────────────────────────────────────

interface PostPerfRow {
  topicType: string;
  summary: string;
  viewCount?: number | null;
  clickCount?: number | null;
  createdAt: Date;
}

interface PerfInsights {
  topPerformingType: string;
  avoidedTopics: string[];
  highPerformers: string[];
  /** Formatted for the LLM prompt */
  promptBlock: string;
}

function analysePostPerformance(posts: PostPerfRow[]): PerfInsights {
  if (posts.length === 0) {
    return {
      topPerformingType: "no data yet",
      avoidedTopics: [],
      highPerformers: [],
      promptBlock: "(No prior post performance data yet — vary topic types freely.)",
    };
  }

  // Group CTR by topicType (only posts where we have both values)
  const typeTotals = new Map<string, { views: number; clicks: number; count: number }>();
  for (const p of posts) {
    if (p.viewCount == null || p.clickCount == null) continue;
    const cur = typeTotals.get(p.topicType) ?? { views: 0, clicks: 0, count: 0 };
    cur.views += p.viewCount;
    cur.clicks += p.clickCount;
    cur.count++;
    typeTotals.set(p.topicType, cur);
  }

  // Best topic type by CTR
  let bestType = "STANDARD";
  let bestCtr = 0;
  const typeLines: string[] = [];
  for (const [type, t] of Array.from(typeTotals.entries())) {
    const ctr = t.views > 0 ? t.clicks / t.views : 0;
    typeLines.push(`  ${type}: ${t.count} posts, avg CTR ${(ctr * 100).toFixed(1)}%`);
    if (ctr > bestCtr) { bestCtr = ctr; bestType = type; }
  }

  // Sort by CTR to identify high and low performers
  const withCtr = posts
    .filter((p) => p.viewCount != null && p.clickCount != null && p.viewCount! > 0)
    .map((p) => ({ ...p, ctr: p.clickCount! / p.viewCount! }))
    .sort((a, b) => b.ctr - a.ctr);

  const highPerformers = withCtr.slice(0, 3).map((p) => `"${p.summary.slice(0, 80)}" (${(p.ctr * 100).toFixed(1)}% CTR)`);
  const avoidedTopics = withCtr.slice(-3).filter((p) => p.ctr < 0.02).map((p) => `"${p.summary.slice(0, 60)}"`);

  // Recent posts without perf data — still need to avoid topic repetition
  const recentOnly = posts
    .filter((p) => p.viewCount == null)
    .slice(0, 8)
    .map((p) => `[${p.topicType}] ${p.summary.slice(0, 100)}`);

  const topPerformingType = `${bestType} (avg CTR ${(bestCtr * 100).toFixed(1)}%)`;

  const lines: string[] = [];
  if (typeLines.length > 0) {
    lines.push("Performance by type:");
    lines.push(...typeLines);
  }
  if (highPerformers.length > 0) {
    lines.push("High-CTR posts (use as inspiration, don't repeat verbatim):");
    highPerformers.forEach((h) => lines.push(`  ✓ ${h}`));
  }
  if (avoidedTopics.length > 0) {
    lines.push("Low-CTR posts (avoid similar angles):");
    avoidedTopics.forEach((a) => lines.push(`  ✗ ${a}`));
  }
  if (recentOnly.length > 0) {
    lines.push("Recent posts (no CTR data yet — avoid repeating topics):");
    recentOnly.forEach((r) => lines.push(`  – ${r}`));
  }

  return {
    topPerformingType,
    avoidedTopics: avoidedTopics.map((a) => a.replace(/^"|"$/g, "")),
    highPerformers,
    promptBlock: lines.join("\n"),
  };
}

// ── Main agent ────────────────────────────────────────────────────────────────

export async function runGbpPostDrafter(siteId: string): Promise<GbpPostDrafterResult> {
  const result: GbpPostDrafterResult = {
    postsDrafted: 0,
    artifactIds: [],
    errors: [],
    model: MODEL,
    usage: { ...ZERO_USAGE },
  };

  let locations = await prisma.gbpLocation.findMany({ where: { siteId } });

  // ── Fallback: if no GBP locations are synced yet, upsert a stub from the
  //    business profile so the drafter can still generate ideas for review.
  //    The stub uses placeholder Google resource IDs — publishing will be
  //    blocked at the publisher layer until real IDs are present.
  if (locations.length === 0) {
    const bp = await prisma.businessProfile.findFirst({ where: { siteId } });
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    const stubTitle = bp?.companyName ?? site?.domain ?? "Our business";
    const stubAccountId = `accounts/stub-${siteId}`;
    const stubLocationId = `locations/stub-${siteId}`;

    const stub = await prisma.gbpLocation.upsert({
      where: { siteId_locationId: { siteId, locationId: stubLocationId } },
      create: {
        siteId,
        accountId: stubAccountId,
        locationId: stubLocationId,
        title: stubTitle,
        isPrimary: true,
      },
      update: {},
    });
    locations = [stub];
  }

  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  const perfSince = new Date();
  perfSince.setUTCDate(perfSince.getUTCDate() - PERF_LOOKBACK_DAYS);

  const recentSince = new Date();
  recentSince.setUTCDate(recentSince.getUTCDate() - RECENT_POSTS_LOOKBACK_DAYS);

  const blogSince = new Date();
  blogSince.setUTCDate(blogSince.getUTCDate() - 28);

  // Fetch past GBP posts with performance data per location.
  // Cast to include viewCount/clickCount which are added by the phase8 migration.
  const pastGbpPosts = (await prisma.gbpPost.findMany({
    where: { location: { siteId }, createdAt: { gte: perfSince } },
    orderBy: { createdAt: "desc" },
    select: {
      topicType: true,
      summary: true,
      createdAt: true,
      locationId: true,
    },
  })) as Array<{ topicType: string; summary: string; createdAt: Date; locationId: string; viewCount?: number | null; clickCount?: number | null }>;

  const recentBlogPosts = await prisma.blogPost.findMany({
    where: { siteId, status: "published", updatedAt: { gte: blogSince } },
    orderBy: { updatedAt: "desc" },
    take: 8,
    select: { slug: true, title: true, excerpt: true, targetKeyword: true },
  });

  const metricsRows = await prisma.gbpMetricsDaily.findMany({
    where: { location: { siteId }, date: { gte: recentSince } },
    select: { locationId: true, callClicks: true, websiteClicks: true, drivingDirections: true },
  });
  const metricsByLoc = new Map<string, { calls: number; clicks: number; directions: number }>();
  for (const r of metricsRows) {
    const cur = metricsByLoc.get(r.locationId) ?? { calls: 0, clicks: 0, directions: 0 };
    cur.calls += r.callClicks;
    cur.clicks += r.websiteClicks;
    cur.directions += r.drivingDirections;
    metricsByLoc.set(r.locationId, cur);
  }

  // Per-location performance analysis
  const perfByLoc = new Map<string, PerfInsights>();
  for (const loc of locations) {
    const locPosts = pastGbpPosts.filter((p) => p.locationId === loc.id);
    perfByLoc.set(loc.id, analysePostPerformance(locPosts));
  }

  const prompt = buildPrompt({
    businessPrompt,
    locations: locations.map((l) => ({
      dbId: l.id,
      title: l.title,
      primaryCategory: l.primaryCategory,
      websiteUri: l.websiteUri,
      metrics: metricsByLoc.get(l.id) ?? { calls: 0, clicks: 0, directions: 0 },
      perf: perfByLoc.get(l.id)!,
    })),
    recentBlogPosts,
  });

  let text: string;
  try {
    const r = await callClaude({ model: MODEL, maxTokens: 4096, prompt });
    text = r.text;
    result.usage = r.usage;
  } catch (e) {
    result.errors.push(`Claude error: ${e instanceof Error ? e.message : String(e)}`);
    return result;
  }
  const cleaned = stripJsonFences(text);

  let parsed: DrafterOutput;
  try {
    parsed = JSON.parse(cleaned) as DrafterOutput;
  } catch {
    result.errors.push(`Invalid JSON: ${text.slice(0, 200)}`);
    return result;
  }

  const locById = new Map(locations.map((l) => [l.id, l]));

  for (const p of parsed.posts ?? []) {
    const loc = locById.get(p.locationDbId);
    if (!loc) {
      result.errors.push(`unknown locationDbId ${p.locationDbId}`);
      continue;
    }
    if (!p.summary || p.summary.length > 1500) {
      result.errors.push(`invalid summary for ${loc.title}`);
      continue;
    }

    // Dedup guard
    let similarityWarning: SimilarityWarning | undefined;
    const hits = await findSimilarGbpPosts(siteId, p.summary);
    const top = hits[0];
    if (top) {
      const decision = decideForGbpPost(top.score);
      if (decision === "drop") {
        result.errors.push(
          `dedup_drop: "${p.summary.slice(0, 50)}…" too similar (sim ${top.score.toFixed(2)}) to GBP post from ${top.createdAt.toISOString().slice(0, 10)}`
        );
        continue;
      }
      if (decision === "warn") {
        similarityWarning = {
          matchedSummary: top.summary.slice(0, 200),
          matchedAt: top.createdAt.toISOString(),
          score: top.score,
          action: "warn",
        };
      }
    }

    const perf = perfByLoc.get(p.locationDbId) ?? {
      topPerformingType: "no data",
      avoidedTopics: [],
      highPerformers: [],
    };

    const payload: GbpPostDraftPayload = {
      locationDbId: loc.id,
      locationResource: loc.locationId,
      accountResource: loc.accountId,
      topicType: p.topicType,
      summary: p.summary,
      ctaType: p.ctaType,
      ctaUrl: p.ctaUrl,
      imagePrompt: p.imagePrompt ?? "A high-quality photo relevant to this post",
      uploadedImageUrl: null, // always null at creation — human uploads before approving
      reasoning: p.reasoning,
      performanceContext: {
        topPerformingType: perf.topPerformingType,
        avoidedTopics: perf.avoidedTopics,
        highPerformers: perf.highPerformers,
      },
    };
    if (similarityWarning) payload.similarityWarning = similarityWarning;

    const a = await createArtifact({
      siteId,
      agent: "gbp-post-drafter",
      type: "gbp_post_draft",
      title: `${p.topicType} idea for ${loc.title}`,
      summary: p.reasoning,
      payload: payload as unknown as Prisma.InputJsonValue,
      entityType: "GbpLocation",
      entityId: loc.id,
    });
    result.artifactIds.push(a.id);
    result.postsDrafted++;
  }

  return result;
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(c: {
  businessPrompt: string;
  locations: Array<{
    dbId: string;
    title: string;
    primaryCategory: string | null;
    websiteUri: string | null;
    metrics: { calls: number; clicks: number; directions: number };
    perf: PerfInsights;
  }>;
  recentBlogPosts: Array<{ slug: string; title: string; excerpt: string; targetKeyword: string | null }>;
}): string {
  const locBlocks = c.locations
    .map(
      (l) => `--- Location: "${l.title}" (dbId=${l.dbId}) ---
Category: ${l.primaryCategory ?? "(none)"}
Website: ${l.websiteUri ?? "(none)"}
Last 60d metrics: calls=${l.metrics.calls} site-clicks=${l.metrics.clicks} directions=${l.metrics.directions}

Past post performance:
${l.perf.promptBlock}`
    )
    .join("\n\n");

  const blogBlock =
    c.recentBlogPosts.length === 0
      ? "(none)"
      : c.recentBlogPosts
          .map(
            (p) =>
              `• /blog/${p.slug} — "${p.title}"${p.targetKeyword ? ` [${p.targetKeyword}]` : ""}\n  ${p.excerpt}`
          )
          .join("\n\n");

  return `You are helping a local business create Google Business Profile post *ideas*. A human will review each idea, upload a relevant image, edit the copy, and then publish it. Write ideas that are genuine and useful — not marketing fluff.

═══ BUSINESS CONTEXT ═══
${c.businessPrompt}

═══ LOCATIONS + PAST PERFORMANCE ═══
${locBlocks}

═══ RECENT BLOG POSTS (optional source material to amplify) ═══
${blogBlock}

═══ TASK ═══
Draft 1–2 GBP post ideas PER LOCATION. Use the performance data to:
- Favour topic types with higher historical CTR
- Avoid angles that performed poorly (low CTR posts listed above)
- Take inspiration from high-CTR posts — different angle, same energy

Rules per post:
- summary: 100–300 characters. Hook → value → implied CTA. This is an editable idea — keep it tight.
- topicType: STANDARD (general), OFFER (discount/deal), EVENT (date-bound), ALERT (urgent — use sparingly)
- ctaType + ctaUrl: real URLs only. For blog posts: "<websiteUri>/blog/<slug>". null if no clear action.
- imagePrompt: 1–2 sentences describing the ideal photo or graphic (e.g. "A photo of the team on a recent job site" or "Before-and-after of a completed project"). Be specific and actionable — the business owner will take or find this photo.
- reasoning: 1 sentence citing why this topic/type now (reference a metric, blog post, or performance insight)

Return ONLY valid JSON:
{
  "posts": [
    {
      "locationDbId": "<dbId from list above>",
      "topicType": "STANDARD" | "EVENT" | "OFFER" | "ALERT",
      "summary": "...",
      "ctaType": "LEARN_MORE" | "BOOK" | "ORDER" | "SHOP" | "SIGN_UP" | "CALL" | null,
      "ctaUrl": "https://..." | null,
      "imagePrompt": "...",
      "reasoning": "..."
    }
  ]
}`;
}
