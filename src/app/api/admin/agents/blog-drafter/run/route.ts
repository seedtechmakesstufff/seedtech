import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { checkAgentRateLimit } from "@/lib/agent-rate-limit";
import { runTrackedJob } from "@/lib/cron-runner";
import { runBlogDrafter } from "@/lib/agents/blog-drafter";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

/**
 * POST /api/admin/agents/blog-drafter/run
 * Body (optional): { briefId?: string, fast?: boolean, max?: number }
 *   - briefId: draft a single specific brief
 *   - fast: use Haiku (3-5x faster, less polish)
 *   - max: override default cap
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

  const job = await runTrackedJob(ctx.siteId, "blog_drafter_manual", () =>
    runBlogDrafter(ctx.siteId, {
      briefArtifactIds: body.briefId ? [body.briefId] : undefined,
      fast: body.fast,
      max: body.max,
    })
  );
  if (!job.success) {
    return NextResponse.json({ error: job.error ?? "Blog Drafter failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, durationMs: job.durationMs, ...job.result });
}
