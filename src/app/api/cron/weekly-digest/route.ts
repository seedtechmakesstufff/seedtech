import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getAllActiveSiteIds,
  runTrackedJob,
} from "@/lib/cron-runner";
import { sendWeeklyDigest } from "@/lib/weekly-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/weekly-digest
 *
 * Weekly cron — Monday 11 AM UTC, after all Monday agents fire. Each site's
 * recipients come from ReportPreference / EmailConfig / env (see
 * resolveDigestRecipients in weekly-digest.ts).
 */
export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const siteIds = await getAllActiveSiteIds();
  const results: Array<{ siteId: string; success: boolean; durationMs: number; error?: string }> = [];

  for (const siteId of siteIds) {
    const job = await runTrackedJob(siteId, "weekly_digest", () => sendWeeklyDigest({ siteId }));
    results.push({
      siteId,
      success: job.success,
      durationMs: job.durationMs,
      error: job.error,
    });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
