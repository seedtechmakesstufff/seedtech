import { NextRequest, NextResponse } from "next/server";
import { authenticateCron, getAllActiveSiteIds, getCronSiteId } from "@/lib/cron-runner";
import { runRegisteredAgent } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authError = authenticateCron(req);
  if (authError) return authError;

  const explicit = getCronSiteId(req);
  const siteIds = explicit ? [explicit] : await getAllActiveSiteIds();

  const results: Array<{ siteId: string; success: boolean; durationMs: number; runId: string; error?: string }> = [];
  for (const siteId of siteIds) {
    const run = await runRegisteredAgent("industry-researcher", { siteId, trigger: "cron" });
    results.push({ siteId, success: run.success, durationMs: run.durationMs, runId: run.runId, error: run.error });
  }
  return NextResponse.json({ ok: true, sites: siteIds.length, results });
}
