import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runRegisteredAgent } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_RECIPIENT = "sswaynos@seedtechllc.com";

/**
 * POST /api/admin/agents/weekly-digest/run
 * Body (optional): { recipient?: string }
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const body = (await req.json().catch(() => ({}))) as { recipient?: string };
  const recipient = body.recipient ?? process.env.WEEKLY_DIGEST_RECIPIENT ?? DEFAULT_RECIPIENT;

  const run = await runRegisteredAgent("weekly-digest", {
    siteId: ctx.siteId,
    trigger: "manual",
    params: { recipient },
  });
  if (!run.success) {
    return NextResponse.json({ error: run.error, runId: run.runId, durationMs: run.durationMs }, { status: 500 });
  }
  return NextResponse.json({ ok: true, runId: run.runId, recipient, durationMs: run.durationMs, ...(run.result as object) });
}
