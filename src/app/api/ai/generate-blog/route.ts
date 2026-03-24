import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { TRACKED_KEYWORDS } from "@/data/seo-strategy";
import { buildStrategyPrompt } from "@/lib/business-context";
import { getAIOWritingInstructions, scoreAIOReadiness, getPAAResearchPrompt } from "@/lib/seo-aio";
import { getAuthorEntity, scoreContentEEAT } from "@/lib/seo-eeat";
import { scoreAIVisibility, getAIFirstWritingInstructions } from "@/lib/ai-visibility";
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
  const _aioInstructions = getAIOWritingInstructions();
  const aiFirstInstructions = getAIFirstWritingInstructions();

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
      systemPrompt = `You are an expert AI visibility strategist for an MSP (managed service provider). Your goal is NOT to make content that "ranks" — it's to create content that AI SYSTEMS (Google AIO, ChatGPT, Perplexity, Gemini) will CITE as an authoritative source. Generate outlines that maximize AI citation potential. ${strategyContext}`;
      userPrompt = `Create a detailed outline for a blog post about: "${topic}"
Target keyword: "${keyword}"
Target word count: ${wordCount}
Tone: ${tone}

CRITICAL — Structure for AI CITATION (not just ranking):
- Start with a "Direct Answer" section (2-3 sentence citeable block answering the core query)
- Use H2/H3 question-based headings matching how people ASK AI (What, How, Why, When, Which is best)
- Plan at least one comparison table (tables are the #1 most-cited format)
- Plan at least one numbered step/process section
- Include a "Why [Brand] for [Topic]" section establishing entity authority
- Plan sections that cover: how, what, why, when, comparison, and recommendation query patterns
- End with a robust FAQ section (4-6 questions with 2-3 sentence answers each)
- Each section should have at least one citeable block (a self-contained 20-60 word paragraph with a specific fact)

Return a structured outline in this exact JSON format:
{
  "title": "AI-citation-optimized title (include keyword naturally, use question format if relevant)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence excerpt for the blog index",
  "sections": [
    { "heading": "H2 heading text (use question format where possible)", "points": ["key point 1", "key point 2", "key point 3"], "estimatedWords": 300 }
  ],
  "faqSection": [
    { "question": "Common question about the topic?", "answer": "Brief 2-3 sentence answer written as a citeable block" }
  ],
  "metaTitle": "Title tag for SEO (under 60 chars)",
  "metaDescription": "Meta description (under 160 chars)",
  "internalLinks": ["/services/managed-it", "/pricing/it-support"],
  "category": "IT Support | Web Development | Cybersecurity | Business",
  "tags": ["tag1", "tag2"]
}`;
      break;

    case "draft":
      systemPrompt = `You are a skilled technology writer creating content optimized for AI CITATION — not just search ranking. Your goal is to write content that Google AIO, ChatGPT, Perplexity, and Gemini will quote as an authoritative source. You're writing for SeedTech, an MSP in Northern New Jersey. ${strategyContext}

${aiFirstInstructions}`;
      userPrompt = `Write a full blog post based on this outline:

${JSON.stringify(outline, null, 2)}

CRITICAL REQUIREMENTS — WRITE FOR AI CITATION:
- Target keyword: "${keyword}" — use it naturally 3-5 times, including in the first paragraph
- Word count target: ${wordCount}
- Tone: ${tone}
- Use proper Markdown: ## for H2, ### for H3, **bold** for emphasis, bullet lists

**AI Citation Structure:**
- FIRST PARAGRAPH: Write a 20-60 word "citeable block" that directly answers the core question. This is what AI systems will quote. Include the target keyword and a specific fact/number.
- Define SeedTech as an entity within the first 3 paragraphs: "SeedTech is a [what] serving [who]..."
- Every section should contain at least one self-contained "citeable paragraph" (20-60 words with a specific claim + evidence)
- Include claim+evidence patterns: "According to NIST...", "Research shows...", "Industry data indicates..."
- Use question-format headings matching how people ASK AI (not just Google)
- Include at least one comparison table (the most-cited content format across all AI platforms)
- Use numbered step lists for any process or sequential content
- End with a robust FAQ section (4-6 questions as ### headings, each with a 2-3 sentence answer)
- End with a clear CTA mentioning SeedTech's services and service area

**Entity Authority:**
- Mention relevant certifications and credentials
- Reference authoritative sources (NIST, CISA, Microsoft, Gartner)
- Include geographic anchoring (Northern NJ, Bergen County, etc.)
- Use first-person expertise language ("In our experience...", "We've helped clients...")
- Connect to known entities (Microsoft 365, Azure, AWS, etc.)

**Technical:**
- For internal links, use standard Markdown links: [View Pricing](/pricing/it-support). NEVER use [INTERNAL: ...] notation.
- Keep paragraphs to 2-4 sentences (20-80 words each)
- Include horizontal rules (---) between major sections for visual separation
- Include current year references for freshness signals

Return the full Markdown blog post content only, no JSON wrapper.`;
      break;

    case "meta":
      systemPrompt = `You are an AI visibility expert. Generate metadata that maximizes both AI citation potential and click-through when links ARE shown. ${strategyContext}`;
      userPrompt = `Generate SEO metadata for this blog post:

Title: ${topic}
Target keyword: ${keyword}

Return JSON:
{
  "metaTitle": "Title tag, under 60 chars, include keyword, use a power word — optimized for both Google and AI citation",
  "metaDescription": "Meta description, under 160 chars, include keyword, compelling CTA, position the brand as the authority",
  "excerpt": "1-2 sentence excerpt — write it as a citeable block that AI could quote directly",
  "speakableSelectors": [".blog-intro", ".blog-faq"]
}`;
      break;

    case "score": {
      // Score existing content for AI Visibility, E-E-A-T, and AIO readiness
      if (!content) {
        return NextResponse.json({ error: "Content is required for scoring" }, { status: 400 });
      }
      const eeatScore = scoreContentEEAT(content, keyword);
      const aioScore = scoreAIOReadiness(content, keyword);
      const aiVisScore = scoreAIVisibility(content, keyword);
      return NextResponse.json({
        result: {
          eeat: eeatScore,
          aio: aioScore,
          aiVisibility: aiVisScore,
          overall: Math.round(
            (aiVisScore.overall * 0.5) + (eeatScore.score * 0.25) + (aioScore.overall * 0.25)
          ),
          recommendations: [
            // AI Visibility fixes first (highest priority)
            ...aiVisScore.checks
              .filter((c) => !c.passed)
              .sort((a, b) => b.weight - a.weight)
              .slice(0, 4)
              .map((c) => c.fix || c.message),
            // Then E-E-A-T suggestions
            ...eeatScore.suggestions.slice(0, 2),
            // Then AIO-specific fixes
            ...aioScore.issues
              .filter((i) => !i.passed)
              .map((i) => i.recommendation || i.message)
              .slice(0, 2),
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
