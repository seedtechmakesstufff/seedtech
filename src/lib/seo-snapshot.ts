/* ── SEO Snapshot Service ──
 * Creates weekly snapshots of GSC data + health score.
 * Powers keyword position history and trend charts.
 */

import { prisma } from "@/lib/prisma";
import {
  isSearchConsoleConfigured,
  getSearchConsoleSummary,
  getTrackedKeywordPositions,
} from "@/lib/google-search-console";
import { auditSite } from "@/lib/pagespeed";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import {
  getTrackedKeywordStrings,
  getSiteKeyPagePaths,
  getSiteUrl,
  getSearchConsoleIntegration,
  updateKeywordPositions,
} from "@/lib/site-data";

export interface SnapshotResult {
  id: string;
  date: Date;
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  healthScore: number;
  performanceScore: number;
  seoScore: number;
  keywordPositions: Record<string, number | null>;
}

/**
 * Calculate aggregate site health score (0-100).
 * Weighted: 35% PageSpeed perf, 15% PageSpeed SEO, 35% avg position, 15% CTR
 */
export function calculateHealthScore(params: {
  performanceScore?: number;  // 0-100
  seoScore?: number;          // 0-100
  avgPosition?: number;       // 1-100 (lower is better)
  avgCtr?: number;            // 0-1
}): number {
  const {
    performanceScore = 50,
    seoScore = 50,
    avgPosition = 50,
    avgCtr = 0.02,
  } = params;

  // Position score: position 1 = 100, position 10 = 50, position 50+ = 10
  const positionScore = Math.max(10, Math.min(100, 110 - (avgPosition * 6)));

  // CTR score: 10%+ = 100, 5% = 70, 2% = 40, 0% = 0
  const ctrScore = Math.min(100, avgCtr * 1000);

  const weighted =
    (performanceScore * 0.35) +
    (seoScore * 0.15) +
    (positionScore * 0.35) +
    (ctrScore * 0.15);

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

/**
 * Take a snapshot of current SEO state and store in DB.
 * Call this from a cron job (weekly) or manually from the dashboard.
 */
export async function takeSnapshot(
  siteId: string = DEFAULT_SITE_ID
): Promise<SnapshotResult> {
  let totalClicks = 0;
  let totalImpressions = 0;
  let avgCtr = 0;
  let avgPosition = 0;
  let keywordPositions: Record<string, number | null> = {};
  let topPages: { page: string; clicks: number; impressions: number }[] = [];
  let performanceScore = 0;
  let seoScore = 0;

  // Load integration + keywords from DB
  const integration = await getSearchConsoleIntegration(siteId);

  // Fetch GSC data
  if (isSearchConsoleConfigured(integration)) {
    try {
      const keywords = await getTrackedKeywordStrings(siteId);
      const [summary, positions] = await Promise.all([
        getSearchConsoleSummary(28, integration),
        getTrackedKeywordPositions(keywords, 28, integration),
      ]);
      totalClicks = summary.totalClicks;
      totalImpressions = summary.totalImpressions;
      avgCtr = summary.avgCtr;
      avgPosition = summary.avgPosition;
      keywordPositions = positions;
      topPages = summary.topPages.slice(0, 20).map((p) => ({
        page: p.page,
        clicks: p.clicks,
        impressions: p.impressions,
      }));

      // Update keyword positions in DB
      await updateKeywordPositions(siteId, positions);
    } catch {
      // GSC fetch failed — continue with zeros
    }
  }

  // Fetch PageSpeed data using key pages from SitePage inventory
  try {
    const siteUrl = await getSiteUrl(siteId);
    const keyPages = await getSiteKeyPagePaths(siteId);
    const pagesToAudit = keyPages.length > 0 ? keyPages.slice(0, 5) : ["/"];
    const psResult = await auditSite(siteUrl, pagesToAudit, "mobile");
    if (psResult.pages.length > 0) {
      performanceScore = psResult.avgPerformance;
      seoScore = psResult.avgSeo;
    }
  } catch {
    // PageSpeed failed — continue
  }

  const healthScore = calculateHealthScore({
    performanceScore,
    seoScore,
    avgPosition,
    avgCtr,
  });

  const snapshot = await prisma.seoSnapshot.create({
    data: {
      siteId,
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
      healthScore,
      performanceScore,
      seoScore,
      keywordPositions: keywordPositions as object,
      topPages: topPages as object[],
    },
  });

  return {
    id: snapshot.id,
    date: snapshot.date,
    totalClicks,
    totalImpressions,
    avgCtr,
    avgPosition,
    healthScore,
    performanceScore,
    seoScore,
    keywordPositions,
  };
}

/**
 * Get snapshot history for trend charts.
 */
export async function getSnapshotHistory(limit = 12, siteId: string = DEFAULT_SITE_ID) {
  const snapshots = await prisma.seoSnapshot.findMany({
    where: { siteId },
    orderBy: { date: "desc" },
    take: limit,
  });

  return snapshots.reverse().map((s) => ({
    id: s.id,
    date: s.date,
    totalClicks: s.totalClicks,
    totalImpressions: s.totalImpressions,
    avgCtr: s.avgCtr,
    avgPosition: s.avgPosition,
    healthScore: s.healthScore,
    performanceScore: s.performanceScore,
    seoScore: s.seoScore,
    keywordPositions: s.keywordPositions as Record<string, number | null>,
    topPages: s.topPages as { page: string; clicks: number; impressions: number }[],
  }));
}

/**
 * Get keyword position trends — for each tracked keyword, return
 * an array of { date, position } entries for sparkline charts.
 */
export async function getKeywordTrends(limit = 12, siteId: string = DEFAULT_SITE_ID) {
  const snapshots = await prisma.seoSnapshot.findMany({
    where: { siteId },
    orderBy: { date: "desc" },
    take: limit,
    select: { date: true, keywordPositions: true },
  });

  const reversed = snapshots.reverse();
  const keywords = await getTrackedKeywordStrings(siteId);
  const trends: Record<string, { date: Date; position: number | null }[]> = {};

  for (const kw of keywords) {
    trends[kw] = reversed.map((s) => ({
      date: s.date,
      position: (s.keywordPositions as Record<string, number | null>)?.[kw] ?? null,
    }));
  }

  return trends;
}
