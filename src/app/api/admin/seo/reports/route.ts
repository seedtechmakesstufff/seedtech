import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { previewReport, sendReport, buildReportData } from "@/lib/seo-reports";
import type { ReportPeriod } from "@/lib/seo-reports";

const VALID_PERIODS = ["weekly", "monthly", "quarterly", "yearly"] as const;

export async function GET(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const periodParam = searchParams.get("period") || "monthly";
  const period: ReportPeriod = VALID_PERIODS.includes(periodParam as ReportPeriod)
    ? (periodParam as ReportPeriod)
    : "monthly";

  try {
    if (format === "html") {
      const html = await previewReport(siteId, period);
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const data = await buildReportData(siteId, period);
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
    const { to, period: p } = body as { to?: string; period?: string };
    const period: ReportPeriod = VALID_PERIODS.includes(p as ReportPeriod)
      ? (p as ReportPeriod)
      : "monthly";
    const result = await sendReport(siteId, to, period);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
