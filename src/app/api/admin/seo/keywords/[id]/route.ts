import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/seo/keywords/[id] — Update a tracked keyword
 * DELETE /api/admin/seo/keywords/[id] — Soft-delete (deactivate) a keyword
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tier, volume, competition, intent, targetPage, clusterId, isActive } = body;

  const updated = await prisma.trackedKeyword.update({
    where: { id: params.id },
    data: {
      ...(tier !== undefined && { tier }),
      ...(volume !== undefined && { volume }),
      ...(competition !== undefined && { competition }),
      ...(intent !== undefined && { intent }),
      ...(targetPage !== undefined && { targetPage }),
      ...(clusterId !== undefined && { clusterId }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ keyword: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft delete
  await prisma.trackedKeyword.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
