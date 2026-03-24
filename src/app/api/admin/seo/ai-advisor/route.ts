import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { buildStrategyPrompt } from "@/lib/business-context";
import { TRACKED_KEYWORDS, SEO_TASKS, CONTENT_CALENDAR } from "@/data/seo-strategy";
import {
  isSearchConsoleConfigured,
  getSearchConsoleSummary,
  getTrackedKeywordPositions,
} from "@/lib/google-search-console";
import { getAIOAdvisorContext } from "@/lib/seo-aio";
import { getAIVisibilityAdvisorContext } from "@/lib/ai-visibility";

/**
 * POST /api/admin/seo/ai-advisor
 *
 * Body: { 
 *   question?: string,       — Optional specific question
 *   includeSearchConsole?: boolean,
 *   includePageSpeed?: boolean,
 *   pageSpeedData?: object,  — Pre-fetched PageSpeed data from the client
 * }
 *
 * Analyzes real data (Search Console, PageSpeed, strategy) with GPT-4o
 * to produce actionable SEO recommendations.
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
  const {
    question,
    includeSearchConsole = true,
    includePageSpeed: _includePageSpeed = false,
    pageSpeedData,
  } = body;

  // Build context
  const businessContext = buildStrategyPrompt();

  // Strategy data
  const strategyData = {
    trackedKeywords: TRACKED_KEYWORDS.map((k) => ({
      keyword: k.keyword,
      tier: k.tier,
      volume: k.volume,
      competition: k.competition,
      intent: k.intent,
      targetPage: k.targetPage,
    })),
    tasks: SEO_TASKS.map((t) => ({
      title: t.title,
      phase: t.phase,
      status: t.status,
      priority: t.priority,
    })),
    contentCalendar: CONTENT_CALENDAR.map((c) => ({
      title: c.title,
      keyword: c.targetKeyword,
      status: c.status,
    })),
  };

  // Real Search Console data (if configured and requested)
  let searchConsoleData: any = null;
  if (includeSearchConsole && isSearchConsoleConfigured()) {
    try {
      const [summary, positions] = await Promise.all([
        getSearchConsoleSummary(28),
        getTrackedKeywordPositions(
          TRACKED_KEYWORDS.map((k) => k.keyword),
          28
        ),
      ]);
      searchConsoleData = { summary, trackedPositions: positions };
    } catch {
      searchConsoleData = { error: "Failed to fetch Search Console data" };
    }
  }

  // Build the prompt
  const aioContext = getAIOAdvisorContext();
  const aiVisContext = getAIVisibilityAdvisorContext();
  const systemPrompt = `You are an expert AI visibility strategist and consultant for ${businessContext}

${aiVisContext}

${aioContext}

Your job is to analyze the data provided and give actionable, prioritized recommendations.
LEAD WITH AI VISIBILITY — not traditional ranking.
Be specific — reference actual keywords, pages, and metrics. 
Always explain the "why" behind each recommendation.
The primary question for every piece of content should be: "Would AI systems cite this?"
Format your response in Markdown with clear headings and bullet points.
Focus on high-impact, practical actions the team can take this week.`;

  let dataBlock = `## Current SEO Strategy Data
\`\`\`json
${JSON.stringify(strategyData, null, 2)}
\`\`\``;

  if (searchConsoleData && !searchConsoleData.error) {
    dataBlock += `

## Live Search Console Data (last 28 days)
Total Clicks: ${searchConsoleData.summary.totalClicks}
Total Impressions: ${searchConsoleData.summary.totalImpressions}
Average CTR: ${(searchConsoleData.summary.avgCtr * 100).toFixed(1)}%
Average Position: ${searchConsoleData.summary.avgPosition}

### Top 15 Keywords by Clicks:
${searchConsoleData.summary.topKeywords
  .slice(0, 15)
  .map(
    (k: any) =>
      `- "${k.keyword}" — Position: ${k.position}, Clicks: ${k.clicks}, Impressions: ${k.impressions}, CTR: ${(k.ctr * 100).toFixed(1)}%`
  )
  .join("\n")}

### Tracked Keyword Positions:
${Object.entries(searchConsoleData.trackedPositions)
  .map(([kw, pos]) => `- "${kw}" → ${pos ?? "Not ranking"}`)
  .join("\n")}

### Top Pages by Clicks:
${searchConsoleData.summary.topPages
  .slice(0, 10)
  .map(
    (p: any) =>
      `- ${p.page} — Clicks: ${p.clicks}, Impressions: ${p.impressions}, Position: ${p.position}`
  )
  .join("\n")}`;
  } else if (isSearchConsoleConfigured()) {
    dataBlock += "\n\n## Search Console: Data fetch failed — analyze based on strategy data only.";
  } else {
    dataBlock += "\n\n## Search Console: Not connected yet — recommend they set it up as a top priority.";
  }

  if (pageSpeedData) {
    dataBlock += `

## PageSpeed Insights Data
\`\`\`json
${JSON.stringify(pageSpeedData, null, 2)}
\`\`\``;
  }

  const userPrompt = question
    ? `Based on all the data above, answer this specific question:\n\n${question}`
    : `Based on all the data above, provide a comprehensive AI Visibility analysis:

1. **AI Visibility Summary** — Would AI systems (ChatGPT, Perplexity, Google AIO, Gemini) cite our content? Overall assessment in 2-3 sentences.
2. **Top 3 AI Visibility Actions This Week** — Most impactful actions to increase AI citation potential RIGHT NOW
3. **Citation Readiness Audit** — Which pages are most likely to be cited by AI? Which need restructuring?
4. **Entity Authority Assessment** — How strong is our brand entity in AI knowledge graphs? What to improve?
5. **Content Gaps for AI** — What "answer source" content should we create next? Think: what questions do people ask AI about our services?
6. **E-E-A-T Signals** — Evaluate Experience, Expertise, Authority, and Trust signals (still critical for AI citation trust)
7. **Multi-Engine Optimization** — Are we optimized for ChatGPT, Perplexity, and Gemini, not just Google?
8. **Traditional SEO Health** — Keyword positions, technical issues, and search console data (secondary to AI visibility)
9. **Lead Generation in Zero-Click** — How to capture leads when ~65% of searches get AI answers without clicks

Be specific and actionable. Reference real data. Lead every section with AI-first thinking.`;

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
        messages: [{ role: "user", content: `${dataBlock}\n\n---\n\n${userPrompt}` }],
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

    return NextResponse.json({
      analysis: content,
      dataSources: {
        searchConsole: !!searchConsoleData && !searchConsoleData.error,
        pageSpeed: !!pageSpeedData,
        strategy: true,
        businessContext: true,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to generate analysis: ${err.message}` },
      { status: 500 }
    );
  }
}
