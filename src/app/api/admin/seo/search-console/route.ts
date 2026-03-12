import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import {
  isSearchConsoleConfigured,
  testConnection,
  getSearchConsoleSummary,
  getTrackedKeywordPositions,
  listSites,
} from "@/lib/google-search-console";
import { TRACKED_KEYWORDS } from "@/data/seo-strategy";

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
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSearchConsoleConfigured()) {
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
        const sites = await listSites();
        const result = await testConnection();
        return NextResponse.json({ configured: true, ...result, availableSites: sites });
      }

      case "keywords": {
        const keywords = TRACKED_KEYWORDS.map((k) => k.keyword);
        const positions = await getTrackedKeywordPositions(keywords, days);
        return NextResponse.json({ configured: true, positions, days });
      }

      case "summary":
      default: {
        const summary = await getSearchConsoleSummary(days);
        // Also get tracked keyword positions
        const keywords = TRACKED_KEYWORDS.map((k) => k.keyword);
        const positions = await getTrackedKeywordPositions(keywords, days);
        return NextResponse.json({
          configured: true,
          summary,
          trackedPositions: positions,
          days,
        });
      }
    }
  } catch (err: any) {
    return NextResponse.json(
      { configured: true, error: err.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}
