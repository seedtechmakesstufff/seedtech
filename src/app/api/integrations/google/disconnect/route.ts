import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import { isGoogleOAuthIntegrationType } from "@/lib/google-oauth";
import type { IntegrationType } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/google/disconnect
 * Body: { type: "google_business_profile" | "google_analytics" | "google_search_console" }
 *
 * Marks the credential inactive. We do not delete the row so that re-connecting
 * preserves any historical metadata, and we do not revoke the refresh token at
 * Google — admins can do that at myaccount.google.com/permissions if desired.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { type?: string };
  const type = body.type;
  if (!type || !isGoogleOAuthIntegrationType(type)) {
    return NextResponse.json({ error: "Invalid integration type" }, { status: 400 });
  }

  const result = await prisma.integrationCredential.updateMany({
    where: { siteId: ctx.siteId, type: type as IntegrationType },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true, updated: result.count });
}
