import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { runCrawl, getLatestCrawlResults } from "@/lib/seo-crawler";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const results = await getLatestCrawlResults(siteId);
    if (!results) {
      return NextResponse.json({ results: null, message: "No crawl results yet. Run a crawl first." });
    }
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const body = await req.json().catch(() => ({}));
    const baseUrl = (body as { baseUrl?: string }).baseUrl;
    const paths = (body as { paths?: string[] }).paths;
    const result = await runCrawl(siteId, baseUrl, paths);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
