import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/keywords — List all tracked keywords
 * POST /api/admin/seo/keywords — Create or bulk-import keywords
 */

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const keywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    include: { cluster: { select: { id: true, name: true } } },
    orderBy: [{ tier: "asc" }, { keyword: "asc" }],
  });

  const clusters = await prisma.keywordCluster.findMany({
    where: { siteId },
    include: { _count: { select: { keywords: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ keywords, clusters });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();

  // Bulk import mode
  if (Array.isArray(body)) {
    const results = await Promise.allSettled(
      body.map((kw: {
        keyword: string;
        tier?: string;
        volume?: string;
        competition?: string;
        intent?: string;
        targetPage?: string;
      }) =>
        prisma.trackedKeyword.upsert({
          where: { siteId_keyword: { siteId, keyword: kw.keyword } },
          update: {
            tier: (kw.tier as "tier1" | "tier2" | "tier3") || "tier2",
            volume: kw.volume || "unknown",
            competition: kw.competition || "medium",
            intent: (kw.intent as "transactional" | "commercial" | "informational" | "navigational") || "informational",
            targetPage: kw.targetPage || "/",
          },
          create: {
            siteId,
            keyword: kw.keyword,
            tier: (kw.tier as "tier1" | "tier2" | "tier3") || "tier2",
            volume: kw.volume || "unknown",
            competition: kw.competition || "medium",
            intent: (kw.intent as "transactional" | "commercial" | "informational" | "navigational") || "informational",
            targetPage: kw.targetPage || "/",
          },
        })
      )
    );

    const created = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({ imported: created, total: body.length });
  }

  // Single keyword creation
  const { keyword, tier, volume, competition, intent, targetPage, clusterId } = body;

  if (!keyword) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  const created = await prisma.trackedKeyword.upsert({
    where: { siteId_keyword: { siteId, keyword } },
    update: {
      tier: tier || "tier2",
      volume: volume || "unknown",
      competition: competition || "medium",
      intent: intent || "informational",
      targetPage: targetPage || "/",
      clusterId: clusterId || null,
      isActive: true,
    },
    create: {
      siteId,
      keyword,
      tier: tier || "tier2",
      volume: volume || "unknown",
      competition: competition || "medium",
      intent: intent || "informational",
      targetPage: targetPage || "/",
      clusterId: clusterId || null,
    },
  });

  return NextResponse.json({ keyword: created });
}
