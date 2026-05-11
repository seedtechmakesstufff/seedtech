import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/digest/runs
 * Deletes all weekly-digest CronJobRun rows for the active site.
 */
export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const { count } = await prisma.cronJobRun.deleteMany({
    where: {
      siteId: ctx.siteId,
      jobType: { in: ["weekly_digest", "weekly_digest_manual"] },
    },
  });

  return NextResponse.json({ deleted: count });
}

/**
 * GET /api/admin/digest/runs
 * Returns the last 20 weekly-digest CronJobRun rows for the active site.
 */
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const runs = await prisma.cronJobRun.findMany({
    where: {
      siteId: ctx.siteId,
      jobType: { in: ["weekly_digest", "weekly_digest_manual"] },
    },
    orderBy: { startedAt: "desc" },
    take: 20,
    select: {
      id: true,
      jobType: true,
      status: true,
      startedAt: true,
      completedAt: true,
      durationMs: true,
      resultSummary: true,
      errorMessage: true,
    },
  });

  return NextResponse.json({ runs });
}
