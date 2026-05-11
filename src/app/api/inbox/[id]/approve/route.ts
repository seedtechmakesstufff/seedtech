import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { approveArtifact } from "@/lib/agent-artifacts";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/inbox/[id]/approve
 * Body: { notes?: string, edits?: object }   — `edits` lets the reviewer
 *   override fields in the payload before publishing (e.g. tweak the reply text)
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const artifact = await prisma.agentArtifact.findUnique({ where: { id: params.id } });
  if (!artifact || artifact.siteId !== ctx.siteId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { notes?: string; edits?: Record<string, unknown> };

  // Merge edits into payload before approving (so the publisher sees the human-edited version)
  if (body.edits && typeof body.edits === "object") {
    const merged = { ...(artifact.payload as Record<string, unknown>), ...body.edits } as Prisma.InputJsonValue;
    await prisma.agentArtifact.update({
      where: { id: params.id },
      data: { payload: merged },
    });
  }

  try {
    const result = await approveArtifact(params.id, ctx.email ?? "unknown", body.notes);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Approval failed" },
      { status: 400 }
    );
  }
}
