import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { sendWeeklyDigest } from "@/lib/weekly-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_RECIPIENT = "sswaynos@seedtechllc.com";

/**
 * POST /api/admin/agents/weekly-digest/run
 * Body (optional): { recipient?: string }
 *
 * Manually trigger the weekly digest email. Useful to preview the email
 * without waiting until Monday morning.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const limited = checkAgentRateLimit(ctx.siteId);
  if (limited) return limited;

  const body = (await req.json().catch(() => ({}))) as { recipient?: string };
  const recipient = body.recipient ?? process.env.WEEKLY_DIGEST_RECIPIENT ?? DEFAULT_RECIPIENT;

  const job = await runTrackedJob(ctx.siteId, "weekly_digest_manual", () =>
    sendWeeklyDigest({ siteId: ctx.siteId, recipient })
  );

  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Digest failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, recipient, ...job.result });
}
