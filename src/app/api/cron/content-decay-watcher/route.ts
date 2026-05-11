import { NextRequest, NextResponse } from "next/server";
import { authenticateCron, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";
import { runContentDecayWatcher } from "@/lib/agents/content-decay-watcher";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const siteIds = await getAllActiveSiteIds();
  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];
  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "content_decay_watcher_daily", () =>
      runContentDecayWatcher(siteId)
    );
    results.push({ siteId, success: job.success, durationMs: job.durationMs, error: job.error });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
