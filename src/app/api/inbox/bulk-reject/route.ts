import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { rejectArtifact } from "@/lib/agent-artifacts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/inbox/bulk-reject
 * Body: { ids: string[], notes?: string }
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { ids?: string[]; notes?: string };
  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }
  if (body.ids.length > 100) {
    return NextResponse.json({ error: "Bulk reject capped at 100 items per call" }, { status: 400 });
  }

  const own = await prisma.agentArtifact.findMany({
    where: { id: { in: body.ids }, siteId: ctx.siteId },
    select: { id: true },
  });
  const allowed = new Set(own.map((a) => a.id));

  const results: Array<{ id: string; ok: boolean; error?: string }> = [];
  for (const id of body.ids) {
    if (!allowed.has(id)) {
      results.push({ id, ok: false, error: "Not found" });
      continue;
    }
    try {
      await rejectArtifact(id, ctx.email ?? "unknown", body.notes);
      results.push({ id, ok: true });
    } catch (e) {
      results.push({ id, ok: false, error: e instanceof Error ? e.message : "Failed" });
    }
  }
  const okCount = results.filter((r) => r.ok).length;
  return NextResponse.json({ ok: true, total: results.length, rejected: okCount, results });
}
