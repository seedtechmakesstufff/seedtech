import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { analyzeUrl, auditSite } from "@/lib/pagespeed";
import { getSiteKeyPagePaths, getSiteUrl } from "@/lib/site-data";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

/**
 * GET /api/admin/seo/pagespeed
 *
 * Query params:
 *   ?url=https://...        — Analyze a single URL
 *   ?audit=true             — Audit key site pages
 *   ?strategy=mobile|desktop — (default: mobile)
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      const siteId = (session.user as any).siteId || DEFAULT_SITE_ID;
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "PageSpeed analysis failed" },
      { status: 500 }
    );
  }
}
