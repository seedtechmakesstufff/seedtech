/**
 * GET /api/admin/seo/citations/correlation — Score-to-citation correlation
 */

import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { getScoreCitationCorrelation } from "@/lib/citation-analytics";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const correlation = await getScoreCitationCorrelation(siteId);
    return NextResponse.json({ correlation });
  } catch (e) {
    console.error("Citation correlation error:", e);
    return NextResponse.json(
      { error: "Failed to load correlation data" },
      { status: 500 }
    );
  }
}
