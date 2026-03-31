import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { generateContentCalendar } from "@/lib/content-calendar-generator";

/**
 * POST /api/admin/seo/content-calendar/generate
 *
 * Generates a 90-day AI content calendar using Claude + GSC data + tracked keywords.
 * Saves generated ideas as ContentIdea records.
 *
 * Body (optional):
 *   ideaCount: number (default 12)
 *   preview: boolean (default false — if true, don't save to DB)
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const body = await req.json().catch(() => ({}));
    const ideaCount = body.ideaCount || 12;
    const save = !body.preview;

    const result = await generateContentCalendar(siteId, { ideaCount, save });

    return NextResponse.json({
      success: true,
      ideas: result.ideas,
      saved: result.saved,
      skipped: result.skipped,
      total: result.ideas.length,
    });
  } catch (err) {
    console.error("[content-calendar/generate] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
