import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { buildStrategyPrompt, getBusinessContextForSite } from "@/lib/business-context";
import {
  isSearchConsoleConfigured,
  getSearchConsoleSummary,
  getTrackedKeywordPositions,
} from "@/lib/google-search-console";
import { getTrackedKeywords, getTrackedKeywordStrings, getSearchConsoleIntegration } from "@/lib/site-data";
import { getAIOAdvisorContext } from "@/lib/seo-aio";
import { getAIVisibilityAdvisorContext } from "@/lib/ai-visibility";

type SearchConsoleKeywordRow = {
  keyword: string;
  position: number;
  clicks: number;
  impressions: number;
  ctr: number;
};

type SearchConsolePageRow = {
  page: string;
  clicks: number;
  impressions: number;
  position: number;
};

type SearchConsolePayload = {
  summary: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    topKeywords: SearchConsoleKeywordRow[];
    topPages: SearchConsolePageRow[];
  };
  trackedPositions: Record<string, number | null>;
};

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
 * Analyzes real data (Search Console, PageSpeed, strategy) with Claude
 * to produce actionable SEO recommendations.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

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

  // Build context from site-specific business profile
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessContext = buildStrategyPrompt(businessCtx);

  // Strategy data from DB (site-scoped)
  const dbKeywords = await getTrackedKeywords(siteId);
  const strategyData = {
    trackedKeywords: dbKeywords.map((k) => ({
      keyword: k.keyword,
      tier: k.tier,
      volume: k.volume,
      competition: k.competition,
      intent: k.intent,
      targetPage: k.targetPage,
    })),
    tasks: [] as { title: string; phase: number; status: string; priority: string }[],
    contentCalendar: [] as { title: string; keyword: string; status: string }[],
  };

  // Real Search Console data (site-scoped integration)
  let searchConsoleData: Record<string, unknown> | null = null;
  const gscIntegration = await getSearchConsoleIntegration(siteId);
  if (includeSearchConsole && isSearchConsoleConfigured(gscIntegration)) {
    try {
      const kwStrings = await getTrackedKeywordStrings(siteId);
      const [summary, positions] = await Promise.all([
        getSearchConsoleSummary(28, gscIntegration),
        getTrackedKeywordPositions(kwStrings, 28, gscIntegration),
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
    const sc = searchConsoleData as SearchConsolePayload;
    dataBlock += `

## Live Search Console Data (last 28 days)
Total Clicks: ${sc.summary.totalClicks}
Total Impressions: ${sc.summary.totalImpressions}
Average CTR: ${(sc.summary.avgCtr * 100).toFixed(1)}%
Average Position: ${sc.summary.avgPosition}

### Top 15 Keywords by Clicks:
${sc.summary.topKeywords
  .slice(0, 15)
  .map(
    (k) =>
      `- "${k.keyword}" — Position: ${k.position}, Clicks: ${k.clicks}, Impressions: ${k.impressions}, CTR: ${(k.ctr * 100).toFixed(1)}%`
  )
  .join("\n")}

### Tracked Keyword Positions:
${Object.entries(sc.trackedPositions)
  .map(([kw, pos]) => `- "${kw}" → ${pos ?? "Not ranking"}`)
  .join("\n")}

### Top Pages by Clicks:
${sc.summary.topPages
  .slice(0, 10)
  .map(
    (p) =>
      `- ${p.page} — Clicks: ${p.clicks}, Impressions: ${p.impressions}, Position: ${p.position}`
  )
  .join("\n")}`;
  } else if (gscIntegration) {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate analysis: ${message}` },
      { status: 500 }
    );
  }
}
