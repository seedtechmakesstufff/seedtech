import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runInternalLinkAgent } from "@/lib/agents/internal-link-agent";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/admin/agents/internal-link-agent/run
 * Body (optional): { postId?: string }
 *   - postId: scan only this post; otherwise daily-sweep mode
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const body = (await req.json().catch(() => ({}))) as { postId?: string };
  const scope = body.postId
    ? ({ mode: "post", postId: body.postId } as const)
    : ({ mode: "daily" } as const);

  const job = await runTrackedJob(ctx.siteId, "internal_link_agent_manual", () =>
    runInternalLinkAgent(ctx.siteId, scope)
  );
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Agent failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...job.result });
}
