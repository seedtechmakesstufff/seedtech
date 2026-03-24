import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { scoreAIVisibility } from "@/lib/ai-visibility";

/**
 * GET  /api/admin/seo/ai-visibility — Get AI Visibility scores + trends
 * POST /api/admin/seo/ai-visibility — Score a page and store the result
 *
 * This is the PRIMARY SEO metric. Traditional ranking is secondary.
 */

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl");
  const days = parseInt(searchParams.get("days") || "90");
  const since = new Date(Date.now() - days * 86400000);

  if (pageUrl) {
    // Get trend for a specific page
    const scores = await prisma.aIVisibilityScore.findMany({
      where: { pageUrl, scoredAt: { gte: since } },
      orderBy: { scoredAt: "asc" },
    });
    return NextResponse.json({ scores, pageUrl });
  }

  // Get latest scores for all pages
  const latestScores = await prisma.aIVisibilityScore.findMany({
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
