import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/agents/[key]/runs
 *
 * Returns the last 20 AgentRun rows for this agent + site, newest first.
 * Reads from the new AgentRun table (replaced the legacy CronJobRun
 * prefix-matching approach).
 */
export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const runs = await prisma.agentRun.findMany({
    where: { siteId: ctx.siteId, agentKey: params.key },
    orderBy: { startedAt: "desc" },
    take: 20,
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
  });

  return NextResponse.json({ runs });
}
