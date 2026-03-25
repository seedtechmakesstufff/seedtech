/**
 * GET  /api/admin/seo/citations — Get citation dashboard data
 * POST /api/admin/seo/citations — Trigger a new citation check run
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { getCitationDashboard } from "@/lib/citation-analytics";
import { runCitationCheck } from "@/lib/citation-checker";
import type { Platform } from "@/lib/citation-checker";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const dashboard = await getCitationDashboard(siteId);
    return NextResponse.json(dashboard);
  } catch (e) {
    console.error("Citation dashboard error:", e);
    return NextResponse.json(
      { error: "Failed to load citation data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const body = await req.json().catch(() => ({}));
    const platforms = body.platforms as Platform[] | undefined;
    const maxQueries = body.maxQueries as number | undefined;
    const includeCompetitors = body.includeCompetitors !== false;

    const result = await runCitationCheck({
      siteId,
      platforms,
      maxQueries,
      includeCompetitors,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("Citation check error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Citation check failed" },
      { status: 500 }
    );
  }
}
