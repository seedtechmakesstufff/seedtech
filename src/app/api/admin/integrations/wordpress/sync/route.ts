import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { runTrackedJob } from "@/lib/cron-runner";
import { syncWordPressForSite } from "@/lib/wordpress-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/admin/integrations/wordpress/sync
 * Manually trigger a WordPress post/page sync for the active site.
 */
export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const job = await runTrackedJob(ctx.siteId, "wordpress_sync_manual", () =>
    syncWordPressForSite(ctx.siteId)
  );

  if (!job.success) {
    return NextResponse.json(
      { error: job.error ?? "WordPress sync failed", durationMs: job.durationMs },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, durationMs: job.durationMs, ...job.result });
}
