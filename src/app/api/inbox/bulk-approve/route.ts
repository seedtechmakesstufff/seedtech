import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { approveArtifact } from "@/lib/agent-artifacts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/inbox/bulk-approve
 * Body: { ids: string[] }
 *
 * Approves each artifact sequentially. Publishers run inline — so this can
 * be slow (e.g. each gbp_post_draft calls Google). Returns per-id results.
 * Artifacts not in pending_review are skipped with an error in the response.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { ids?: string[] };
  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }
  if (body.ids.length > 50) {
    return NextResponse.json({ error: "Bulk approve capped at 50 items per call" }, { status: 400 });
  }

  // Confirm all artifacts belong to the active site — guard against cross-site IDs
  const own = await prisma.agentArtifact.findMany({
    where: { id: { in: body.ids }, siteId: ctx.siteId },
    select: { id: true },
  });
  const allowed = new Set(own.map((a) => a.id));

  const results: Array<{ id: string; ok: boolean; state?: string; error?: string }> = [];
  for (const id of body.ids) {
    if (!allowed.has(id)) {
      results.push({ id, ok: false, error: "Not found" });
      continue;
    }
    try {
      const r = await approveArtifact(id, ctx.email ?? "unknown");
      results.push({ id, ok: true, state: r.state });
    } catch (e) {
      results.push({ id, ok: false, error: e instanceof Error ? e.message : "Failed" });
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  return NextResponse.json({ ok: true, total: results.length, approved: okCount, results });
}
