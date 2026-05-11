import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runRegisteredAgent } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

/**
 * POST /api/admin/agents/blog-drafter/run
 * Body (optional): { briefId?: string, fast?: boolean, max?: number }
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const body = (await req.json().catch(() => ({}))) as {
    briefId?: string;
    fast?: boolean;
    max?: number;
  };

  const run = await runRegisteredAgent("blog-drafter", {
    siteId: ctx.siteId,
    trigger: "manual",
    params: {
      briefArtifactIds: body.briefId ? [body.briefId] : undefined,
      fast: body.fast,
      max: body.max,
    },
  });
  if (!run.success) {
    return NextResponse.json({ error: run.error, runId: run.runId, durationMs: run.durationMs }, { status: 500 });
  }
  return NextResponse.json({ ok: true, runId: run.runId, durationMs: run.durationMs, ...(run.result as object) });
}
