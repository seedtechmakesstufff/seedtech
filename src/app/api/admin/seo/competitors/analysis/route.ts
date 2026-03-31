import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext, requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { analyzeCompetitor, findContentGaps, findKeywordGaps, getCompetitorOverviews } from "@/lib/competitive-intel";

/**
 * GET  /api/admin/seo/competitors/analysis — Get competitor overviews + content gaps + keyword gaps
 * POST /api/admin/seo/competitors/analysis — Trigger analysis for a specific competitor
 */

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const [overviews, gaps, keywordGaps] = await Promise.all([
    getCompetitorOverviews(siteId),
    findContentGaps(siteId),
    findKeywordGaps(siteId),
  ]);

  return NextResponse.json({ overviews, gaps, keywordGaps });
}

export async function POST(req: NextRequest) {
  const ctx = await requireRole("editor");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { competitorId, urls } = body;

  if (!competitorId) {
    return NextResponse.json({ error: "competitorId is required" }, { status: 400 });
  }

  try {
    const result = await analyzeCompetitor(siteId, competitorId, urls);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
