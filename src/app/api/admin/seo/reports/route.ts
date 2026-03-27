import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { previewReport, sendReport, buildReportData } from "@/lib/seo-reports";

export async function GET(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  try {
    if (format === "html") {
      const html = await previewReport(siteId);
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const data = await buildReportData(siteId);
    return NextResponse.json({ data });
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
    const to = (body as { to?: string }).to;
    const result = await sendReport(siteId, to);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
