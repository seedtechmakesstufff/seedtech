/**
 * POST /api/admin/seo/citations/check — Run a single query check (spot check)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { checkSingleQuery } from "@/lib/citation-checker";
import type { Platform } from "@/lib/citation-checker";

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const body = await req.json();
    const { query, platform } = body as { query?: string; platform?: Platform };

    if (!query || !platform) {
      return NextResponse.json(
        { error: "query and platform are required" },
        { status: 400 }
      );
    }

    const validPlatforms: Platform[] = ["perplexity", "chatgpt", "gemini", "google_aio", "copilot"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await checkSingleQuery(siteId, query, platform);

    if (!result) {
      return NextResponse.json(
        { error: `No API key configured for ${platform}` },
        { status: 422 }
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Single check error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Check failed" },
      { status: 500 }
    );
  }
}
