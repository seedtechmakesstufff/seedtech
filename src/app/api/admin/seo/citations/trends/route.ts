/**
 * GET /api/admin/seo/citations/trends — Get citation trends over time
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { getCitationTrends } from "@/lib/citation-analytics";

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const days = parseInt(req.nextUrl.searchParams.get("days") || "30", 10);

  try {
    const trends = await getCitationTrends(siteId, days);
    return NextResponse.json({ trends });
  } catch (e) {
    console.error("Citation trends error:", e);
    return NextResponse.json(
      { error: "Failed to load trends" },
      { status: 500 }
    );
  }
}
