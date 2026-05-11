import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { runTrackedJob } from "@/lib/cron-runner";
import { syncGbpForSite } from "@/lib/gbp-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/admin/integrations/gbp/sync
 *
 * Manually trigger a GBP sync for the active site. Pulls accounts, locations,
 * reviews, posts, and Performance metrics. Drafts replies for new reviews.
 */
export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const job = await runTrackedJob(ctx.siteId, "gbp_sync_manual", () =>
    syncGbpForSite(ctx.siteId)
  );
  if (!job.success) {
    return NextResponse.json(
      { error: job.error ?? "GBP sync failed", durationMs: job.durationMs },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, durationMs: job.durationMs, ...job.result });
}
