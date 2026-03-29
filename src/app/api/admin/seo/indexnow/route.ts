import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { submitUrl, submitUrls, isIndexNowConfigured } from "@/lib/indexnow";

/**
 * POST /api/admin/seo/indexnow
 *
 * Body: { url: string } or { urls: string[] }
 * Pings search engines about new/updated content.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isIndexNowConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "IndexNow is not configured. Add INDEXNOW_API_KEY to .env.local",
    });
  }

  const body = await req.json();

  try {
    if (body.urls && Array.isArray(body.urls)) {
      const results = await submitUrls(body.urls);
      return NextResponse.json({ configured: true, results });
    }

    if (body.url) {
      const result = await submitUrl(body.url);
      return NextResponse.json({ configured: true, result });
    }

    return NextResponse.json(
      { error: "Provide { url } or { urls }" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "IndexNow submission failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seo/indexnow
 * Returns configuration status.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    configured: isIndexNowConfigured(),
    apiKey: process.env.INDEXNOW_API_KEY ? "***configured***" : null,
  });
}
