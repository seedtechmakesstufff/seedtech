import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAIVisibility } from "@/lib/ai-visibility";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/ai-visibility — Get AI Visibility scores + trends
 * POST /api/admin/seo/ai-visibility — Score a page and store the result
 *
 * This is the PRIMARY SEO metric. Traditional ranking is secondary.
 */

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl");
  const days = parseInt(searchParams.get("days") || "90");
  const since = new Date(Date.now() - days * 86400000);

  if (pageUrl) {
    // Get trend for a specific page
    const scores = await prisma.aIVisibilityScore.findMany({
      where: { siteId, pageUrl, scoredAt: { gte: since } },
      orderBy: { scoredAt: "asc" },
    });
    return NextResponse.json({ scores, pageUrl });
  }

  // ── Auto-score any published posts that haven't been scored yet ──
  try {
    const publishedPosts = await prisma.blogPost.findMany({
      where: { siteId, status: "published" },
      select: { slug: true, body: true, targetKeyword: true },
    });

    const existingScoreUrls = new Set(
      (await prisma.aIVisibilityScore.findMany({
        where: { siteId },
        select: { pageUrl: true },
        distinct: ["pageUrl"],
      })).map((s) => s.pageUrl)
    );

    for (const post of publishedPosts) {
      const url = `/blog/${post.slug}`;
      if (!existingScoreUrls.has(url)) {
        const result = scoreAIVisibility(post.body, post.targetKeyword || undefined);
        await prisma.aIVisibilityScore.create({
          data: {
            siteId,
            pageUrl: url,
            overallScore: result.overall,
            citationReadiness: result.citationReadiness,
            entityAuthority: result.entityAuthority,
            structuredClarity: result.structuredClarity,
            conversationalFit: result.conversationalFit,
            multiEngineCoverage: result.multiEngineCoverage,
            grade: result.grade,
            failedChecks: result.checks
              .filter((c) => !c.passed)
              .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
          },
        });
      }
    }
  } catch (e) {
    console.error("[ai-visibility] Auto-score error:", e);
  }

  // Get latest scores for all pages
  const latestScores = await prisma.aIVisibilityScore.findMany({
    where: { siteId },
    orderBy: { scoredAt: "desc" },
    distinct: ["pageUrl"],
    take: 50,
  });

  // Summary stats
  const avgScore = latestScores.length > 0
    ? Math.round(latestScores.reduce((sum, s) => sum + s.overallScore, 0) / latestScores.length)
    : 0;

  const gradeDistribution = latestScores.reduce(
    (acc, s) => {
      acc[s.grade as keyof typeof acc] = (acc[s.grade as keyof typeof acc] || 0) + 1;
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0, F: 0 } as Record<string, number>
  );

  return NextResponse.json({
    scores: latestScores,
    summary: {
      totalPages: latestScores.length,
      averageScore: avgScore,
      gradeDistribution,
    },
  });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { pageUrl, content, keyword } = body;

  if (!pageUrl || !content) {
    return NextResponse.json(
      { error: "pageUrl and content are required" },
      { status: 400 }
    );
  }

  // Score the content
  const result = scoreAIVisibility(content, keyword);

  // Store the score
  const score = await prisma.aIVisibilityScore.create({
    data: {
      siteId,
      pageUrl,
      overallScore: result.overall,
      citationReadiness: result.citationReadiness,
      entityAuthority: result.entityAuthority,
      structuredClarity: result.structuredClarity,
      conversationalFit: result.conversationalFit,
      multiEngineCoverage: result.multiEngineCoverage,
      grade: result.grade,
      failedChecks: result.checks
        .filter((c) => !c.passed)
        .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
    },
  });

  return NextResponse.json({ score, details: result }, { status: 201 });
}
