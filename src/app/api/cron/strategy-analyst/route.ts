import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getAllActiveSiteIds,
  getCronSiteId,
  runTrackedJob,
} from "@/lib/cron-runner";
import { runStrategyAnalyst } from "@/lib/agents/strategy-analyst";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/strategy-analyst
 *
 * Weekly cron — runs the Strategy Analyst for every active site. Scheduled
 * for Monday 8 AM UTC, after the SEO snapshot (6 AM) and GA4 sync (7 AM)
 * so the analyst's brief reflects the freshest data.
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const explicit = getCronSiteId(req);
  const siteIds = explicit ? [explicit] : await getAllActiveSiteIds();

  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];

  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "strategy_analyst_weekly", () =>
      runStrategyAnalyst(siteId)
    );
    results.push({
      siteId,
      success: job.success,
      durationMs: job.durationMs,
      error: job.error,
    });
  }

  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
