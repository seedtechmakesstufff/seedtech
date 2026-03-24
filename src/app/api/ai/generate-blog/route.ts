import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { TRACKED_KEYWORDS } from "@/data/seo-strategy";
import { buildStrategyPrompt } from "@/lib/business-context";
import { getAIOWritingInstructions, scoreAIOReadiness, getPAAResearchPrompt } from "@/lib/seo-aio";
import { getAuthorEntity, scoreContentEEAT } from "@/lib/seo-eeat";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/ai/generate-blog
 * 
 * Accepts: { step, topic, keyword, outline, tone, wordCount }
 * Returns AI-generated content for each step of the blog wizard.
 *
 * Steps:
 *   "outline"  — generates a structured outline from topic + keyword
 *   "draft"    — generates a full blog post from the outline
 *   "meta"     — generates meta title + description
 *   "score"    — scores existing content for E-E-A-T + AIO readiness
 *   "paa"      — researches People Also Ask questions for keyword
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured. Add CLAUDE_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { step, topic, keyword, outline, tone = "professional", wordCount = 1500, content } = body;

  // Build context from editable business profile + SEO keywords
  const businessContext = buildStrategyPrompt();
  const author = getAuthorEntity();
  const aioInstructions = getAIOWritingInstructions();

  // Gather existing blog slugs for internal linking
  let existingPosts: { slug: string; title: string; targetKeyword: string }[] = [];
  try {
    existingPosts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, targetKeyword: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch { /* DB not available */ }

  const internalLinkContext = existingPosts.length > 0
    ? `\nExisting published blog posts (link to relevant ones naturally):\n${existingPosts.map((p) => `- [${p.title}](/blog/${p.slug}) — keyword: "${p.targetKeyword}"`).join("\n")}`
    : "";

  const strategyContext = `
${businessContext}

Author: ${author.name}, ${author.jobTitle}
${author.bio}

Current SEO keywords being targeted:
${TRACKED_KEYWORDS.slice(0, 10).map((k) => `- "${k.keyword}" (Tier ${k.tier}, ${k.intent})`).join("\n")}
${internalLinkContext}
`;

  let systemPrompt = "";
  let userPrompt = "";

  switch (step) {
    case "outline":
      systemPrompt = `You are an expert SEO content strategist for an MSP (managed service provider). Generate detailed blog post outlines that will rank well, get featured in AI Overviews, and provide real value. ${strategyContext}`;
      userPrompt = `Create a detailed outline for a blog post about: "${topic}"
Target keyword: "${keyword}"
Target word count: ${wordCount}
Tone: ${tone}

IMPORTANT — Structure for AI Overview optimization:
- Include a direct-answer section near the top (2-3 sentences answering the core query)
- Include H2/H3 question-based headings (What, How, Why, When)
- Plan at least one numbered/step list section
- Plan a comparison table if relevant
- End with an FAQ section (3-5 common questions)

Return a structured outline in this exact JSON format:
{
  "title": "SEO-optimized title (include keyword naturally)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence excerpt for the blog index",
  "sections": [
    { "heading": "H2 heading text", "points": ["key point 1", "key point 2", "key point 3"], "estimatedWords": 300 }
  ],
  "faqSection": [
    { "question": "Common question about the topic?", "answer": "Brief 2-3 sentence answer" }
  ],
  "metaTitle": "Title tag for SEO (under 60 chars)",
  "metaDescription": "Meta description (under 160 chars)",
  "internalLinks": ["/services/managed-it", "/pricing/it-support"],
  "category": "IT Support | Web Development | Cybersecurity | Business",
  "tags": ["tag1", "tag2"]
}`;
      break;

    case "draft":
      systemPrompt = `You are a skilled technology writer creating SEO-optimized blog content for SeedTech, an MSP in Northern New Jersey. Write engaging, helpful content that balances SEO optimization with genuine reader value. Use Markdown formatting. ${strategyContext}

${aioInstructions}`;
      userPrompt = `Write a full blog post based on this outline:

${JSON.stringify(outline, null, 2)}

Requirements:
- Target keyword: "${keyword}" — use it naturally 3-5 times, including in the first paragraph
- Word count target: ${wordCount}
- Tone: ${tone}
- Use proper Markdown: ## for H2, ### for H3, **bold** for emphasis, bullet lists
- Include a compelling introduction that hooks the reader
- FIRST PARAGRAPH: Include a direct 2-3 sentence answer to the core question (this gets pulled into AI Overviews)
- Include at least one numbered step list or comparison table
- Use question-based headings (What, How, Why) for AI Overview targeting
- End with an FAQ section using ### for each question (this generates FAQ schema automatically)
- End with a clear CTA mentioning SeedTech's services
- For internal links, use standard Markdown links with the full path, e.g. [View Pricing](/pricing/it-support) or [Learn about our managed IT services](/services/managed-it). NEVER use [INTERNAL: ...] notation.
- Write for Northern New Jersey business owners
- Be specific and actionable — avoid fluff
- Include statistics or data points where relevant (cite sources when possible for E-E-A-T)
- Include real-world examples from first-person experience (e.g., "In our experience working with NJ businesses...")
- Use horizontal rules (---) between major sections for visual separation
- Keep paragraphs short (2-4 sentences max) for readability

Return the full Markdown blog post content only, no JSON wrapper.`;
      break;

    case "meta":
      systemPrompt = `You are an SEO expert. Generate optimized metadata for blog posts that maximize CTR and AI Overview citation potential. ${strategyContext}`;
      userPrompt = `Generate SEO metadata for this blog post:

Title: ${topic}
Target keyword: ${keyword}

Return JSON:
{
  "metaTitle": "SEO title tag, under 60 characters, include keyword, use a power word",
  "metaDescription": "Meta description, under 160 characters, include keyword, compelling CTA, use numbers or data if possible",
  "excerpt": "1-2 sentence excerpt for blog index cards",
  "speakableSelectors": [".blog-intro", ".blog-faq"]
}`;
      break;

    case "score": {
      // Score existing content for E-E-A-T + AIO readiness
      if (!content) {
        return NextResponse.json({ error: "Content is required for scoring" }, { status: 400 });
      }
      const eeatScore = scoreContentEEAT(content, keyword);
      const aioScore = scoreAIOReadiness(content, keyword);
      return NextResponse.json({
        result: {
          eeat: eeatScore,
          aio: aioScore,
          overall: Math.round((eeatScore.score + aioScore.overall) / 2),
          recommendations: [
            ...eeatScore.suggestions.slice(0, 3),
            ...aioScore.issues.filter((i) => !i.passed).map((i) => i.recommendation || i.message).slice(0, 3),
          ],
        },
      });
    }

    case "paa": {
      // Research People Also Ask questions
      if (!keyword) {
        return NextResponse.json({ error: "Keyword is required for PAA research" }, { status: 400 });
      }
      const paaPrompt = getPAAResearchPrompt(keyword);
      const paaRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: "You are an SEO expert specializing in Google's People Also Ask feature. Return JSON arrays only.",
          messages: [{ role: "user", content: paaPrompt }],
        }),
      });
      if (!paaRes.ok) {
        return NextResponse.json({ error: "PAA research failed" }, { status: 500 });
      }
      const paaData = await paaRes.json();
      const paaContent = paaData.content?.[0]?.text ?? "[]";
      try {
        const jsonMatch = paaContent.match(/\[[\s\S]*\]/);
        return NextResponse.json({ result: jsonMatch ? JSON.parse(jsonMatch[0]) : [] });
      } catch {
        return NextResponse.json({ result: paaContent });
      }
    }

    default:
      return NextResponse.json({ error: "Invalid step. Use: outline, draft, meta, score, or paa" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
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
    const content = data.content?.[0]?.text ?? "";

    // Try to parse as JSON if it's an outline or meta step
    if (step === "outline" || step === "meta") {
      try {
        // Extract JSON from potential markdown code fences
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const parsed = JSON.parse(jsonMatch[1]!.trim());
        return NextResponse.json({ result: parsed });
      } catch {
        return NextResponse.json({ result: content });
      }
    }

    return NextResponse.json({ result: content });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to generate content: ${err.message}` },
      { status: 500 }
    );
  }
}
