import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/agents/runs?window=7d|30d|all&agent=<key>
 *
 * Returns:
 *   - summary: per-agent rollup (runs, success rate, p50/p95 duration,
 *     artifacts, token + cost totals) within the window
 *   - recent: the 50 most recent AgentRun rows in the window (optionally
 *     filtered by agentKey)
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const window = req.nextUrl.searchParams.get("window") ?? "7d";
  const agentKey = req.nextUrl.searchParams.get("agent") ?? undefined;

  const since = (() => {
    if (window === "all") return undefined;
    const days = window === "30d" ? 30 : 7;
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    return d;
  })();

  const where = {
    siteId: ctx.siteId,
    ...(since ? { startedAt: { gte: since } } : {}),
    ...(agentKey ? { agentKey } : {}),
  };

  const [recent, all] = await Promise.all([
    prisma.agentRun.findMany({
      where,
      orderBy: { startedAt: "desc" },
      take: 50,
      select: {
        id: true,
        agentKey: true,
        trigger: true,
        status: true,
        startedAt: true,
        completedAt: true,
        durationMs: true,
        model: true,
        tokensIn: true,
        tokensOut: true,
        costEstimateUsd: true,
        artifactsCreated: true,
        resultSummary: true,
        error: true,
      },
    }),
    prisma.agentRun.findMany({
      where,
      select: {
        agentKey: true,
        status: true,
        durationMs: true,
        tokensIn: true,
        tokensOut: true,
        costEstimateUsd: true,
        artifactsCreated: true,
      },
    }),
  ]);

  const byAgent = new Map<string, {
    agent: string;
    runs: number;
    completed: number;
    failed: number;
    running: number;
    durations: number[];
    tokensIn: number;
    tokensOut: number;
    costUsd: number;
    artifacts: number;
  }>();
  for (const r of all) {
    const k = r.agentKey;
    let agg = byAgent.get(k);
    if (!agg) {
      agg = {
        agent: k, runs: 0, completed: 0, failed: 0, running: 0,
        durations: [], tokensIn: 0, tokensOut: 0, costUsd: 0, artifacts: 0,
      };
      byAgent.set(k, agg);
    }
    agg.runs++;
    if (r.status === "completed") agg.completed++;
    else if (r.status === "failed") agg.failed++;
    else if (r.status === "running") agg.running++;
    if (typeof r.durationMs === "number") agg.durations.push(r.durationMs);
    agg.tokensIn += r.tokensIn ?? 0;
    agg.tokensOut += r.tokensOut ?? 0;
    agg.costUsd += r.costEstimateUsd ? Number(r.costEstimateUsd) : 0;
    agg.artifacts += r.artifactsCreated ?? 0;
  }

  const summary = Array.from(byAgent.values())
    .map((a) => {
      const sorted = a.durations.slice().sort((x, y) => x - y);
      const pct = (p: number) =>
        sorted.length === 0 ? null : sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p))];
      const successRate = a.runs > 0 ? a.completed / a.runs : 0;
      return {
        agent: a.agent,
        runs: a.runs,
        completed: a.completed,
        failed: a.failed,
        running: a.running,
        successRate,
        p50DurationMs: pct(0.5),
        p95DurationMs: pct(0.95),
        tokensIn: a.tokensIn,
        tokensOut: a.tokensOut,
        costUsd: Number(a.costUsd.toFixed(4)),
        artifacts: a.artifacts,
      };
    })
    .sort((a, b) => b.runs - a.runs);

  const totals = summary.reduce(
    (acc, a) => {
      acc.runs += a.runs;
      acc.failed += a.failed;
      acc.tokensIn += a.tokensIn;
      acc.tokensOut += a.tokensOut;
      acc.costUsd += a.costUsd;
      acc.artifacts += a.artifacts;
      return acc;
    },
    { runs: 0, failed: 0, tokensIn: 0, tokensOut: 0, costUsd: 0, artifacts: 0 },
  );

  return NextResponse.json({
    window,
    since: since?.toISOString() ?? null,
    totals: {
      ...totals,
      costUsd: Number(totals.costUsd.toFixed(4)),
      successRate: totals.runs > 0 ? (totals.runs - totals.failed) / totals.runs : 0,
    },
    summary,
    recent,
  });
}
