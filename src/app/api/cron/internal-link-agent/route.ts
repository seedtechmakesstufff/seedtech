import { NextRequest, NextResponse } from "next/server";
import { authenticateCron, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";
import { runInternalLinkAgent } from "@/lib/agents/internal-link-agent";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

/**
 * GET /api/cron/internal-link-agent
 * Daily sweep — looks at posts published in the last 30 days that don't have
 * an open link_suggestions artifact, and queues one if links are missing.
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const siteIds = await getAllActiveSiteIds();
  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];
  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "internal_link_agent_daily", () =>
      runInternalLinkAgent(siteId, { mode: "daily" })
    );
    results.push({ siteId, success: job.success, durationMs: job.durationMs, error: job.error });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
