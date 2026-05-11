import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { runTrackedJob } from "@/lib/cron-runner";
import { syncGa4ForSite } from "@/lib/ga4-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/admin/integrations/ga4/sync
 * Body: { days?: number }
 *
 * Manually triggers a GA4 sync for the active site. Useful for testing
 * the integration immediately after connecting without waiting for the
 * daily cron.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { days?: number };
  const days = body.days && Number.isFinite(body.days) ? Math.min(90, Math.max(1, body.days)) : 7;

  const job = await runTrackedJob(ctx.siteId, "ga4_sync_manual", () =>
    syncGa4ForSite(ctx.siteId, { days })
  );

  if (!job.success) {
    return NextResponse.json(
      { error: job.error ?? "GA4 sync failed", durationMs: job.durationMs },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, durationMs: job.durationMs, ...job.result });
}
