import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getAllActiveSiteIds,
  getCronSiteId,
  runTrackedJob,
} from "@/lib/cron-runner";
import { syncWordPressForSite } from "@/lib/wordpress-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/wordpress-sync
 *
 * Daily WordPress content sync for every active site that has a WordPress
 * credential configured. Sites without the integration are silently skipped.
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const explicit = getCronSiteId(req);
  const siteIds = explicit ? [explicit] : await getAllActiveSiteIds();

  const results: Array<{
    siteId: string;
    success: boolean;
    durationMs: number;
    error?: string;
    postsUpserted?: number;
  }> = [];

  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "wordpress_sync_daily", () =>
      syncWordPressForSite(siteId)
    );
    results.push({
      siteId,
      success: job.success,
      durationMs: job.durationMs,
      error: job.error,
      postsUpserted: job.result?.postsUpserted,
    });
  }

  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
