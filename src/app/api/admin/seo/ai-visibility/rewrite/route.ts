import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { scoreAIVisibility, getAIFirstWritingInstructions } from "@/lib/ai-visibility";
import { buildStrategyPrompt } from "@/lib/business-context";

/**
 * POST /api/admin/seo/ai-visibility/rewrite
 *
 * Takes a pageUrl, fetches the blog post content, sends it to Claude
 * with the failed checks as targeted rewrite instructions, and returns
 * the improved content + new score.
 *
 * Body: { pageUrl: string }
 * Returns: { rewritten: string, oldScore: number, newScore: object, postId: string }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { pageUrl } = body;

  if (!pageUrl) {
    return NextResponse.json({ error: "pageUrl is required" }, { status: 400 });
  }

  // ── 1. Resolve blog post from pageUrl (e.g. /blog/some-slug) ──
  const slugMatch = pageUrl.match(/\/blog\/(.+)$/);
  if (!slugMatch) {
    return NextResponse.json(
      { error: "Only blog posts can be rewritten. Expected /blog/<slug>" },
      { status: 400 }
    );
  }

  const slug = slugMatch[1];
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) {
    return NextResponse.json({ error: `Blog post not found: ${slug}` }, { status: 404 });
  }

  // ── 2. Get current AI Visibility score + failed checks ──
  const currentScore = scoreAIVisibility(post.body, post.targetKeyword || undefined);
  const failedChecks = currentScore.checks.filter((c) => !c.passed);

  if (failedChecks.length === 0) {
    return NextResponse.json({
      rewritten: null,
      message: "All checks are passing — no rewrite needed.",
      oldScore: currentScore.overall,
      newScore: currentScore,
      postId: post.id,
    });
  }

  // ── 3. Build the rewrite prompt ──
  const aiFirstInstructions = getAIFirstWritingInstructions();
  const businessContext = buildStrategyPrompt();

  const failedChecksList = failedChecks
    .sort((a, b) => b.weight - a.weight)
    .map((c, i) => `${i + 1}. [${c.category}] ${c.check} — FIX: ${c.fix}`)
    .join("\n");

  const systemPrompt = `You are an expert AI visibility content editor for SeedTech, an MSP in Northern New Jersey. Your job is to REWRITE existing blog content to fix specific AI Visibility failures while preserving the article's voice, facts, and overall structure.

${businessContext}

${aiFirstInstructions}

CRITICAL RULES:
- Fix ALL the failed checks listed below
- Preserve the article's existing facts, claims, and unique insights
- Do NOT add fabricated statistics or made-up source citations
- Keep the same approximate word count (±15%)
- Keep the same slug-friendly topic focus
- Maintain the same tone and brand voice
- Return ONLY the rewritten Markdown content — no explanations, no JSON wrapping`;

  const userPrompt = `Here is a blog post that scored ${currentScore.overall}/100 (Grade ${currentScore.grade}) on AI Visibility.

═══════════════════════════════════════════════════════════
FAILED CHECKS TO FIX (${failedChecks.length} total):
═══════════════════════════════════════════════════════════
${failedChecksList}

═══════════════════════════════════════════════════════════
CURRENT CONTENT:
═══════════════════════════════════════════════════════════
Title: ${post.title}
Target Keyword: ${post.targetKeyword || "none specified"}

${post.body}

═══════════════════════════════════════════════════════════
INSTRUCTIONS:
═══════════════════════════════════════════════════════════
Rewrite this content to pass ALL ${failedChecks.length} failed checks above.
Focus on the highest-weight failures first.
Return the complete rewritten Markdown content only.`;

  // ── 4. Call Claude for the rewrite ──
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Claude API error: ${err.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rewritten = data.content?.[0]?.text ?? "";

    if (!rewritten || rewritten.length < 100) {
      return NextResponse.json(
        { error: "Rewrite produced empty or too-short content" },
        { status: 500 }
      );
    }

    // ── 5. Score the rewritten content ──
    const newScore = scoreAIVisibility(rewritten, post.targetKeyword || undefined);

    return NextResponse.json({
      rewritten,
      postId: post.id,
      postTitle: post.title,
      oldScore: currentScore.overall,
      oldGrade: currentScore.grade,
      newScore: {
        overall: newScore.overall,
        grade: newScore.grade,
        citationReadiness: newScore.citationReadiness,
        entityAuthority: newScore.entityAuthority,
        structuredClarity: newScore.structuredClarity,
        conversationalFit: newScore.conversationalFit,
        multiEngineCoverage: newScore.multiEngineCoverage,
        failedChecks: newScore.checks
          .filter((c) => !c.passed)
          .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
        totalChecks: newScore.checks.length,
        passedChecks: newScore.checks.filter((c) => c.passed).length,
      },
      fixedCount: failedChecks.length - newScore.checks.filter((c) => !c.passed).length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Rewrite failed: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/ai-visibility/rewrite
 *
 * Accept a rewrite: saves the new content to the blog post and re-scores.
 * Body: { postId: string, content: string }
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { postId, content } = body;

  if (!postId || !content) {
    return NextResponse.json(
      { error: "postId and content are required" },
      { status: 400 }
    );
  }

  // Update the blog post
  const post = await prisma.blogPost.update({
    where: { id: postId },
    data: {
      body: content,
      wordCount: content
        .replace(/[#*_\[\]()>`~-]/g, "")
        .split(/\s+/)
        .filter(Boolean).length,
    },
  });

  // Re-score and store
  const result = scoreAIVisibility(content, post.targetKeyword || undefined);
  const pageUrl = `/blog/${post.slug}`;

  await prisma.aIVisibilityScore.create({
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

  return NextResponse.json({
    saved: true,
    postId: post.id,
    pageUrl,
    newScore: {
      overall: result.overall,
      grade: result.grade,
      citationReadiness: result.citationReadiness,
      entityAuthority: result.entityAuthority,
      structuredClarity: result.structuredClarity,
      conversationalFit: result.conversationalFit,
      multiEngineCoverage: result.multiEngineCoverage,
      failedChecks: result.checks
        .filter((c) => !c.passed)
        .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
    },
  });
}
