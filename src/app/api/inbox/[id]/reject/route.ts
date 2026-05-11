import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { rejectArtifact } from "@/lib/agent-artifacts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const artifact = await prisma.agentArtifact.findUnique({ where: { id: params.id } });
  if (!artifact || artifact.siteId !== ctx.siteId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { notes?: string };
  try {
    await rejectArtifact(params.id, ctx.email ?? "unknown", body.notes);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Reject failed" },
      { status: 400 }
    );
  }
}
