import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runContentDecayWatcher } from "@/lib/agents/content-decay-watcher";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;
  const job = await runTrackedJob(ctx.siteId, "content_decay_watcher_manual", () =>
    runContentDecayWatcher(ctx.siteId)
  );
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Watcher failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...job.result });
}
