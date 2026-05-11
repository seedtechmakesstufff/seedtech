import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import { isoWeekRange } from "@/lib/iso-week";

export const dynamic = "force-dynamic";

/**
 * GET /api/inbox/by-week?week=YYYY-Www&state=pending_review,approved
 *
 * Returns artifacts created during the given ISO week, optionally filtered
 * by state. Default state filter is pending_review.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const sp = new URL(req.url).searchParams;
  const week = sp.get("week");
  if (!week) {
    return NextResponse.json({ error: "Missing week param" }, { status: 400 });
  }

  let range;
  try {
    range = isoWeekRange(week);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid week" },
      { status: 400 }
    );
  }

  const stateList = sp.get("state")?.split(",").map((s) => s.trim()).filter(Boolean);
  const states = stateList && stateList.length > 0 ? stateList : ["pending_review"];

  const [artifacts, allInWeek, analystBrief] = await Promise.all([
    prisma.agentArtifact.findMany({
      where: {
        siteId: ctx.siteId,
        createdAt: { gte: range.start, lt: range.end },
        state: { in: states },
      },
      orderBy: [{ state: "asc" }, { createdAt: "desc" }],
    }),
    // Counts across ALL states for the header — independent of the filter
    prisma.agentArtifact.findMany({
      where: { siteId: ctx.siteId, createdAt: { gte: range.start, lt: range.end } },
      select: { type: true, state: true },
    }),
    // The analyst-authored brief active in or just before this week
    prisma.seoStrategyDoc.findFirst({
      where: {
        siteId: ctx.siteId,
        source: "ai-strategy-analyst",
        updatedAt: { lt: range.end },
      },
      orderBy: { updatedAt: "desc" },
      select: { title: true, content: true, updatedAt: true },
    }),
  ]);

  // Per-type counts (pending only, since that's what the user can act on)
  const counts: Record<string, { pending: number; total: number }> = {};
  for (const a of allInWeek) {
    const cur = counts[a.type] ?? { pending: 0, total: 0 };
    cur.total++;
    if (a.state === "pending_review") cur.pending++;
    counts[a.type] = cur;
  }

  return NextResponse.json({
    week,
    weekStart: range.start.toISOString(),
    weekEnd: range.end.toISOString(),
    artifacts,
    counts,
    analystBrief: analystBrief
      ? {
          title: analystBrief.title,
          content: analystBrief.content,
          updatedAt: analystBrief.updatedAt.toISOString(),
        }
      : null,
  });
}
