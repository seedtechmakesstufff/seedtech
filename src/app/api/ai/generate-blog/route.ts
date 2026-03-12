import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { TRACKED_KEYWORDS, CONTENT_CALENDAR } from "@/data/seo-strategy";

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
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-replace")) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { step, topic, keyword, outline, tone = "professional", wordCount = 1500 } = body;

  // Build context about SeedTech's SEO strategy
  const strategyContext = `
SeedTech is a managed IT services and web development company based in Hopatcong, NJ (Northern New Jersey).
Domain: seedtechllc.com
Primary service: Managed IT support (per-user pricing, no contracts)
Secondary: Web development, digital marketing
Target audience: Small and mid-size businesses in Northern NJ / NYC metro area

Current SEO keywords being targeted:
${TRACKED_KEYWORDS.slice(0, 10).map((k) => `- "${k.keyword}" (Tier ${k.tier}, ${k.intent})`).join("\n")}

The blog should always link back to the managed IT pillar page (/services/managed-it) and pricing page (/pricing/it-support) where relevant.
Include natural internal links. Write for humans first, search engines second.
Location: Northern New Jersey. Never mention Austin.
`;

  let systemPrompt = "";
  let userPrompt = "";

  switch (step) {
    case "outline":
      systemPrompt = `You are an expert SEO content strategist for an MSP (managed service provider). Generate detailed blog post outlines that will rank well and provide real value. ${strategyContext}`;
      userPrompt = `Create a detailed outline for a blog post about: "${topic}"
Target keyword: "${keyword}"
Target word count: ${wordCount}
Tone: ${tone}

Return a structured outline in this exact JSON format:
{
  "title": "SEO-optimized title (include keyword naturally)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence excerpt for the blog index",
  "sections": [
    { "heading": "H2 heading text", "points": ["key point 1", "key point 2", "key point 3"], "estimatedWords": 300 }
  ],
  "metaTitle": "Title tag for SEO (under 60 chars)",
  "metaDescription": "Meta description (under 160 chars)",
  "internalLinks": ["/services/managed-it", "/pricing/it-support"],
  "category": "IT Support | Web Development | Cybersecurity | Business",
  "tags": ["tag1", "tag2"]
}`;
      break;

    case "draft":
      systemPrompt = `You are a skilled technology writer creating SEO-optimized blog content for SeedTech, an MSP in Northern New Jersey. Write engaging, helpful content that balances SEO optimization with genuine reader value. Use Markdown formatting. ${strategyContext}`;
      userPrompt = `Write a full blog post based on this outline:

${JSON.stringify(outline, null, 2)}

Requirements:
- Target keyword: "${keyword}" — use it naturally 3-5 times, including in the first paragraph
- Word count target: ${wordCount}
- Tone: ${tone}
- Use proper Markdown: ## for H2, ### for H3, **bold** for emphasis, bullet lists
- Include a compelling introduction that hooks the reader
- End with a clear CTA mentioning SeedTech's services
- Include natural places for internal links (mark with [INTERNAL: /path] notation)
- Write for Northern New Jersey business owners
- Be specific and actionable — avoid fluff
- Include statistics or data points where relevant

Return the full Markdown blog post content only, no JSON wrapper.`;
      break;

    case "meta":
      systemPrompt = `You are an SEO expert. Generate optimized metadata for blog posts. ${strategyContext}`;
      userPrompt = `Generate SEO metadata for this blog post:

Title: ${topic}
Target keyword: ${keyword}

Return JSON:
{
  "metaTitle": "SEO title tag, under 60 characters, include keyword",
  "metaDescription": "Meta description, under 160 characters, include keyword, compelling CTA",
  "excerpt": "1-2 sentence excerpt for blog index cards"
}`;
      break;

    default:
      return NextResponse.json({ error: "Invalid step. Use: outline, draft, or meta" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `OpenAI API error: ${err.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

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
