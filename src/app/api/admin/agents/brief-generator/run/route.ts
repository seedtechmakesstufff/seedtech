import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runBriefGenerator } from "@/lib/agents/brief-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;
  const job = await runTrackedJob(ctx.siteId, "brief_generator_manual", () => runBriefGenerator(ctx.siteId));
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Brief Generator failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...job.result });
}
