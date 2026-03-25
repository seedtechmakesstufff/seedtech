/**
 * GET /api/admin/seo/citations/competitors — Get competitor citation comparison
 */

import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { getCompetitorComparison } from "@/lib/citation-analytics";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const comparison = await getCompetitorComparison(siteId);
    return NextResponse.json({ comparison });
  } catch (e) {
    console.error("Competitor comparison error:", e);
    return NextResponse.json(
      { error: "Failed to load competitor comparison" },
      { status: 500 }
    );
  }
}
