/**
 * /api/admin/seo/keywords/research
 *
 * POST — AI-powered keyword research agent.
 * Uses business context, existing keywords, GSC data, and page contexts
 * to identify keyword opportunities, gaps, and strategic recommendations.
 *
 * Streams results via SSE for real-time feedback.
 *
 * Body: {
 *   mode: "discover" | "gaps" | "competitors" | "questions" | "full-audit",
 *   focusArea?: string,       — Optional focus (e.g., "cybersecurity", specific page)
 *   includeGsc?: boolean,     — Pull live GSC data (default true)
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import {
  getBusinessContextForSite,
  buildStrategyPrompt,
} from "@/lib/business-context";
import {
  isSearchConsoleConfigured,
  getSearchConsoleSummary,
  getKeywordPerformance,
} from "@/lib/google-search-console";
import {
  getTrackedKeywords,
  getSearchConsoleIntegration,
} from "@/lib/site-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 2000;

async function callClaudeStreaming(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
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
          stream: true,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, Math.min(delay, 30000)));
        continue;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `Claude API error ${response.status}: ${err.error?.message || response.statusText}`,
        );
      }

      return response;
    } catch (err) {
      lastError = err as Error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) =>
          setTimeout(r, RETRY_BASE_DELAY * Math.pow(2, attempt)),
        );
      }
    }
  }

  throw lastError || new Error("Failed after retries");
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const {
    mode = "full-audit",
    focusArea,
    includeGsc = true,
  } = body;

  // ── 1. Gather all context ──

  // Business context
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  // Existing tracked keywords
  const existingKeywords = await getTrackedKeywords(siteId);
  const existingKwBlock = existingKeywords.length > 0
    ? existingKeywords.map((k) => {
        const parts = [`"${k.keyword}" (${k.tier})`];
        if (k.intent) parts.push(`intent: ${k.intent}`);
        if (k.volume && k.volume !== "unknown") parts.push(`vol: ${k.volume}`);
        if (k.currentPosition) parts.push(`pos: ${k.currentPosition}`);
        if (k.targetPage && k.targetPage !== "/") parts.push(`target: ${k.targetPage}`);
        return `• ${parts.join(" | ")}`;
      }).join("\n")
    : "No keywords tracked yet.";

  // Page contexts
  let pageContextBlock = "";
  try {
    const pageContexts = await prisma.pageContext.findMany({
      where: { siteId },
      select: { path: true, description: true, keywords: true, pageType: true },
      orderBy: { path: "asc" },
    });
    if (pageContexts.length > 0) {
      pageContextBlock = pageContexts
        .map((p) => `• ${p.path} (${p.pageType}): ${p.description?.slice(0, 200) || "No description"}${p.keywords.length > 0 ? ` | keywords: ${p.keywords.join(", ")}` : ""}`)
        .join("\n");
    }
  } catch { /* skip */ }

  // GSC data
  let gscBlock = "";
  if (includeGsc) {
    try {
      const gscIntegration = await getSearchConsoleIntegration(siteId);
      if (isSearchConsoleConfigured(gscIntegration)) {
        const [summary, fullKeywords] = await Promise.all([
          getSearchConsoleSummary(28, gscIntegration),
          getKeywordPerformance(28, 200, gscIntegration),
        ]);

        gscBlock = `## Live Search Console Data (last 28 days)
Total Clicks: ${summary.totalClicks}
Total Impressions: ${summary.totalImpressions}
Average CTR: ${(summary.avgCtr * 100).toFixed(1)}%
Average Position: ${summary.avgPosition}

### All Keywords People Are Actually Searching (top 200 by clicks):
${fullKeywords.map((k) => `• "${k.keyword}" — pos: ${k.position}, clicks: ${k.clicks}, impressions: ${k.impressions}, CTR: ${(k.ctr * 100).toFixed(1)}%`).join("\n")}

### Top Pages by Clicks:
${summary.topPages.map((p) => `• ${p.page} — clicks: ${p.clicks}, impressions: ${p.impressions}, pos: ${p.position}`).join("\n")}`;
      } else {
        gscBlock = "## Search Console: Not connected — analyze based on industry knowledge and business context only.";
      }
    } catch {
      gscBlock = "## Search Console: Failed to fetch data — proceed with analysis based on business context.";
    }
  }

  // ── 2. Build prompts per mode ──

  const systemPrompt = `You are an elite SEO keyword strategist and research analyst. You have deep expertise in:
- Keyword research methodology and search intent classification
- Local SEO keyword patterns for service businesses
- Long-tail keyword discovery and question-based queries
- Competitive gap analysis
- Topic cluster architecture
- Search volume estimation and difficulty assessment
- AI Overview / AI-generated answer optimization
- Google Search Console data interpretation

You are analyzing keyword opportunities for: ${businessPrompt}

CRITICAL RULES:
1. Every keyword suggestion MUST include: the keyword itself, a tier recommendation (tier1/tier2/tier3), search intent (transactional/commercial/informational/navigational), a target page recommendation, estimated volume range, and competition level.
2. Be SPECIFIC to this business — no generic marketing keywords. Think about what real customers in their service area would search.
3. Prioritize keywords that signal buying intent or active problem-solving.
4. Consider the local market (${businessCtx.location || "their service area"}) for local SEO keywords.
5. Identify gaps between what they currently target and what they SHOULD target.
6. Format your response with clear sections using Markdown.
7. When suggesting keywords, format each one like this for easy parsing:

**KEYWORD_SUGGESTION:** {"keyword": "example keyword", "tier": "tier1", "intent": "commercial", "targetPage": "/services/example", "volume": "high", "competition": "medium", "rationale": "Why this keyword matters"}

This special format allows the UI to parse and import suggestions directly. Use it for EVERY keyword you recommend.`;

  let userPrompt = "";

  const dataContext = `## Currently Tracked Keywords (${existingKeywords.length} total):
${existingKwBlock}

${pageContextBlock ? `## Site Pages & Their Context:\n${pageContextBlock}` : ""}

${gscBlock}`;

  switch (mode) {
    case "discover":
      userPrompt = `${dataContext}

---

## Task: Keyword Discovery

${focusArea ? `FOCUS AREA: ${focusArea}\n\n` : ""}Discover NEW keyword opportunities this business should be targeting but isn't. Analyze:

1. **Quick Wins** (5-10 keywords) — Keywords they're already ranking for in positions 5-20 that could be pushed to page 1 with focused effort. Use GSC data if available.

2. **Missing Service Keywords** (10-15 keywords) — Based on their business profile, what service-related keywords are they NOT tracking that they absolutely should be?

3. **Local Intent Keywords** (5-10 keywords) — Location-specific queries people search when looking for these services in their area.

4. **Question-Based Keywords** (5-10 keywords) — "How to", "What is", "Why does" queries that their target audience asks. Great for blog content and AI answer optimization.

5. **Long-Tail Opportunities** (10-15 keywords) — Specific, lower-competition phrases with high conversion potential.

For each keyword, explain WHY it's an opportunity and which page should target it.`;
      break;

    case "gaps":
      userPrompt = `${dataContext}

---

## Task: Keyword Gap Analysis

${focusArea ? `FOCUS AREA: ${focusArea}\n\n` : ""}Analyze the GAP between what this business currently targets and what they should target:

1. **Critical Missing Keywords** — High-value keywords competitors in this space definitely target that are completely absent from their strategy.

2. **Undertargeted Keywords** — Keywords they track but aren't properly assigned to pages, or pages that lack keyword targeting entirely.

3. **Cannibalization Risks** — Are multiple pages competing for the same keywords? Identify conflicts and suggest resolution.

4. **Intent Mismatches** — Keywords assigned to pages where the page intent doesn't match the keyword intent.

5. **Page-Level Gaps** — For each major page on the site, identify if it has proper keyword coverage or needs more.

6. **Funnel Coverage** — Map keywords across the buyer journey (awareness → consideration → decision). Where are the gaps?

Provide specific, actionable keyword additions with page assignments.`;
      break;

    case "competitors":
      userPrompt = `${dataContext}

---

## Task: Competitive Keyword Intelligence

${focusArea ? `FOCUS AREA: ${focusArea}\n\n` : ""}Based on this business profile (${businessCtx.primaryService || "IT services"} in ${businessCtx.location || "their area"}), analyze what competitors likely target:

1. **Competitor Keyword Landscape** — What keywords would the top 5 competitors in this space be targeting? Map out the competitive keyword landscape.

2. **Differentiator Keywords** — Keywords that could help this business stand out from competitors (unique selling points, niche services, specific expertise).

3. **Keywords to Steal** — High-value keywords competitors rank for that this business should actively pursue.

4. **Keywords to Avoid** — Overly competitive keywords where effort would be wasted. Suggest alternatives.

5. **Blue Ocean Keywords** — Untapped keyword territories where competition is low but relevance is high.

Base your analysis on industry knowledge of the ${businessCtx.primaryService || "IT services"} competitive landscape.`;
      break;

    case "questions":
      userPrompt = `${dataContext}

---

## Task: Question & Search Query Research

${focusArea ? `FOCUS AREA: ${focusArea}\n\n` : ""}Identify the actual questions people ask that relate to this business's services:

1. **Pre-Purchase Questions** (10-15) — What do potential customers search before buying these services? ("how much does managed IT cost", "what to look for in an IT provider")

2. **Problem-Based Searches** (10-15) — What problems drive people to search? ("my business keeps getting hacked", "email server down", "computer network slow")

3. **Comparison Queries** (5-10) — "X vs Y" searches, "best [service] in [location]", "alternatives to [competitor]"

4. **"People Also Ask" Predictions** (10-15) — Questions likely to appear in Google's PAA boxes for their target keywords.

5. **AI Overview Optimization** (5-10) — Questions where a well-structured answer could get featured in Google's AI Overviews or cited by ChatGPT/Perplexity.

For each question, suggest whether it should be a blog post, FAQ section, or worked into an existing service page.`;
      break;

    case "full-audit":
    default:
      userPrompt = `${dataContext}

---

## Task: Comprehensive Keyword Strategy Audit

${focusArea ? `FOCUS AREA: ${focusArea}\n\n` : ""}Perform a complete keyword strategy audit covering:

1. **Current Strategy Assessment** — Grade the existing keyword strategy (A-F). What's working? What's not? Are keywords properly tiered and assigned?

2. **Top 10 Priority Keywords to Add** — The most impactful keywords missing from their strategy RIGHT NOW. These should be immediate additions.

3. **Quick Wins from GSC** — Keywords already ranking in positions 5-20 that need a push. (Analyze GSC data if available.)

4. **Page-Keyword Coverage Map** — For each major page, assess keyword coverage and suggest additions.

5. **Content Gap Keywords** — Keywords that need NEW content (blog posts, landing pages) to properly target.

6. **Local SEO Keywords** — Location-based keyword opportunities.

7. **Trending & Emerging Keywords** — Keywords growing in importance in this industry (AI, cybersecurity trends, etc.)

8. **Keyword Cleanup** — Keywords to remove, re-tier, or reassign.

9. **Cluster Opportunities** — Topic clusters that could be built around core keywords.

10. **90-Day Keyword Roadmap** — Prioritized plan: what to add first, what to optimize, what to create content for.

Be thorough, specific, and actionable.`;
      break;
  }

  // ── 3. Stream the response ──

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      };

      send({
        type: "start",
        mode,
        dataSources: {
          businessContext: true,
          existingKeywords: existingKeywords.length,
          pageContexts: pageContextBlock ? true : false,
          gsc: gscBlock && !gscBlock.includes("Not connected") && !gscBlock.includes("Failed"),
        },
      });

      try {
        const response = await callClaudeStreaming(
          apiKey,
          systemPrompt,
          userPrompt,
        );

        if (!response.body) {
          send({ type: "error", error: "No response body from Claude" });
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const evt = JSON.parse(data);

              if (evt.type === "content_block_delta" && evt.delta?.text) {
                fullText += evt.delta.text;
                chunkCount++;

                // Send text chunks every few events to reduce SSE noise
                if (chunkCount % 3 === 0 || evt.delta.text.includes("\n")) {
                  send({ type: "text", content: fullText });
                }
              }

              if (evt.type === "message_stop") {
                // Final text
                send({ type: "text", content: fullText });

                // Parse keyword suggestions from the response
                const suggestions = parseKeywordSuggestions(fullText);
                send({
                  type: "done",
                  suggestions,
                  totalSuggestions: suggestions.length,
                  fullText,
                });
              }
            } catch {
              /* skip malformed SSE chunk */
            }
          }
        }
      } catch (err) {
        send({
          type: "error",
          error: err instanceof Error ? err.message : "Research failed",
        });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/* ── Parse KEYWORD_SUGGESTION blocks from Claude's response ── */

interface KeywordSuggestion {
  keyword: string;
  tier: string;
  intent: string;
  targetPage: string;
  volume: string;
  competition: string;
  rationale: string;
}

function parseKeywordSuggestions(text: string): KeywordSuggestion[] {
  const suggestions: KeywordSuggestion[] = [];
  const regex = /\*\*KEYWORD_SUGGESTION:\*\*\s*(\{[^}]+\})/g;
  const matches = Array.from(text.matchAll(regex));

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.keyword) {
        suggestions.push({
          keyword: parsed.keyword,
          tier: parsed.tier || "tier2",
          intent: parsed.intent || "informational",
          targetPage: parsed.targetPage || "/",
          volume: parsed.volume || "unknown",
          competition: parsed.competition || "medium",
          rationale: parsed.rationale || "",
        });
      }
    } catch {
      /* skip malformed JSON */
    }
  }

  return suggestions;
}
