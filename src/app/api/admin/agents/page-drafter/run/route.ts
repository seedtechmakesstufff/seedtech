import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runRegisteredAgent } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const run = await runRegisteredAgent("page-drafter", {
    siteId: ctx.siteId,
    trigger: "manual",
  });
  if (!run.success) {
    return NextResponse.json({ error: run.error, runId: run.runId, durationMs: run.durationMs }, { status: 500 });
  }
  return NextResponse.json({ ok: true, runId: run.runId, durationMs: run.durationMs, ...(run.result as object) });
}
