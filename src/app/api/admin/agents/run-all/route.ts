import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runRegisteredAgent, type AgentKey } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

/**
 * POST /api/admin/agents/run-all
 *
 * Runs the full weekly agent pipeline in dependency order. Each step is
 * wrapped in its own AgentRun (trigger=run_all) so failures are surfaced
 * individually. Does NOT run the Blog Drafter — that consumes approved
 * briefs, which the human just produced. Approve the briefs first, then
 * click "Draft now" (or wait for the daily 10 AM UTC cron).
 */
export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const STEPS: AgentKey[] = [
    "industry-researcher",
    "keyword-scout",
    "content-decay-watcher",
    "page-opportunity-scout",
    "internal-link-agent",
    "strategy-analyst",
    "brief-generator",
    "page-drafter",
    "gbp-post-drafter",
    "weekly-digest",
  ];

  const results: Array<{
    agent: AgentKey;
    success: boolean;
    durationMs: number;
    runId: string;
    error?: string;
    result?: unknown;
  }> = [];

  const overallStart = Date.now();
  for (const key of STEPS) {
    const run = await runRegisteredAgent(key, { siteId: ctx.siteId, trigger: "run_all" });
    results.push({
      agent: key,
      success: run.success,
      durationMs: run.durationMs,
      runId: run.runId,
      error: run.error,
      result: run.result,
    });
  }

  return NextResponse.json({
    ok: true,
    durationMs: Date.now() - overallStart,
    steps: results,
  });
}
