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
import { TRACKED_KEYWORDS } from "@/data/seo-strategy";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

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
 * Weighted: 40% PageSpeed perf, 20% PageSpeed SEO, 30% avg position, 10% CTR
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
export async function takeSnapshot(): Promise<SnapshotResult> {
  let totalClicks = 0;
  let totalImpressions = 0;
  let avgCtr = 0;
  let avgPosition = 0;
  let keywordPositions: Record<string, number | null> = {};
  let topPages: { page: string; clicks: number; impressions: number }[] = [];
  let performanceScore = 0;
  let seoScore = 0;

  // Fetch GSC data
  if (isSearchConsoleConfigured()) {
    try {
      const [summary, positions] = await Promise.all([
        getSearchConsoleSummary(28),
        getTrackedKeywordPositions(TRACKED_KEYWORDS.map((k) => k.keyword), 28),
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
    } catch {
      // GSC fetch failed — continue with zeros
    }
  }

  // Fetch PageSpeed data (homepage only for speed)
  try {
    const siteUrl =
      process.env.GOOGLE_SEARCH_CONSOLE_SITE?.replace("sc-domain:", "https://") ||
      process.env.NEXTAUTH_URL ||
      "https://seedtechllc.com";
    const psResult = await auditSite(siteUrl, ["/"], "mobile");
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
      siteId: DEFAULT_SITE_ID,
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
export async function getSnapshotHistory(limit = 12) {
  const snapshots = await prisma.seoSnapshot.findMany({
    where: { siteId: DEFAULT_SITE_ID },
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
export async function getKeywordTrends(limit = 12) {
  const snapshots = await prisma.seoSnapshot.findMany({
    where: { siteId: DEFAULT_SITE_ID },
    orderBy: { date: "desc" },
    take: limit,
    select: { date: true, keywordPositions: true },
  });

  const reversed = snapshots.reverse();
  const trends: Record<string, { date: Date; position: number | null }[]> = {};

  for (const kw of TRACKED_KEYWORDS) {
    trends[kw.keyword] = reversed.map((s) => ({
      date: s.date,
      position: (s.keywordPositions as Record<string, number | null>)?.[kw.keyword] ?? null,
    }));
  }

  return trends;
}
