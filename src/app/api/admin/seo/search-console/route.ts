import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import {
  isSearchConsoleConfigured,
  testConnection,
  getSearchConsoleSummary,
  getTrackedKeywordPositions,
  listSites,
} from "@/lib/google-search-console";
import {
  getTrackedKeywordStrings,
  getSearchConsoleIntegration,
  updateKeywordPositions,
} from "@/lib/site-data";

/**
 * GET /api/admin/seo/search-console
 * Returns Search Console summary data.
 *
 * Query params:
 *   ?action=test     — test the connection
 *   ?action=summary  — full summary (default)
 *   ?action=keywords — tracked keyword positions only
 *   ?days=28         — date range (default 28)
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const integration = await getSearchConsoleIntegration(siteId);

  if (!isSearchConsoleConfigured(integration)) {
    return NextResponse.json({
      configured: false,
      message: "Google Search Console is not configured. Add service account credentials to .env.local",
    });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "summary";
  const days = parseInt(searchParams.get("days") || "28", 10);

  try {
    switch (action) {
      case "test": {
        const sites = await listSites(integration);
        const result = await testConnection(integration);
        return NextResponse.json({ configured: true, ...result, availableSites: sites });
      }

      case "keywords": {
        const keywords = await getTrackedKeywordStrings(siteId);
        const positions = await getTrackedKeywordPositions(keywords, days, integration);
        await updateKeywordPositions(siteId, positions);
        return NextResponse.json({ configured: true, positions, days });
      }

      case "summary":
      default: {
        const summary = await getSearchConsoleSummary(days, integration);
        const keywords = await getTrackedKeywordStrings(siteId);
        const positions = await getTrackedKeywordPositions(keywords, days, integration);
        await updateKeywordPositions(siteId, positions);
        return NextResponse.json({
          configured: true,
          summary,
          trackedPositions: positions,
          days,
        });
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch data";
    return NextResponse.json(
      { configured: true, error: message },
      { status: 500 }
    );
  }
}
