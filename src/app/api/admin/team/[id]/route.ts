import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * PUT    /api/admin/team/[id] — Update a member's role
 * DELETE /api/admin/team/[id] — Remove a member or cancel an invite
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("owner");
  if (ctx instanceof NextResponse) return ctx;
  const { tenantId, userId } = ctx as SiteContext;
  const { id } = await params;

  const body = await req.json();
  const { role } = body;

  const validRoles = ["viewer", "editor", "admin"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: `role must be one of: ${validRoles.join(", ")}` }, { status: 400 });
  }

  // Can't change own role
  if (id === userId) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const membership = await prisma.membership.findUnique({
    where: { userId_tenantId: { userId: id, tenantId } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await prisma.membership.update({
    where: { userId_tenantId: { userId: id, tenantId } },
    data: { role },
  });

  return NextResponse.json({ ok: true, role });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { tenantId, userId } = ctx as SiteContext;
  const { id } = await params;

  // Can't remove yourself
  if (id === userId) {
    return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
  }

  // Try removing as member first
  const membership = await prisma.membership.findUnique({
    where: { userId_tenantId: { userId: id, tenantId } },
  });
  if (membership) {
    await prisma.membership.delete({
      where: { userId_tenantId: { userId: id, tenantId } },
    });
    return NextResponse.json({ ok: true, removed: "member" });
  }

  // Try canceling as invite
  const invite = await prisma.userInvite.findFirst({
    where: { id, tenantId },
  });
  if (invite) {
    await prisma.userInvite.delete({ where: { id } });
    return NextResponse.json({ ok: true, removed: "invite" });
  }

  return NextResponse.json({ error: "Member or invite not found" }, { status: 404 });
}
