import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/team — List team members for the current tenant
 * POST /api/admin/team — Invite a new team member
 */

export async function GET() {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { tenantId } = ctx as SiteContext;

  const memberships = await prisma.membership.findMany({
    where: { tenantId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });

  const members = memberships.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    userCreatedAt: m.user.createdAt,
  }));

  // Get pending invites
  const invites = await prisma.userInvite.findMany({
    where: { tenantId, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ members, invites });
}

export async function POST(req: NextRequest) {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { tenantId, userId } = ctx as SiteContext;

  const body = await req.json();
  const { email, role = "editor" } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const validRoles = ["viewer", "editor", "admin"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: `role must be one of: ${validRoles.join(", ")}` }, { status: 400 });
  }

  // Check if user already exists in this tenant
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const existingMembership = await prisma.membership.findUnique({
      where: { userId_tenantId: { userId: existingUser.id, tenantId } },
    });
    if (existingMembership) {
      return NextResponse.json(
        { error: "This user is already a member of this organization" },
        { status: 409 }
      );
    }
  }

  // Check for existing pending invite
  const existingInvite = await prisma.userInvite.findFirst({
    where: { tenantId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
  });
  if (existingInvite) {
    return NextResponse.json(
      { error: "An invite has already been sent to this email" },
      { status: 409 }
    );
  }

  // Create the invite
  const invite = await prisma.userInvite.create({
    data: {
      tenantId,
      email: email.toLowerCase(),
      role,
      invitedBy: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // TODO: Send invite email via Resend when email service is configured

  return NextResponse.json({ invite }, { status: 201 });
}
