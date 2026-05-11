import { NextRequest, NextResponse } from "next/server";
import { authenticateCron, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";
import { runKeywordScout } from "@/lib/agents/keyword-scout";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const siteIds = await getAllActiveSiteIds();
  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];
  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "keyword_scout_weekly", () =>
      runKeywordScout(siteId)
    );
    results.push({ siteId, success: job.success, durationMs: job.durationMs, error: job.error });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
