import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runKeywordScout } from "@/lib/agents/keyword-scout";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;
  const job = await runTrackedJob(ctx.siteId, "keyword_scout_manual", () =>
    runKeywordScout(ctx.siteId)
  );
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Keyword Scout failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...job.result });
}
