import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET /api/admin/cron-history — Get recent cron job runs for the current site
 */
export async function GET() {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const runs = await prisma.cronJobRun.findMany({
    where: { siteId },
    orderBy: { startedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ runs });
}
