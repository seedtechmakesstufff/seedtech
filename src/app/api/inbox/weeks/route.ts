import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import { toIsoWeek, isoWeekLabel } from "@/lib/iso-week";

export const dynamic = "force-dynamic";

/**
 * GET /api/inbox/weeks
 *
 * Returns weekly buckets of agent artifacts. One row per ISO week that has
 * at least one artifact, plus the current week (always shown even if empty).
 * Each row is what the user sees as a "weekly digest to review."
 */
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  // Pull last 90 days of artifacts — plenty for the table view
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 90);

  const rows = await prisma.agentArtifact.findMany({
    where: { siteId: ctx.siteId, createdAt: { gte: since } },
    select: { id: true, state: true, createdAt: true },
  });

  interface Bucket {
    week: string;
    pending: number;
    approved: number;
    published: number;
    rejected: number;
    failed: number;
    total: number;
    latestAt: Date;
  }
  const byWeek = new Map<string, Bucket>();
  for (const r of rows) {
    const w = toIsoWeek(r.createdAt);
    const b = byWeek.get(w) ?? {
      week: w,
      pending: 0,
      approved: 0,
      published: 0,
      rejected: 0,
      failed: 0,
      total: 0,
      latestAt: r.createdAt,
    };
    b.total++;
    if (r.state === "pending_review") b.pending++;
    else if (r.state === "approved") b.approved++;
    else if (r.state === "published") b.published++;
    else if (r.state === "rejected") b.rejected++;
    else if (r.state === "failed") b.failed++;
    if (r.createdAt > b.latestAt) b.latestAt = r.createdAt;
    byWeek.set(w, b);
  }

  // Ensure current week is always present
  const currentWeek = toIsoWeek(new Date());
  if (!byWeek.has(currentWeek)) {
    byWeek.set(currentWeek, {
      week: currentWeek,
      pending: 0,
      approved: 0,
      published: 0,
      rejected: 0,
      failed: 0,
      total: 0,
      latestAt: new Date(),
    });
  }

  // Cross-reference with weekly_digest cron runs so the UI can show whether
  // the digest email actually went out that week
  const digestRuns = await prisma.cronJobRun.findMany({
    where: {
      siteId: ctx.siteId,
      jobType: { in: ["weekly_digest", "weekly_digest_manual"] },
      startedAt: { gte: since },
    },
    select: { startedAt: true, status: true },
    orderBy: { startedAt: "desc" },
  });
  const digestByWeek = new Map<string, { status: string; sentAt: Date }>();
  for (const r of digestRuns) {
    const w = toIsoWeek(r.startedAt);
    if (!digestByWeek.has(w)) digestByWeek.set(w, { status: r.status, sentAt: r.startedAt });
  }

  const buckets = Array.from(byWeek.values())
    .map((b) => ({
      ...b,
      label: isoWeekLabel(b.week),
      latestAt: b.latestAt.toISOString(),
      digest: digestByWeek.get(b.week)
        ? {
            status: digestByWeek.get(b.week)!.status,
            sentAt: digestByWeek.get(b.week)!.sentAt.toISOString(),
          }
        : null,
    }))
    .sort((a, b) => b.week.localeCompare(a.week));

  return NextResponse.json({ weeks: buckets });
}
