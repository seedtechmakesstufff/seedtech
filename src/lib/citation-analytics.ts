/**
 * Citation Analytics — Trend analysis, platform breakdown, and correlation insights.
 *
 * Aggregates AICitation data into actionable intelligence:
 *   - Mention rate trends over time (are we being cited more/less?)
 *   - Platform-level breakdown (which AI platforms cite us most?)
 *   - Query pattern analysis (what queries trigger citations?)
 *   - Competitor citation comparison
 *   - Score-to-citation correlation (does higher AI Vis score = more citations?)
 *   - Citation type and sentiment distribution
 */

import { prisma } from "@/lib/prisma";
import type { Platform } from "@/lib/citation-checker";

// ── Types ──

export interface CitationTrend {
  date: string;           // ISO date string (day or week)
  totalChecks: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number;    // brandMentions / totalChecks
  citationRate: number;   // urlCitations / totalChecks
}

export interface PlatformBreakdown {
  platform: string;
  totalChecks: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number;
  avgPosition: number | null; // avg position of brand mention
  topCitationType: string | null;
  sentiment: { positive: number; neutral: number; negative: number };
}

export interface QueryInsight {
  query: string;
  timesChecked: number;
  timesMentioned: number;
  mentionRate: number;
  platforms: string[];       // which platforms mention us for this query
  latestCitationType: string | null;
  latestSentiment: string | null;
}

export interface CompetitorComparison {
  competitorId: string;
  competitorName: string;
  competitorDomain: string;
  totalChecks: number;
  mentionCount: number;
  mentionRate: number;
  urlCitationCount: number;
  ourMentionRate: number;    // for comparison
  gap: number;               // their rate - our rate (positive = they're ahead)
}

export interface CitationScoreCorrelation {
  pageUrl: string;
  aiVisScore: number;
  contentScore: number;
  totalCitations: number;
  mentionRate: number;
}

export interface CitationDashboardData {
  currentMentionRate: number;
  previousMentionRate: number;
  mentionRateChange: number;
  totalChecksAllTime: number;
  totalMentionsAllTime: number;
  totalUrlCitations: number;
  recentTrend: CitationTrend[];
  platformBreakdown: PlatformBreakdown[];
  topQueries: QueryInsight[];
  competitorComparison: CompetitorComparison[];
  recentCitations: RecentCitation[];
  citationTypeDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
}

export interface RecentCitation {
  id: string;
  platform: string;
  query: string;
  brandMentioned: boolean;
  urlCited: string | null;
  context: string | null;
  citationType: string | null;
  sentiment: string | null;
  position: number | null;
  checkedAt: Date;
}

// ── Dashboard Aggregator ──

/**
 * Get the full citation dashboard data for a site.
 * This is the main entry point for the Citations UI tab.
 */
export async function getCitationDashboard(siteId: string): Promise<CitationDashboardData> {
  const [
    currentRate,
    previousRate,
    allTimeStats,
    trends,
    platforms,
    topQueries,
    competitors,
    recentCitations,
    typeDistribution,
    sentimentDist,
  ] = await Promise.all([
    getCurrentMentionRate(siteId),
    getPreviousMentionRate(siteId),
    getAllTimeStats(siteId),
    getCitationTrends(siteId, 30),
    getPlatformBreakdown(siteId),
    getTopQueryInsights(siteId, 15),
    getCompetitorComparison(siteId),
    getRecentCitations(siteId, 20),
    getCitationTypeDistribution(siteId),
    getSentimentDistribution(siteId),
  ]);

  return {
    currentMentionRate: currentRate,
    previousMentionRate: previousRate,
    mentionRateChange: currentRate - previousRate,
    totalChecksAllTime: allTimeStats.totalChecks,
    totalMentionsAllTime: allTimeStats.brandMentions,
    totalUrlCitations: allTimeStats.urlCitations,
    recentTrend: trends,
    platformBreakdown: platforms,
    topQueries: topQueries,
    competitorComparison: competitors,
    recentCitations: recentCitations,
    citationTypeDistribution: typeDistribution,
    sentimentDistribution: sentimentDist,
  };
}

// ── Mention Rate Tracking ──

/**
 * Get the current mention rate (from the most recent check run).
 */
async function getCurrentMentionRate(siteId: string): Promise<number> {
  const latest = await prisma.citationCheckRun.findFirst({
    where: { siteId, status: "completed" },
    orderBy: { completedAt: "desc" },
    select: { mentionRate: true },
  });
  return latest?.mentionRate ?? 0;
}

/**
 * Get the previous mention rate (second most recent completed run).
 */
async function getPreviousMentionRate(siteId: string): Promise<number> {
  const runs = await prisma.citationCheckRun.findMany({
    where: { siteId, status: "completed" },
    orderBy: { completedAt: "desc" },
    take: 2,
    select: { mentionRate: true },
  });
  return runs[1]?.mentionRate ?? 0;
}

/**
 * All-time aggregated stats.
 */
async function getAllTimeStats(siteId: string): Promise<{
  totalChecks: number;
  brandMentions: number;
  urlCitations: number;
}> {
  const result = await prisma.aICitation.aggregate({
    where: { siteId, competitorId: null },
    _count: { id: true },
  });

  const mentionCount = await prisma.aICitation.count({
    where: { siteId, competitorId: null, brandMentioned: true },
  });

  const urlCount = await prisma.aICitation.count({
    where: { siteId, competitorId: null, urlCited: { not: null } },
  });

  return {
    totalChecks: result._count.id,
    brandMentions: mentionCount,
    urlCitations: urlCount,
  };
}

// ── Trend Analysis ──

/**
 * Get daily citation trends for the past N days.
 */
export async function getCitationTrends(
  siteId: string,
  days: number = 30
): Promise<CitationTrend[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Get completed runs within the window
  const runs = await prisma.citationCheckRun.findMany({
    where: {
      siteId,
      status: "completed",
      completedAt: { gte: since },
    },
    orderBy: { completedAt: "asc" },
    select: {
      completedAt: true,
      brandMentions: true,
      urlCitations: true,
      mentionRate: true,
      totalQueries: true,
      totalPlatforms: true,
    },
  });

  // Aggregate by day
  const dayMap = new Map<string, CitationTrend>();

  for (const run of runs) {
    if (!run.completedAt) continue;
    const dayKey = run.completedAt.toISOString().split("T")[0];
    const totalChecks = run.totalQueries * run.totalPlatforms;

    const existing = dayMap.get(dayKey);
    if (existing) {
      existing.totalChecks += totalChecks;
      existing.brandMentions += run.brandMentions;
      existing.urlCitations += run.urlCitations;
      existing.mentionRate = existing.totalChecks > 0
        ? existing.brandMentions / existing.totalChecks
        : 0;
      existing.citationRate = existing.totalChecks > 0
        ? existing.urlCitations / existing.totalChecks
        : 0;
    } else {
      dayMap.set(dayKey, {
        date: dayKey,
        totalChecks,
        brandMentions: run.brandMentions,
        urlCitations: run.urlCitations,
        mentionRate: totalChecks > 0 ? run.brandMentions / totalChecks : 0,
        citationRate: totalChecks > 0 ? run.urlCitations / totalChecks : 0,
      });
    }
  }

  return Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// ── Platform Breakdown ──

/**
 * Get citation stats broken down by platform.
 */
export async function getPlatformBreakdown(siteId: string): Promise<PlatformBreakdown[]> {
  const platforms: Platform[] = ["perplexity", "chatgpt", "google_aio", "gemini", "copilot"];
  const results: PlatformBreakdown[] = [];

  for (const platform of platforms) {
    const total = await prisma.aICitation.count({
      where: { siteId, platform, competitorId: null },
    });

    if (total === 0) continue;

    const mentioned = await prisma.aICitation.count({
      where: { siteId, platform, competitorId: null, brandMentioned: true },
    });

    const urlCited = await prisma.aICitation.count({
      where: { siteId, platform, competitorId: null, urlCited: { not: null } },
    });

    // Average position of brand mentions
    const positionAgg = await prisma.aICitation.aggregate({
      where: { siteId, platform, competitorId: null, brandMentioned: true, position: { not: null } },
      _avg: { position: true },
    });

    // Citation type distribution for this platform
    const typeCounts = await prisma.aICitation.groupBy({
      by: ["citationType"],
      where: { siteId, platform, competitorId: null, citationType: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Sentiment distribution
    const sentimentCounts = await prisma.aICitation.groupBy({
      by: ["sentiment"],
      where: { siteId, platform, competitorId: null, sentiment: { not: null } },
      _count: { id: true },
    });

    const sentimentMap = { positive: 0, neutral: 0, negative: 0 };
    for (const s of sentimentCounts) {
      if (s.sentiment && s.sentiment in sentimentMap) {
        sentimentMap[s.sentiment as keyof typeof sentimentMap] = s._count.id;
      }
    }

    results.push({
      platform,
      totalChecks: total,
      brandMentions: mentioned,
      urlCitations: urlCited,
      mentionRate: mentioned / total,
      avgPosition: positionAgg._avg.position,
      topCitationType: typeCounts[0]?.citationType ?? null,
      sentiment: sentimentMap,
    });
  }

  return results.sort((a, b) => b.mentionRate - a.mentionRate);
}

// ── Query Insights ──

/**
 * Get the top queries by mention rate — which searches trigger AI citations?
 */
export async function getTopQueryInsights(
  siteId: string,
  limit: number = 15
): Promise<QueryInsight[]> {
  // Group citations by query
  const queryGroups = await prisma.aICitation.groupBy({
    by: ["query"],
    where: { siteId, competitorId: null },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit * 2, // get extra to sort by mention rate
  });

  const insights: QueryInsight[] = [];

  for (const group of queryGroups) {
    const mentioned = await prisma.aICitation.count({
      where: { siteId, query: group.query, competitorId: null, brandMentioned: true },
    });

    // Get which platforms mention us for this query
    const platformHits = await prisma.aICitation.findMany({
      where: { siteId, query: group.query, competitorId: null, brandMentioned: true },
      select: { platform: true },
      distinct: ["platform"],
    });

    // Get latest citation info
    const latest = await prisma.aICitation.findFirst({
      where: { siteId, query: group.query, competitorId: null, brandMentioned: true },
      orderBy: { checkedAt: "desc" },
      select: { citationType: true, sentiment: true },
    });

    insights.push({
      query: group.query,
      timesChecked: group._count.id,
      timesMentioned: mentioned,
      mentionRate: mentioned / group._count.id,
      platforms: platformHits.map((p) => p.platform),
      latestCitationType: latest?.citationType ?? null,
      latestSentiment: latest?.sentiment ?? null,
    });
  }

  return insights
    .sort((a, b) => b.mentionRate - a.mentionRate || b.timesMentioned - a.timesMentioned)
    .slice(0, limit);
}

// ── Competitor Comparison ──

/**
 * Compare our citation rate against competitors.
 */
export async function getCompetitorComparison(
  siteId: string
): Promise<CompetitorComparison[]> {
  // Get our overall mention rate
  const ourTotal = await prisma.aICitation.count({
    where: { siteId, competitorId: null },
  });
  const ourMentions = await prisma.aICitation.count({
    where: { siteId, competitorId: null, brandMentioned: true },
  });
  const ourMentionRate = ourTotal > 0 ? ourMentions / ourTotal : 0;

  // Get competitors
  const competitors = await prisma.competitorDomain.findMany({
    where: { siteId, isActive: true },
    select: { id: true, name: true, domain: true },
  });

  const results: CompetitorComparison[] = [];

  for (const comp of competitors) {
    const compTotal = await prisma.aICitation.count({
      where: { siteId, competitorId: comp.id },
    });

    const compMentions = await prisma.aICitation.count({
      where: { siteId, competitorId: comp.id, brandMentioned: true },
    });

    const compUrlCitations = await prisma.aICitation.count({
      where: { siteId, competitorId: comp.id, urlCited: { not: null } },
    });

    const compRate = compTotal > 0 ? compMentions / compTotal : 0;

    results.push({
      competitorId: comp.id,
      competitorName: comp.name,
      competitorDomain: comp.domain,
      totalChecks: compTotal,
      mentionCount: compMentions,
      mentionRate: compRate,
      urlCitationCount: compUrlCitations,
      ourMentionRate,
      gap: compRate - ourMentionRate,
    });
  }

  return results.sort((a, b) => b.mentionRate - a.mentionRate);
}

// ── Recent Citations ──

/**
 * Get recent citations (our brand, not competitor records).
 */
async function getRecentCitations(
  siteId: string,
  limit: number = 20
): Promise<RecentCitation[]> {
  const citations = await prisma.aICitation.findMany({
    where: { siteId, competitorId: null, brandMentioned: true },
    orderBy: { checkedAt: "desc" },
    take: limit,
    select: {
      id: true,
      platform: true,
      query: true,
      brandMentioned: true,
      urlCited: true,
      context: true,
      citationType: true,
      sentiment: true,
      position: true,
      checkedAt: true,
    },
  });

  return citations;
}

// ── Distribution Analysis ──

/**
 * Citation type distribution.
 */
async function getCitationTypeDistribution(
  siteId: string
): Promise<Record<string, number>> {
  const groups = await prisma.aICitation.groupBy({
    by: ["citationType"],
    where: { siteId, competitorId: null, citationType: { not: null } },
    _count: { id: true },
  });

  const dist: Record<string, number> = {};
  for (const g of groups) {
    if (g.citationType) {
      dist[g.citationType] = g._count.id;
    }
  }
  return dist;
}

/**
 * Sentiment distribution.
 */
async function getSentimentDistribution(
  siteId: string
): Promise<Record<string, number>> {
  const groups = await prisma.aICitation.groupBy({
    by: ["sentiment"],
    where: { siteId, competitorId: null, sentiment: { not: null } },
    _count: { id: true },
  });

  const dist: Record<string, number> = {};
  for (const g of groups) {
    if (g.sentiment) {
      dist[g.sentiment] = g._count.id;
    }
  }
  return dist;
}

// ── Score-to-Citation Correlation ──

/**
 * Correlate AI Visibility scores with actual citation rates.
 * This validates whether our scoring engine predicts real citations.
 */
export async function getScoreCitationCorrelation(
  siteId: string
): Promise<CitationScoreCorrelation[]> {
  // Get pages with both scores and citations
  const scores = await prisma.aIVisibilityScore.findMany({
    where: { siteId },
    orderBy: { scoredAt: "desc" },
    distinct: ["pageUrl"],
    select: {
      pageUrl: true,
      overallScore: true,
    },
  });

  const contentScores = await prisma.contentScore.findMany({
    where: { siteId },
    orderBy: { scoredAt: "desc" },
    distinct: ["pageUrl"],
    select: {
      pageUrl: true,
      overallScore: true,
    },
  });

  const contentScoreMap = new Map(contentScores.map((s) => [s.pageUrl, s.overallScore]));

  // For each scored page, check how often it appears as a citation URL
  const correlations: CitationScoreCorrelation[] = [];

  for (const score of scores) {
    // Count citations where our URL was cited
    const totalCitations = await prisma.aICitation.count({
      where: {
        siteId,
        competitorId: null,
        urlCited: { contains: score.pageUrl },
      },
    });

    const mentionedCount = await prisma.aICitation.count({
      where: {
        siteId,
        competitorId: null,
        brandMentioned: true,
        urlCited: { contains: score.pageUrl },
      },
    });

    const totalForPage = await prisma.aICitation.count({
      where: {
        siteId,
        competitorId: null,
        urlCited: { contains: score.pageUrl },
      },
    });

    correlations.push({
      pageUrl: score.pageUrl,
      aiVisScore: score.overallScore,
      contentScore: contentScoreMap.get(score.pageUrl) ?? 0,
      totalCitations: totalCitations,
      mentionRate: totalForPage > 0 ? mentionedCount / totalForPage : 0,
    });
  }

  return correlations.sort((a, b) => b.aiVisScore - a.aiVisScore);
}
