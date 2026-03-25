import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/sites — List all sites the current user has access to.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all tenants the user belongs to
  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.userId },
    include: {
      tenant: {
        include: {
          sites: {
            select: {
              id: true,
              name: true,
              slug: true,
              domain: true,
              siteUrl: true,
            },
            orderBy: { name: "asc" },
          },
        },
      },
    },
  });

  // Flatten all sites the user has access to
  const sites = memberships.flatMap((m) =>
    m.tenant.sites.map((s) => ({
      ...s,
      tenantId: m.tenantId,
      tenantName: m.tenant.name,
      role: m.role,
    }))
  );

  return NextResponse.json({
    sites,
    currentSiteId: session.user.siteId,
  });
}
