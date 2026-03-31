/* ── GSC Sync Engine ──
 *
 * Pulls keyword + page performance data from Google Search Console,
 * stores it in GscDailyKeyword / GscDailyPage tables, and updates
 * TrackedKeyword rolling metrics.
 *
 * Design: staleness-based (Option B)
 *   – On dashboard visit, check last sync time
 *   – If >STALE_HOURS old (default 6), auto-trigger a sync
 *   – Manual trigger always allowed from settings UI
 *   – ~4 GSC API calls per sync ≈ 4% of daily quota
 */

import { prisma } from "@/lib/prisma";
import {
  getKeywordPerformance,
  getPagePerformance,
  isSearchConsoleConfigured,
} from "@/lib/google-search-console";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

/* ── Configuration ── */

const STALE_HOURS = 6;
const SYNC_DAYS = 28; // pull last 28 days of data
const KEYWORD_ROW_LIMIT = 500;
const PAGE_ROW_LIMIT = 200;

/* ── Types ── */

export interface SyncResult {
  syncLogId: string;
  status: "completed" | "failed" | "skipped";
  keywordsFetched: number;
  pagesFetched: number;
  keywordsUpdated: number;
  durationMs: number;
  message: string;
}

export interface SyncStatus {
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  isStale: boolean;
  isSyncing: boolean;
  totalSyncs: number;
  lastKeywordsFetched: number;
  lastPagesFetched: number;
}

/* ── Staleness Check ── */

export async function getGscSyncStatus(
  siteId: string = DEFAULT_SITE_ID
): Promise<SyncStatus> {
  const [lastSync, runningSync, totalSyncs] = await Promise.all([
    prisma.gscSyncLog.findFirst({
      where: { siteId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gscSyncLog.findFirst({
      where: { siteId, status: "running" },
    }),
    prisma.gscSyncLog.count({
      where: { siteId, status: "completed" },
    }),
  ]);

  const lastSyncAt = lastSync?.completedAt ?? lastSync?.startedAt ?? null;
  const isStale = lastSyncAt
    ? Date.now() - lastSyncAt.getTime() > STALE_HOURS * 60 * 60 * 1000
    : true; // never synced = stale

  return {
    lastSyncAt: lastSyncAt?.toISOString() ?? null,
    lastSyncStatus: lastSync?.status ?? null,
    isStale,
    isSyncing: !!runningSync,
    totalSyncs,
    lastKeywordsFetched: lastSync?.keywordsFetched ?? 0,
    lastPagesFetched: lastSync?.pagesFetched ?? 0,
  };
}

export async function isGscStale(
  siteId: string = DEFAULT_SITE_ID
): Promise<boolean> {
  const status = await getGscSyncStatus(siteId);
  return status.isStale && !status.isSyncing;
}

/* ── Main Sync ── */

export async function syncGscData(
  siteId: string = DEFAULT_SITE_ID,
  options: { force?: boolean } = {}
): Promise<SyncResult> {
  const startTime = Date.now();

  // Check if GSC is configured
  if (!isSearchConsoleConfigured()) {
    return {
      syncLogId: "",
      status: "skipped",
      keywordsFetched: 0,
      pagesFetched: 0,
      keywordsUpdated: 0,
      durationMs: Date.now() - startTime,
      message: "GSC not configured — skipping sync",
    };
  }

  // Check staleness (skip if fresh, unless forced)
  if (!options.force) {
    const status = await getGscSyncStatus(siteId);
    if (!status.isStale) {
      return {
        syncLogId: "",
        status: "skipped",
        keywordsFetched: 0,
        pagesFetched: 0,
        keywordsUpdated: 0,
        durationMs: Date.now() - startTime,
        message: `Data is fresh (last sync: ${status.lastSyncAt}). Use force=true to override.`,
      };
    }
    if (status.isSyncing) {
      return {
        syncLogId: "",
        status: "skipped",
        keywordsFetched: 0,
        pagesFetched: 0,
        keywordsUpdated: 0,
        durationMs: Date.now() - startTime,
        message: "Sync already in progress",
      };
    }
  }

  // Create sync log entry
  const syncLog = await prisma.gscSyncLog.create({
    data: {
      siteId,
      status: "running",
      syncType: "full",
      daysRange: SYNC_DAYS,
    },
  });

  try {
    // ── 1. Fetch keyword data from GSC ──
    const keywords = await getKeywordPerformance(SYNC_DAYS, KEYWORD_ROW_LIMIT);

    // ── 2. Fetch page data from GSC ──
    const pages = await getPagePerformance(SYNC_DAYS, PAGE_ROW_LIMIT);

    // ── 3. Store keyword data (aggregate — date = today as the "pull date") ──
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (keywords.length > 0) {
      // Upsert aggregated keyword data for today
      await Promise.all(
        keywords.map((kw) =>
          prisma.gscDailyKeyword.upsert({
            where: {
              siteId_date_query_device_country: {
                siteId,
                date: today,
                query: kw.keyword,
                device: "all",
                country: "all",
              },
            },
            create: {
              siteId,
              date: today,
              query: kw.keyword,
              clicks: kw.clicks,
              impressions: kw.impressions,
              ctr: kw.ctr,
              position: kw.position,
              device: "all",
              country: "all",
            },
            update: {
              clicks: kw.clicks,
              impressions: kw.impressions,
              ctr: kw.ctr,
              position: kw.position,
            },
          })
        )
      );
    }

    // ── 4. Store page data ──
    if (pages.length > 0) {
      await Promise.all(
        pages.map((pg) =>
          prisma.gscDailyPage.upsert({
            where: {
              siteId_date_pageUrl_device_country: {
                siteId,
                date: today,
                pageUrl: pg.page,
                device: "all",
                country: "all",
              },
            },
            create: {
              siteId,
              date: today,
              pageUrl: pg.page,
              clicks: pg.clicks,
              impressions: pg.impressions,
              ctr: pg.ctr,
              position: pg.position,
              device: "all",
              country: "all",
            },
            update: {
              clicks: pg.clicks,
              impressions: pg.impressions,
              ctr: pg.ctr,
              position: pg.position,
            },
          })
        )
      );
    }

    // ── 5. Update TrackedKeyword records with latest GSC data ──
    const trackedKeywords = await prisma.trackedKeyword.findMany({
      where: { siteId, isActive: true },
    });

    let keywordsUpdated = 0;

    if (trackedKeywords.length > 0) {
      // Build a lookup map from GSC data (case-insensitive)
      const gscMap = new Map<
        string,
        { clicks: number; impressions: number; ctr: number; position: number }
      >();
      for (const kw of keywords) {
        gscMap.set(kw.keyword.toLowerCase(), {
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      }

      for (const tracked of trackedKeywords) {
        const gscData = gscMap.get(tracked.keyword.toLowerCase());
        if (!gscData) continue;

        const updateData: Record<string, unknown> = {
          previousPosition: tracked.currentPosition,
          currentPosition: gscData.position,
          clicks28d: gscData.clicks,
          impressions28d: gscData.impressions,
          ctr28d: gscData.ctr,
        };

        // Update best position if this is better (lower = better)
        if (
          tracked.bestPosition === null ||
          gscData.position < tracked.bestPosition
        ) {
          updateData.bestPosition = gscData.position;
        }

        await prisma.trackedKeyword.update({
          where: { id: tracked.id },
          data: updateData,
        });

        keywordsUpdated++;
      }
    }

    // ── 6. Update sync log ──
    const durationMs = Date.now() - startTime;
    await prisma.gscSyncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "completed",
        keywordsFetched: keywords.length,
        pagesFetched: pages.length,
        keywordsUpdated,
        completedAt: new Date(),
        durationMs,
      },
    });

    // Also log in CronJobRun for unified tracking
    await prisma.cronJobRun.create({
      data: {
        siteId,
        jobType: "gsc_pull",
        status: "completed",
        completedAt: new Date(),
        durationMs,
        resultSummary: `Fetched ${keywords.length} keywords, ${pages.length} pages. Updated ${keywordsUpdated} tracked keywords.`,
      },
    });

    return {
      syncLogId: syncLog.id,
      status: "completed",
      keywordsFetched: keywords.length,
      pagesFetched: pages.length,
      keywordsUpdated,
      durationMs,
      message: `Synced ${keywords.length} keywords, ${pages.length} pages. Updated ${keywordsUpdated} tracked keywords.`,
    };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Unknown error during GSC sync";
    const durationMs = Date.now() - startTime;

    await prisma.gscSyncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "failed",
        completedAt: new Date(),
        durationMs,
        errorMessage: errMsg,
      },
    });

    await prisma.cronJobRun.create({
      data: {
        siteId,
        jobType: "gsc_pull",
        status: "failed",
        completedAt: new Date(),
        durationMs,
        errorMessage: errMsg,
      },
    });

    return {
      syncLogId: syncLog.id,
      status: "failed",
      keywordsFetched: 0,
      pagesFetched: 0,
      keywordsUpdated: 0,
      durationMs,
      message: errMsg,
    };
  }
}

/* ── Conditional sync (for dashboard auto-trigger) ── */

export async function syncGscIfStale(
  siteId: string = DEFAULT_SITE_ID
): Promise<SyncResult | null> {
  const stale = await isGscStale(siteId);
  if (!stale) return null;
  return syncGscData(siteId);
}
