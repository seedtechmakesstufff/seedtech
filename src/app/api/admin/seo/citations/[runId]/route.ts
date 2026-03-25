/**
 * GET  /api/admin/seo/citations/[runId] — Get details of a specific check run
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { runId } = await params;

  try {
    const run = await prisma.citationCheckRun.findFirst({
      where: { id: runId, siteId },
      include: {
        citations: {
          orderBy: { checkedAt: "desc" },
        },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: "Check run not found" },
        { status: 404 }
      );
    }

    // Separate our citations from competitor citations
    const ourCitations = run.citations.filter((c) => !c.competitorId);
    const competitorCitations = run.citations.filter((c) => !!c.competitorId);

    return NextResponse.json({
      ...run,
      ourCitations,
      competitorCitations,
      citations: undefined, // don't send raw mixed list
    });
  } catch (e) {
    console.error("Citation run detail error:", e);
    return NextResponse.json(
      { error: "Failed to load check run" },
      { status: 500 }
    );
  }
}
