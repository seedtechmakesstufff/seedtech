import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runGbpPostDrafter } from "@/lib/agents/gbp-post-drafter";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;
  const job = await runTrackedJob(ctx.siteId, "gbp_post_drafter_manual", () => runGbpPostDrafter(ctx.siteId));
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "GBP Post Drafter failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...job.result });
}
