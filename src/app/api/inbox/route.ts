import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { listArtifacts, type ArtifactState } from "@/lib/agent-artifacts";

export const dynamic = "force-dynamic";

const VALID_STATES: ArtifactState[] = ["pending_review", "approved", "rejected", "published", "failed"];

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const sp = new URL(req.url).searchParams;
  const stateList = sp.get("state")?.split(",").map((s) => s.trim()).filter(Boolean);
  const states = stateList?.filter((s): s is ArtifactState =>
    VALID_STATES.includes(s as ArtifactState)
  );
  const types = sp.get("type")?.split(",").map((s) => s.trim()).filter(Boolean);
  const limit = Math.min(500, Math.max(1, parseInt(sp.get("limit") ?? "100", 10) || 100));
  const offset = Math.max(0, parseInt(sp.get("offset") ?? "0", 10) || 0);

  const artifacts = await listArtifacts({
    siteId: ctx.siteId,
    states: states ?? ["pending_review"],
    types,
    limit,
    offset,
  });
  return NextResponse.json({ artifacts });
}

/**
 * DELETE /api/inbox
 * Deletes ALL AgentArtifact rows for the active site (for dev/testing).
 */
export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const { prisma } = await import("@/lib/prisma");
  const { count } = await prisma.agentArtifact.deleteMany({
    where: { siteId: ctx.siteId },
  });
  return NextResponse.json({ deleted: count });
}
