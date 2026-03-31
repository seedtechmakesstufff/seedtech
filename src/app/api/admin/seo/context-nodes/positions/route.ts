import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * PATCH /api/admin/seo/context-nodes/positions
 * Batch-update positions for canvas layout persistence.
 * Body: { positions: [{ id, posX, posY }, ...] }
 */
export async function PATCH(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const positions: { id: string; posX: number; posY: number }[] = body.positions;

  if (!Array.isArray(positions) || positions.length === 0) {
    return NextResponse.json({ error: "positions array is required" }, { status: 400 });
  }

  // Batch update in a transaction
  await prisma.$transaction(
    positions.map(({ id, posX, posY }) =>
      prisma.contextNode.updateMany({
        where: { id, siteId },
        data: { posX, posY },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
