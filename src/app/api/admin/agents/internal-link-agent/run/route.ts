import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runRegisteredAgent } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/admin/agents/internal-link-agent/run
 * Body (optional): { postId?: string }
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const body = (await req.json().catch(() => ({}))) as { postId?: string };
  const params = body.postId
    ? ({ mode: "post" as const, postId: body.postId })
    : ({ mode: "daily" as const });

  const run = await runRegisteredAgent("internal-link-agent", {
    siteId: ctx.siteId,
    trigger: "manual",
    params,
  });
  if (!run.success) {
    return NextResponse.json({ error: run.error, runId: run.runId, durationMs: run.durationMs }, { status: 500 });
  }
  return NextResponse.json({ ok: true, runId: run.runId, durationMs: run.durationMs, ...(run.result as object) });
}
