import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runStrategyAnalyst } from "@/lib/agents/strategy-analyst";
import { runBriefGenerator } from "@/lib/agents/brief-generator";
import { runGbpPostDrafter } from "@/lib/agents/gbp-post-drafter";
import { runKeywordScout } from "@/lib/agents/keyword-scout";
import { runContentDecayWatcher } from "@/lib/agents/content-decay-watcher";
import { runInternalLinkAgent } from "@/lib/agents/internal-link-agent";
import { runIndustryResearcher } from "@/lib/agents/industry-researcher";
import { sendWeeklyDigest } from "@/lib/weekly-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

/**
 * POST /api/admin/agents/run-all
 *
 * Runs the full weekly agent pipeline in the canonical order: every step that
 * Monday's cron schedule would fire, plus daily-cron agents that benefit from
 * an immediate kick. Sequential, with one CronJobRun per agent so failures
 * are surfaced individually. Does NOT run the Blog Drafter — that one consumes
 * approved briefs, which the human just produced. Approve the briefs first,
 * then click Draft now (or wait for the daily cron at 10 AM UTC).
 */
export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  type Step = { name: string; run: () => Promise<unknown> };
  const steps: Step[] = [
    { name: "industry_researcher", run: () => runIndustryResearcher(ctx.siteId) },
    { name: "keyword_scout", run: () => runKeywordScout(ctx.siteId) },
    { name: "content_decay_watcher", run: () => runContentDecayWatcher(ctx.siteId) },
    { name: "internal_link_agent", run: () => runInternalLinkAgent(ctx.siteId, { mode: "daily" }) },
    { name: "strategy_analyst", run: () => runStrategyAnalyst(ctx.siteId) },
    { name: "brief_generator", run: () => runBriefGenerator(ctx.siteId) },
    { name: "gbp_post_drafter", run: () => runGbpPostDrafter(ctx.siteId) },
    { name: "weekly_digest", run: () => sendWeeklyDigest({ siteId: ctx.siteId }) },
  ];

  const results: Array<{
    step: string;
    success: boolean;
    durationMs: number;
    result?: unknown;
    error?: string;
  }> = [];
  const overallStart = Date.now();
  for (const step of steps) {
    const job = await runTrackedJob(ctx.siteId, `runall_${step.name}`, step.run);
    results.push({
      step: step.name,
      success: job.success,
      durationMs: job.durationMs,
      result: job.result,
      error: job.error,
    });
  }
  return NextResponse.json({
    ok: true,
    durationMs: Date.now() - overallStart,
    steps: results,
  });
}
