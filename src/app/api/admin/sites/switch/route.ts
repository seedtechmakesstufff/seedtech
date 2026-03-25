import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { SITE_COOKIE } from "@/lib/site-context";

/**
 * POST /api/admin/sites/switch — Switch the active site.
 * Sets a cookie that `getSiteContext()` reads to override the JWT siteId.
 *
 * Body: { siteId: string }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await req.json();
  if (!siteId || typeof siteId !== "string") {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  // Validate: site must exist and user must have access via tenant membership
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { id: true, name: true, tenantId: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_tenantId: {
        userId: session.user.userId,
        tenantId: site.tenantId,
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Set the override cookie (7 day expiry matching session)
  const response = NextResponse.json({
    success: true,
    siteId: site.id,
    siteName: site.name,
  });

  response.cookies.set(SITE_COOKIE, site.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
