import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { validateGbpCtaUrl } from "@/lib/gbp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/integrations/gbp/validate-cta
 * Body: { ctaUrl: string, locationDbId?: string }
 * Returns: { ok: true } or { ok: false, error: string }
 *
 * Used by the Inbox UI to preview whether a GBP post draft's CTA URL will
 * pass server-side validation before the user clicks Approve.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { ctaUrl?: string; locationDbId?: string };
  if (!body.ctaUrl) {
    return NextResponse.json({ ok: true }); // empty CTA always valid
  }

  let locationWebsite: string | null = null;
  if (body.locationDbId) {
    const loc = await prisma.gbpLocation.findFirst({
      where: { id: body.locationDbId, siteId: ctx.siteId },
      select: { websiteUri: true },
    });
    locationWebsite = loc?.websiteUri ?? null;
  }

  try {
    await validateGbpCtaUrl(ctx.siteId, body.ctaUrl, locationWebsite);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Invalid URL" },
      { status: 200 }
    );
  }
}
