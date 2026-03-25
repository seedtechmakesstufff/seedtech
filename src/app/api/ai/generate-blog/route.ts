import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getTrackedKeywords } from "@/lib/site-data";
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

  // Load tracked keywords from DB
  const dbKeywords = await getTrackedKeywords();
  const keywordContext = dbKeywords.slice(0, 10).map((k) => `- "${k.keyword}" (${k.tier}, ${k.intent})`).join("\n");

  const strategyContext = `
${businessContext}

Author: ${author.name}, ${author.jobTitle}
${author.bio}

Current SEO keywords being targeted:
${keywordContext}
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

═══════════════════════════════════════════════════════════
CRITICAL — Structure for AI CITATION (not just ranking):
═══════════════════════════════════════════════════════════

The outline MUST include ALL of these mandatory components:

1. **Citeable Opening** — Plan a 20-60 word direct-answer paragraph as the very first section
2. **Entity Definition** — A section establishing "SeedTech is a [what] serving [who] in [where]"
3. **Question-Format H2 Headings** — EVERY section heading must be a question (How, What, Why, When, Which)
   ✅ "How Much Does Managed IT Cost Per Month?"
   ❌ "Pricing" or "Cost Overview"
4. **Comparison Table** — Plan at least one section with a comparison table (this is the #1 format AI cites)
5. **Numbered Steps** — Plan at least one section with a step-by-step process
6. **Definition Blocks** — Plan at least 2 clear "X is Y" definitions
7. **FAQ Section** — Plan 4-6 questions with 2-3 sentence answers each (MANDATORY)
8. **CTA Closing** — Call-to-action referencing SeedTech and NJ service area

Return a structured outline in this exact JSON format:
{
  "title": "AI-citation-optimized title (include keyword naturally, use question format if relevant)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence excerpt that could be quoted by AI directly",
  "sections": [
    { "heading": "H2 heading as a QUESTION ending in ?", "points": ["key point 1", "key point 2", "key point 3"], "estimatedWords": 300, "mustInclude": "table|steps|definitions|none" }
  ],
  "faqSection": [
    { "question": "Natural question about the topic?", "answer": "2-3 sentence answer written as a citeable block (20-60 words with a specific fact)" }
  ],
  "metaTitle": "Title tag for SEO (under 60 chars)",
  "metaDescription": "Meta description (under 160 chars)",
  "internalLinks": ["/services/managed-it", "/pricing/it-support"],
  "category": "IT Support | Web Development | Cybersecurity | Business",
  "tags": ["tag1", "tag2"]
}

SELF-CHECK: Ensure faqSection has 4-6 items, all section headings end with ?, and at least one section has mustInclude: "table" and one has mustInclude: "steps".`;
      break;

    case "draft":
      systemPrompt = `You are a skilled technology writer creating content optimized for AI CITATION — not just search ranking. Your goal is to write content that Google AIO, ChatGPT, Perplexity, and Gemini will quote as an authoritative source. You're writing for SeedTech, an MSP in Northern New Jersey. ${strategyContext}

${aiFirstInstructions}`;
      userPrompt = `Write a full blog post based on this outline:

${JSON.stringify(outline, null, 2)}

Target keyword: "${keyword}" — use it naturally 3-5 times, including in the first paragraph
Word count target: ${wordCount}
Tone: ${tone}

═══════════════════════════════════════════════════════════
MANDATORY STRUCTURE — You MUST follow this exact document skeleton.
AI systems (Google AIO, ChatGPT, Perplexity, Gemini) parse content by structure.
This template is engineered for maximum AI citation probability.
═══════════════════════════════════════════════════════════

## Document Structure (follow this ORDER):

### 1. CITEABLE OPENING (FIRST PARAGRAPH — MOST IMPORTANT)
Write exactly 20-60 words that DIRECTLY answer the core question.
Include the target keyword and one specific number/fact.
Write it as if YOU are the AI giving the answer — this is the paragraph AI will quote verbatim.
Example: "Managed IT services for small businesses in Northern NJ typically cost between $125 and $250 per user per month in 2026, depending on the level of support, response time guarantees, and included cybersecurity protections."

### 2. ENTITY DEFINITION (WITHIN FIRST 3 PARAGRAPHS)
Define the brand clearly: "SeedTech is a [specific type of company] serving [specific audience] in [specific geography]."
This connects your brand to AI knowledge graphs as a recognized entity.

### 3. BODY SECTIONS (USE QUESTION-FORMAT H2 HEADINGS)
EVERY H2 heading MUST be phrased as a question matching how people ask AI:
✅ "## How Much Does Managed IT Cost Per Month?"
✅ "## What's Included in a Managed IT Plan?"
✅ "## Why Do Small Businesses Need Managed IT?"
❌ "## Pricing" ← NEVER use vague noun headings
❌ "## Services Included" ← NEVER use non-question format

Each section must contain:
- At least one "citeable paragraph" (20-60 words, self-contained, includes a fact)
- Claim+evidence patterns: "According to [source], [fact]." or "Industry data shows [stat]."
- Reference known entities: Microsoft, NIST, CISA, CompTIA, AWS, Azure, etc.
- Geographic anchoring: mention NJ, Bergen County, Northern New Jersey, etc.

### 4. COMPARISON TABLE (MANDATORY — include at LEAST one)
Tables are the #1 most-cited content format across ALL AI platforms.
Use Markdown table syntax. Examples:
- Break-Fix vs Managed IT
- Pricing tier comparison
- Feature comparison
- Pros vs Cons

### 5. NUMBERED STEPS / PROCESS (MANDATORY — include at LEAST one)
Use ordered lists (1. 2. 3.) for any process, getting-started, or how-to content.
AI frequently cites numbered step content verbatim.

### 6. DEFINITION BLOCKS (MANDATORY — include at LEAST 2)
Include clear "X is Y" definition sentences that AI extracts into knowledge graphs:
"A managed service provider (MSP) is a company that remotely manages a customer's IT infrastructure."
"Break-fix IT support is a reactive model where businesses pay only when something breaks."

### 7. FAQ SECTION (MANDATORY — this section MUST exist)
End with exactly this format:

## Frequently Asked Questions

### [Question phrased naturally]?
[2-3 sentence answer. Each answer must be a self-contained citeable block of 20-60 words. Include a specific fact or number.]

### [Question phrased naturally]?
[2-3 sentence answer.]

(Include 4-6 FAQ questions. These must be ### headings ending with ?)

### 8. CTA / CLOSING
End with a call-to-action mentioning SeedTech's services and Northern NJ service area.

═══════════════════════════════════════════════════════════
FORMATTING RULES:
═══════════════════════════════════════════════════════════
- Use proper Markdown: ## for H2, ### for H3, **bold** for emphasis
- Keep paragraphs to 2-4 sentences (20-80 words each) — short, dense, citeable
- Use horizontal rules (---) between major sections
- For internal links: [View Pricing](/pricing/it-support) — NEVER use [INTERNAL: ...] notation
- Include current year (2026) references for freshness signals
- Use first-person expertise: "In our experience...", "We've helped clients..."
- Mention certifications: CompTIA, Microsoft Partner, etc.

SELF-CHECK before returning:
□ First paragraph is 20-60 words and directly answers the core question
□ SeedTech is defined as an entity in first 3 paragraphs
□ ALL H2 headings are phrased as questions ending with ?
□ At least 1 comparison table exists
□ At least 1 numbered step list exists
□ At least 2 "X is Y" definition sentences exist
□ FAQ section exists with 4-6 ### question headings
□ Geographic references to NJ included
□ Known entities (Microsoft, NIST, etc.) are referenced

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
