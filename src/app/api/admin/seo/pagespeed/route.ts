import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { analyzeUrl, auditSite } from "@/lib/pagespeed";
import { getSiteKeyPagePaths, getSiteUrl } from "@/lib/site-data";

/**
 * GET /api/admin/seo/pagespeed
 *
 * Query params:
 *   ?url=https://...        — Analyze a single URL
 *   ?audit=true             — Audit key site pages
 *   ?strategy=mobile|desktop — (default: mobile)
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const audit = searchParams.get("audit") === "true";
  const strategy = (searchParams.get("strategy") || "mobile") as "mobile" | "desktop";

  try {
    if (url) {
      const result = await analyzeUrl(url, strategy);
      return NextResponse.json(result);
    }

    if (audit) {
      const siteUrl = await getSiteUrl(siteId);
      const keyPages = await getSiteKeyPagePaths(siteId);
      const paths = keyPages.length > 0 ? keyPages : ["/"];
      const summary = await auditSite(siteUrl, paths, strategy);
      return NextResponse.json({ results: summary });
    }

    return NextResponse.json(
      { error: "Provide ?url=... or ?audit=true" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PageSpeed analysis failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
