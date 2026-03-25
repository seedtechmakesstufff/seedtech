/**
 * Site Context — resolves the current user, tenant, and site for admin routes.
 *
 * Every API route and server action in /admin should call `requireSiteContext()`
 * which reads the NextAuth session and returns { userId, tenantId, siteId, role }.
 *
 * The siteId can be overridden via the `x-site-id` cookie (set by the site
 * switcher UI). The override is validated: the user must have a membership
 * in a tenant that owns the requested site.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SITE_COOKIE = "x-site-id";

export interface SiteContext {
  userId: string;
  tenantId: string;
  siteId: string;
  role: string;
  email: string;
}

/**
 * Get the current site context from the session.
 * Checks for a cookie-based site override (validated against tenant membership).
 * Returns null if not authenticated.
 */
export async function getSiteContext(): Promise<SiteContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.siteId) return null;

  let siteId = session.user.siteId;
  let tenantId = session.user.tenantId;

  // Check for cookie override
  const cookieStore = await cookies();
  const override = cookieStore.get(SITE_COOKIE)?.value;
  if (override && override !== siteId) {
    // Validate: user must have access to this site via their tenant memberships
    try {
      const site = await prisma.site.findUnique({
        where: { id: override },
        select: { id: true, tenantId: true },
      });
      if (site) {
        // Check user has a membership in that tenant
        const membership = await prisma.membership.findUnique({
          where: {
            userId_tenantId: {
              userId: session.user.userId,
              tenantId: site.tenantId,
            },
          },
          select: { role: true },
        });
        if (membership) {
          siteId = override;
          tenantId = site.tenantId;
        }
      }
    } catch {
      // DB error — fall back to session siteId
    }
  }

  return {
    userId: session.user.userId,
    tenantId,
    siteId,
    role: session.user.role,
    email: session.user.email,
  };
}

/**
 * Require a valid site context. Returns the context or throws a 401 NextResponse.
 * Use in API route handlers:
 *
 * ```ts
 * const ctx = await requireSiteContext();
 * if (ctx instanceof NextResponse) return ctx;
 * // ctx is SiteContext
 * ```
 */
export async function requireSiteContext(): Promise<SiteContext | NextResponse> {
  const ctx = await getSiteContext();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return ctx;
}

/**
 * Check if the context has at least the required role.
 * Role hierarchy: owner > admin > editor > viewer
 */
const ROLE_LEVELS: Record<string, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

export function hasRole(ctx: SiteContext, requiredRole: string): boolean {
  return (ROLE_LEVELS[ctx.role] ?? 0) >= (ROLE_LEVELS[requiredRole] ?? 99);
}

/**
 * Require a specific minimum role. Returns 403 if insufficient.
 */
export async function requireRole(requiredRole: string): Promise<SiteContext | NextResponse> {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  if (!hasRole(ctx, requiredRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return ctx;
}

/**
 * Default SeedTech site ID (used during migration period for backwards compat).
 * Once all routes use requireSiteContext(), this constant can be removed.
 */
export const DEFAULT_SITE_ID = "site_seedtech";
