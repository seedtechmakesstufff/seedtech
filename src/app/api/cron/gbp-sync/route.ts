import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getAllActiveSiteIds,
  getCronSiteId,
  runTrackedJob,
} from "@/lib/cron-runner";
import { syncGbpForSite } from "@/lib/gbp-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/gbp-sync
 *
 * Daily GBP sync for every active site. Skips silently if a site hasn't
 * connected GBP (sync function throws and runTrackedJob records the failure).
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const explicit = getCronSiteId(req);
  const siteIds = explicit ? [explicit] : await getAllActiveSiteIds();

  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];
  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "gbp_sync_daily", () => syncGbpForSite(siteId));
    results.push({
      siteId,
      success: job.success,
      durationMs: job.durationMs,
      error: job.error,
    });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
