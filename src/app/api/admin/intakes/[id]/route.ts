import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/admin/intakes/[id] — fetch single intake with submission data
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const intake = await prisma.clientIntake.findUnique({
    where: { id: params.id },
  });

  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(intake);
}

// PATCH /api/admin/intakes/[id] — update notes, assetDriveUrl, status, siteId
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { assetDriveUrl, notes, status, siteId } = body;

  const intake = await prisma.clientIntake.update({
    where: { id: params.id },
    data: {
      ...(assetDriveUrl !== undefined && { assetDriveUrl: assetDriveUrl?.trim() || null }),
      ...(notes !== undefined && { notes: notes?.trim() || null }),
      ...(status !== undefined && { status }),
      ...(siteId !== undefined && { siteId: siteId || null }),
    },
  });

  return NextResponse.json(intake);
}

// DELETE /api/admin/intakes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.clientIntake.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
