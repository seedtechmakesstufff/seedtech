/**
 * GET /api/admin/seo/citations/runs — Get citation check run history
 */

import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { getCheckRunHistory } from "@/lib/citation-checker";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const runs = await getCheckRunHistory(siteId, 50);
    return NextResponse.json({ runs });
  } catch (e) {
    console.error("Citation runs error:", e);
    return NextResponse.json(
      { error: "Failed to load check runs" },
      { status: 500 }
    );
  }
}
