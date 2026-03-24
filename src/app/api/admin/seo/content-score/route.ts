import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { scoreContentEEAT } from "@/lib/seo-eeat";
import { scoreAIOReadiness } from "@/lib/seo-aio";

/**
 * POST /api/admin/seo/content-score — Score a page's content
 * GET  /api/admin/seo/content-score — Get all stored content scores
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scores = await prisma.contentScore.findMany({
    orderBy: { overallScore: "asc" },
  });

  return NextResponse.json({ scores });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { pageUrl, content, keyword, blogPostId } = body;

  if (!pageUrl || !content) {
    return NextResponse.json(
      { error: "pageUrl and content are required" },
      { status: 400 }
    );
  }

  // Score the content
  const eeatResult = scoreContentEEAT(content, keyword);
  const aioResult = scoreAIOReadiness(content, keyword);

  // Count links
  const internalLinkCount =
    (content.match(/\]\(\//g) || []).length +
    (content.match(/href="\//g) || []).length;
  const externalLinkCount =
    (content.match(/\]\(https?:\/\//g) || []).length +
    (content.match(/href="https?:\/\//g) || []).length;

  // Word count
  const wordCount = content
    .replace(/[#*_\[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  // Simple readability (avg sentence length as proxy)
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
  const avgSentenceLength = sentences.length > 0
    ? wordCount / sentences.length
    : 0;
  const readabilityGrade = Math.min(20, Math.max(1, avgSentenceLength / 2));

  // Detect schema and FAQ
  const hasSchema = content.includes("application/ld+json") || content.includes("@type");
  const hasFaq = /^#{2,3}\s.+\?$/m.test(content) || content.toLowerCase().includes("faq");

  const overallScore = Math.round((eeatResult.score + aioResult.overall) / 2);

  const score = await prisma.contentScore.upsert({
    where: { pageUrl },
    update: {
      eeatScore: eeatResult.score,
      aioScore: aioResult.overall,
      overallScore,
      wordCount,
      readabilityGrade,
      internalLinks: internalLinkCount,
      externalLinks: externalLinkCount,
      hasSchema,
      hasFaq,
      hasSpeakable: false, // Determined by crawler, not content alone
      issues: JSON.parse(
        JSON.stringify([
          ...eeatResult.issues.map((i) => ({ type: "eeat", message: i, severity: "warning" })),
          ...aioResult.issues
            .filter((i) => !i.passed)
            .map((i) => ({ type: "aio", message: i.message, severity: "warning" })),
        ])
      ),
      blogPostId: blogPostId || null,
      scoredAt: new Date(),
    },
    create: {
      pageUrl,
      eeatScore: eeatResult.score,
      aioScore: aioResult.overall,
      overallScore,
      wordCount,
      readabilityGrade,
      internalLinks: internalLinkCount,
      externalLinks: externalLinkCount,
      hasSchema,
      hasFaq,
      hasSpeakable: false,
      issues: JSON.parse(
        JSON.stringify([
          ...eeatResult.issues.map((i) => ({ type: "eeat", message: i, severity: "warning" })),
          ...aioResult.issues
            .filter((i) => !i.passed)
            .map((i) => ({ type: "aio", message: i.message, severity: "warning" })),
        ])
      ),
      blogPostId: blogPostId || null,
    },
  });

  return NextResponse.json({
    score,
    details: {
      eeat: eeatResult,
      aio: aioResult,
    },
  });
}
