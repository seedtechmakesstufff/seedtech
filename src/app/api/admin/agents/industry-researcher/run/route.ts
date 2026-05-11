import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runIndustryResearcher } from "@/lib/agents/industry-researcher";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const job = await runTrackedJob(ctx.siteId, "industry_researcher_manual", () => runIndustryResearcher(ctx.siteId));
  return NextResponse.json({ ok: job.success, result: job.result, error: job.error, durationMs: job.durationMs });
}
