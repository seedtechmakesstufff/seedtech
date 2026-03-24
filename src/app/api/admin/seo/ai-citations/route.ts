import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/ai-citations — Get AI citation history + stats
 * POST /api/admin/seo/ai-citations — Log a new AI citation check result
 *
 * This API tracks brand mentions across AI platforms.
 * The data powers the AI Visibility dashboard and trend tracking.
 */

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const days = parseInt(searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 86400000);

  const where: Record<string, unknown> = { siteId, checkedAt: { gte: since } };
  if (platform) where.platform = platform;

  const [citations, totalByPlatform] = await Promise.all([
    prisma.aICitation.findMany({
      where,
      orderBy: { checkedAt: "desc" },
      take: 100,
    }),
    prisma.aICitation.groupBy({
      by: ["platform"],
      where: { siteId, checkedAt: { gte: since } },
      _count: { id: true },
    }),
  ]);

  // Get brand mention counts separately
  const mentionCounts = await prisma.aICitation.groupBy({
    by: ["platform"],
    where: { siteId, checkedAt: { gte: since }, brandMentioned: true },
    _count: { id: true },
  });

  const mentionMap = new Map(
    mentionCounts.map((m: { platform: string; _count: { id: number } }) => [m.platform, m._count.id])
  );

  const enrichedStats = totalByPlatform.map((s: { platform: string; _count: { id: number } }) => {
    const mentions = mentionMap.get(s.platform) || 0;
    return {
      platform: s.platform,
      totalChecks: s._count.id,
      brandMentions: mentions,
      mentionRate: s._count.id > 0 ? Math.round((mentions / s._count.id) * 100) : 0,
    };
  });

  return NextResponse.json({
    citations,
    stats: enrichedStats,
    period: { days, since: since.toISOString() },
  });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { platform, query, brandMentioned, urlCited, context, citationType, sentiment, metadata } = body;

  if (!platform || !query) {
    return NextResponse.json(
      { error: "platform and query are required" },
      { status: 400 }
    );
  }

  const citation = await prisma.aICitation.create({
    data: {
      siteId,
      platform,
      query,
      brandMentioned: brandMentioned ?? false,
      urlCited: urlCited || null,
      context: context || null,
      citationType: citationType || null,
      sentiment: sentiment || null,
      metadata: metadata || null,
    },
  });

  return NextResponse.json({ citation }, { status: 201 });
}
