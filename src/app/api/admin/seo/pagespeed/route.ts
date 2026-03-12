import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { analyzeUrl, auditSite } from "@/lib/pagespeed";

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
      // Use the configured site URL or fall back to localhost
      const siteUrl =
        process.env.GOOGLE_SEARCH_CONSOLE_SITE?.replace("sc-domain:", "https://") ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";
      const summary = await auditSite(siteUrl, undefined, strategy);
      return NextResponse.json(summary);
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
