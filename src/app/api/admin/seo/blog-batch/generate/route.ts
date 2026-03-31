import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { batchWriteBlogPosts } from "@/lib/batch-blog-writer";

/**
 * POST /api/admin/seo/blog-batch/generate
 *
 * Batch-generates blog posts from ContentIdea records.
 * Runs outline → draft → meta → save for each idea.
 *
 * Body (optional):
 *   count: number (default 5, max 10)
 *   status: "draft" | "published" (default "draft")
 *   ideaIds: string[] — specific content idea IDs to write
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const body = await req.json().catch(() => ({}));
    const count = Math.min(body.count || 5, 10); // cap at 10 per batch
    const status = body.status === "published" ? "published" : "draft";
    const ideaIds = Array.isArray(body.ideaIds) ? body.ideaIds : undefined;

    const result = await batchWriteBlogPosts(siteId, { count, status, ideaIds });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("[blog-batch/generate] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
