import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { listGa4Properties } from "@/lib/ga4";

export const dynamic = "force-dynamic";

/**
 * GET /api/integrations/ga4/properties
 *
 * Returns all GA4 properties the connected Google account has access to.
 * Used by the admin integrations page to populate the property selector.
 */
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  try {
    const properties = await listGa4Properties(ctx.siteId);
    return NextResponse.json({ properties });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to list GA4 properties";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
