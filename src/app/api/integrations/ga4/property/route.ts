import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * PUT /api/integrations/ga4/property
 * Body: { property: "properties/123456789" }
 *
 * Saves the GA4 property selection on the IntegrationCredential row so daily
 * sync knows which property to query.
 */
export async function PUT(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { property?: string };
  const property = body.property;
  if (!property || !/^properties\/\d+$/.test(property)) {
    return NextResponse.json(
      { error: "Invalid 'property'. Expected format: properties/{id}" },
      { status: 400 }
    );
  }

  const result = await prisma.integrationCredential.updateMany({
    where: { siteId: ctx.siteId, type: "google_analytics", isActive: true },
    data: { property },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "GA4 not connected. Connect Google Analytics 4 first." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, property });
}
