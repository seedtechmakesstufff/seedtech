import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { runCrawl, getLatestCrawlResults } from "@/lib/seo-crawler";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const results = await getLatestCrawlResults();
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const siteId = (body as { siteId?: string }).siteId || DEFAULT_SITE_ID;
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
