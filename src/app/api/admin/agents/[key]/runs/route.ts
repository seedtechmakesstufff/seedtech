import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Maps agent UI key → jobType prefixes stored in CronJobRun
const JOB_TYPE_PREFIXES: Record<string, string[]> = {
  "industry-researcher": ["industry_researcher"],
  "strategy-analyst":    ["strategy_analyst", "runall_strategy_analyst"],
  "brief-generator":     ["brief_generator", "runall_brief_generator"],
  "blog-drafter":        ["blog_drafter", "runall_blog_drafter"],
  "gbp-post-drafter":    ["gbp_post_drafter", "runall_gbp_post_drafter"],
  "keyword-scout":       ["keyword_scout", "runall_keyword_scout"],
  "content-decay-watcher": ["content_decay_watcher", "runall_content_decay_watcher"],
  "internal-link-agent": ["internal_link_agent", "runall_internal_link_agent"],
  "weekly-digest":       ["weekly_digest", "runall_weekly_digest"],
};

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const prefixes = JOB_TYPE_PREFIXES[params.key];
  if (!prefixes) return NextResponse.json({ runs: [] });

  const runs = await prisma.cronJobRun.findMany({
    where: {
      siteId: ctx.siteId,
      OR: prefixes.map((p) => ({ jobType: { startsWith: p } })),
    },
    orderBy: { startedAt: "desc" },
    take: 10,
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
