/* ── GA4 Sync ──
 * Pulls daily page-level metrics from GA4 and upserts them into PageMetrics.
 * Used by both the daily cron and the manual "Sync now" button.
 */

import { prisma } from "@/lib/prisma";
import { fetchGa4DailyPageMetrics, getGa4PropertyForSite } from "@/lib/ga4";
import { EVENT_TYPES, logEvent } from "@/lib/events";

export interface Ga4SyncResult {
  property: string;
  rowsFetched: number;
  rowsUpserted: number;
  startDate: string;
  endDate: string;
}

/**
 * Pull the last `days` days of GA4 page metrics for a site and upsert into page_metrics.
 * Skips silently if no property has been selected yet.
 */
export async function syncGa4ForSite(
  siteId: string,
  options?: { days?: number }
): Promise<Ga4SyncResult | { skipped: string }> {
  const property = await getGa4PropertyForSite(siteId);
  if (!property) {
    return { skipped: "no_property_selected" };
  }

  const days = options?.days ?? 7;
  const startDate = `${days}daysAgo`;
  const endDate = "yesterday";

  const rows = await fetchGa4DailyPageMetrics(siteId, property, { startDate, endDate });

  let upserted = 0;
  for (const r of rows) {
    await prisma.pageMetrics.upsert({
      where: {
        siteId_url_date_source: {
          siteId,
          url: r.pagePath,
          date: new Date(r.date),
          source: "ga4",
        },
      },
      update: {
        sessions: r.sessions,
        users: r.users,
        engagedSessions: r.engagedSessions,
        engagementRate: r.engagementRate,
        averageEngagementTime: r.averageEngagementTime,
        bounceRate: r.bounceRate,
        conversions: r.conversions,
        revenue: r.revenue,
      },
      create: {
        siteId,
        url: r.pagePath,
        date: new Date(r.date),
        source: "ga4",
        sessions: r.sessions,
        users: r.users,
        engagedSessions: r.engagedSessions,
        engagementRate: r.engagementRate,
        averageEngagementTime: r.averageEngagementTime,
        bounceRate: r.bounceRate,
        conversions: r.conversions,
        revenue: r.revenue,
      },
    });
    upserted++;
  }

  // Detect conversion spikes/drops vs the prior period and log events
  await detectConversionAnomalies(siteId, days);

  return {
    property,
    rowsFetched: rows.length,
    rowsUpserted: upserted,
    startDate,
    endDate,
  };
}

/**
 * Compare last `days` window vs the prior `days` window (per URL) and emit
 * events when conversions roughly doubled or dropped to zero. Threshold tuning
 * lives here — agents trust the events, they don't recompute.
 */
async function detectConversionAnomalies(siteId: string, days: number) {
  const now = new Date();
  const recentStart = new Date(now);
  recentStart.setUTCDate(recentStart.getUTCDate() - days);
  const priorStart = new Date(recentStart);
  priorStart.setUTCDate(priorStart.getUTCDate() - days);

  const all = await prisma.pageMetrics.findMany({
    where: { siteId, source: "ga4", date: { gte: priorStart, lt: now } },
    select: { url: true, date: true, conversions: true },
  });

  const byUrl = new Map<string, { recent: number; prior: number }>();
  for (const r of all) {
    const bucket = r.date >= recentStart ? "recent" : "prior";
    const cur = byUrl.get(r.url) ?? { recent: 0, prior: 0 };
    cur[bucket] += r.conversions;
    byUrl.set(r.url, cur);
  }

  for (const [url, { recent, prior }] of Array.from(byUrl.entries())) {
    if (recent >= 3 && recent >= prior * 2) {
      await logEvent({
        siteId,
        type: EVENT_TYPES.METRICS_CONVERSION_SPIKE,
        severity: "info",
        title: `Conversions surged on ${url}`,
        body: `Last ${days}d: ${recent} conversions vs prior ${days}d: ${prior}`,
        payload: { url, recent, prior, window_days: days },
        entityType: "PageMetrics",
        entityId: url,
      });
    } else if (prior >= 3 && recent === 0) {
      await logEvent({
        siteId,
        type: EVENT_TYPES.METRICS_CONVERSION_DROP,
        severity: "warn",
        title: `Conversions dropped to zero on ${url}`,
        body: `Prior ${days}d had ${prior} conversions; last ${days}d has none`,
        payload: { url, recent, prior, window_days: days },
        entityType: "PageMetrics",
        entityId: url,
      });
    }
  }
}
