import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { takeSnapshot, getSnapshotHistory, getKeywordTrends } from "@/lib/seo-snapshot";

export async function GET(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    if (action === "history") {
      const limit = parseInt(searchParams.get("limit") || "12", 10);
      const history = await getSnapshotHistory(limit, siteId);
      return NextResponse.json({ history });
    }

    if (action === "keyword-trends") {
      const limit = parseInt(searchParams.get("limit") || "12", 10);
      const trends = await getKeywordTrends(limit, siteId);
      return NextResponse.json({ trends });
    }

    return NextResponse.json({ error: "Invalid action. Use ?action=history or ?action=keyword-trends" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const result = await takeSnapshot(siteId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
