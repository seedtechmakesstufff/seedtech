import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runStrategyAnalyst } from "@/lib/agents/strategy-analyst";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/admin/agents/strategy-analyst/run
 *
 * Manual trigger for the Strategy Analyst agent. Generates a fresh weekly
 * priorities brief, deactivates the previous one, and emits an
 * agent.run_completed event.
 */
export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const job = await runTrackedJob(ctx.siteId, "strategy_analyst_manual", () =>
    runStrategyAnalyst(ctx.siteId)
  );

  if (!job.success) {
    return NextResponse.json(
      { error: job.error ?? "Strategy Analyst failed", durationMs: job.durationMs },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, ...job.result });
}
