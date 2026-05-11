import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getAllActiveSiteIds,
  getCronSiteId,
  runTrackedJob,
} from "@/lib/cron-runner";
import { syncGa4ForSite } from "@/lib/ga4-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/ga4-sync
 *
 * Daily cron — pulls last 7 days of GA4 page metrics for every active site
 * and upserts into PageMetrics. Skips sites that haven't selected a property.
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const explicit = getCronSiteId(req);
  const siteIds = explicit ? [explicit] : await getAllActiveSiteIds();

  const results: Array<{ siteId: string; success: boolean; durationMs: number; result?: unknown; error?: string }> = [];

  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "ga4_sync_daily", () =>
      syncGa4ForSite(siteId, { days: 7 })
    );
    results.push({
      siteId,
      success: job.success,
      durationMs: job.durationMs,
      result: job.result,
      error: job.error,
    });
  }

  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
