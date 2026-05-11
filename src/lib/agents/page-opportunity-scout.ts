/* ── Page Opportunity Scout ──────────────────────────────────────────────────
 * Pure-heuristic agent — no Claude call. Reads GSC page data + SitePage +
 * PageMetadata and identifies service/location/landing pages worth rewriting.
 * Emits SeoInsight rows (type: "page_opportunity") that the Page Drafter
 * picks up next in the Monday pipeline.
 *
 * A page qualifies if ANY of:
 *   1. Ranking 5–20 with impressions ≥ 50 (last 28d) and CTR < 3%
 *      → title/meta is failing to earn the click
 *   2. Ranking 5–20 with impressions ≥ 50 and no PageMetadata row
 *      → page hasn't been optimised at all
 *   3. Non-blog SitePage with zero GSC impressions in last 30d AND
 *      page was created > 60 days ago → invisible page, copy likely weak
 *   4. Ranking 1–20 and PageMetadata.crawlStatus contains "missing-desc"
 *      or "missing-og" → technical gaps hurting CTR
 *
 * Idempotency: skips pages that already have a pending/approved
 * page_opportunity SeoInsight (re-detected on next run once resolved).
 * ─────────────────────────────────────────────────────────────────────────── */

import { prisma } from "@/lib/prisma";
import { logEvent, EVENT_TYPES } from "@/lib/events";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const GSC_LOOKBACK_DAYS = 28;
const MIN_IMPRESSIONS = 50;
const MIN_RANK_POSITION = 5;
const MAX_RANK_POSITION = 20;
const LOW_CTR_THRESHOLD = 0.03;          // 3%
const INVISIBLE_PAGE_DAYS = 30;          // no impressions in this window
const PAGE_MIN_AGE_DAYS = 60;            // only flag pages old enough to have indexed
const MAX_INSIGHTS_PER_RUN = 8;

/** Page kinds that are in scope — blogs are handled by Content Decay Watcher */
const SCOPED_KINDS = ["service", "location", "landing", "home"];

export interface PageOpportunityScoutResult {
  pagesScanned: number;
  opportunitiesFound: number;
  insightIds: string[];
  skippedAlreadyFlagged: number;
  errors: string[];
}

interface PageCandidate {
  path: string;
  pageId: string;
  reasons: string[];
  avgPosition: number | null;
  impressions28d: number;
  ctr28d: number | null;
  targetKeyword: string | null;
  currentTitle: string | null;
  crawlStatus: string | null;
}

export async function runPageOpportunityScout(siteId: string): Promise<PageOpportunityScoutResult> {
  const errors: string[] = [];
  const insightIds: string[] = [];
  let skippedAlreadyFlagged = 0;

  // ── Fetch scope ──────────────────────────────────────────────────────────
  const cutoff28d = new Date(Date.now() - GSC_LOOKBACK_DAYS * 86_400_000);
  const cutoffInvisible = new Date(Date.now() - INVISIBLE_PAGE_DAYS * 86_400_000);
  const cutoffPageAge = new Date(Date.now() - PAGE_MIN_AGE_DAYS * 86_400_000);

  // All non-blog site pages for this site, old enough to have indexed
  const sitePages = await prisma.sitePage.findMany({
    where: {
      siteId,
      kind: { in: SCOPED_KINDS },
      status: "active",
      createdAt: { lte: cutoffPageAge },
    },
    select: { id: true, path: true, kind: true, createdAt: true },
  });

  if (sitePages.length === 0) {
    return { pagesScanned: 0, opportunitiesFound: 0, insightIds: [], skippedAlreadyFlagged: 0, errors: [] };
  }

  const pagePaths = sitePages.map((p) => p.path);

  // GSC aggregate for these paths (last 28d)
  const gscRows = await prisma.gscDailyPage.groupBy({
    by: ["pageUrl"],
    where: {
      siteId,
      date: { gte: cutoff28d },
      // Match site pages by path suffix — GSC stores full URLs
    },
    _sum: { clicks: true, impressions: true },
    _avg: { position: true, ctr: true },
  });

  // Build a lookup: path → gsc aggregates
  // GSC pageUrl is a full URL; we match by path suffix
  const gscByPath = new Map<string, typeof gscRows[number]>();
  for (const row of gscRows) {
    try {
      const url = new URL(row.pageUrl);
      gscByPath.set(url.pathname, row);
    } catch {
      // malformed URL — skip
    }
  }

  // PageMetadata lookup
  const metadataRows = await prisma.pageMetadata.findMany({
    where: { siteId, path: { in: pagePaths } },
    select: { path: true, title: true, description: true, crawlStatus: true },
  });
  const metaByPath = new Map(metadataRows.map((m) => [m.path, m]));

  // TrackedKeyword lookup for primary keyword per page
  const keywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true, targetPage: { in: pagePaths } },
    select: { targetPage: true, keyword: true, currentPosition: true },
  });
  const kwByPage = new Map(keywords.map((k) => [k.targetPage ?? "", k]));

  // Already-flagged paths (pending or approved page_opportunity insights)
  const existingInsights = await db.seoInsight.findMany({
    where: {
      siteId,
      type: "page_opportunity",
      status: { in: ["active"] },
    },
    select: { metadata: true },
  });
  const alreadyFlaggedPaths = new Set<string>(
    existingInsights
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((i: any) => {
        try {
          const m = i.metadata as { path?: string } | null;
          return m?.path ?? null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[]
  );

  // ── Evaluate each page ───────────────────────────────────────────────────
  const candidates: PageCandidate[] = [];

  for (const page of sitePages) {
    if (alreadyFlaggedPaths.has(page.path)) {
      skippedAlreadyFlagged++;
      continue;
    }

    const gsc = gscByPath.get(page.path);
    const meta = metaByPath.get(page.path);
    const kw = kwByPage.get(page.path);

    const impressions28d = gsc?._sum.impressions ?? 0;
    const avgPosition = gsc?._avg.position ?? null;
    const ctr28d = gsc?._avg.ctr ?? null;

    const reasons: string[] = [];

    // Rule 1: ranking in 5–20 with enough impressions but low CTR
    if (
      avgPosition !== null &&
      avgPosition >= MIN_RANK_POSITION &&
      avgPosition <= MAX_RANK_POSITION &&
      impressions28d >= MIN_IMPRESSIONS &&
      ctr28d !== null &&
      ctr28d < LOW_CTR_THRESHOLD
    ) {
      reasons.push(
        `Ranking avg #${avgPosition.toFixed(1)} with ${impressions28d} impressions but only ${(ctr28d * 100).toFixed(1)}% CTR — title/meta likely underperforming`
      );
    }

    // Rule 2: ranking in range with enough impressions but no metadata at all
    if (
      avgPosition !== null &&
      avgPosition >= MIN_RANK_POSITION &&
      avgPosition <= MAX_RANK_POSITION &&
      impressions28d >= MIN_IMPRESSIONS &&
      !meta
    ) {
      reasons.push(
        `Ranking avg #${avgPosition.toFixed(1)} with ${impressions28d} impressions but no metadata entry exists — page has never been AI-optimised`
      );
    }

    // Rule 3: page old enough to index but zero impressions in last 30d
    if (impressions28d === 0 && page.createdAt <= cutoffInvisible) {
      reasons.push(
        `Zero GSC impressions in last ${INVISIBLE_PAGE_DAYS} days despite being live ${Math.round((Date.now() - page.createdAt.getTime()) / 86_400_000)} days — copy likely too thin or keyword mismatch`
      );
    }

    // Rule 4: technical gaps from crawler
    if (
      meta?.crawlStatus &&
      (meta.crawlStatus.includes("missing-desc") || meta.crawlStatus.includes("missing-og"))
    ) {
      reasons.push(`Crawler flagged: ${meta.crawlStatus}`);
    }

    if (reasons.length === 0) continue;

    candidates.push({
      path: page.path,
      pageId: page.id,
      reasons,
      avgPosition,
      impressions28d,
      ctr28d,
      targetKeyword: kw?.keyword ?? null,
      currentTitle: meta?.title ?? null,
      crawlStatus: meta?.crawlStatus ?? null,
    });
  }

  // Sort by opportunity quality: most impressions first (pages with traffic are highest value)
  candidates.sort((a, b) => b.impressions28d - a.impressions28d);

  const toFlag = candidates.slice(0, MAX_INSIGHTS_PER_RUN);

  // ── Write SeoInsight rows ────────────────────────────────────────────────
  for (const candidate of toFlag) {
    try {
      const insight = await db.seoInsight.create({
        data: {
          siteId,
          type: "page_opportunity",
          status: "active",
          priority: candidate.impressions28d >= 200 ? 80 : 50,
          title: `Page opportunity: ${candidate.path}`,
          description: candidate.reasons.join(" | "),
          actionUrl: candidate.path,
          metadata: {
            path: candidate.path,
            pageId: candidate.pageId,
            avgPosition: candidate.avgPosition,
            impressions28d: candidate.impressions28d,
            ctr28d: candidate.ctr28d,
            targetKeyword: candidate.targetKeyword,
            currentTitle: candidate.currentTitle,
            crawlStatus: candidate.crawlStatus,
            reasons: candidate.reasons,
          },
        },
      });
      insightIds.push(insight.id);
    } catch (e) {
      errors.push(`${candidate.path}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (insightIds.length > 0) {
    await logEvent({
      siteId,
      type: EVENT_TYPES.AUDIT_ISSUE_DETECTED,
      title: `Page Opportunity Scout: ${insightIds.length} pages flagged`,
      payload: { paths: toFlag.map((c) => c.path), insightIds },
    });
  }

  return {
    pagesScanned: sitePages.length,
    opportunitiesFound: toFlag.length,
    insightIds,
    skippedAlreadyFlagged,
    errors,
  };
}
