/**
 * AI Citation Intelligence — Automated Citation Checker
 *
 * Validates the core thesis of the AI Visibility Engine:
 * Are AI platforms actually citing our content?
 *
 * Architecture:
 *   1. Build relevant queries from tracked keywords + business context
 *   2. Query Perplexity API (real citations with source attribution)
 *   3. Query OpenAI API (ChatGPT-style responses)
 *   4. Use Claude to simulate Google AIO / Gemini citation patterns
 *   5. Detect brand mentions, URL citations, sentiment
 *   6. Store results as AICitation records linked to a CitationCheckRun
 *   7. Compare against competitor citations
 *
 * Supported platforms:
 *   - Perplexity (real API — sonar model with citations)
 *   - ChatGPT   (real API — gpt-4o via OpenAI)
 *   - Gemini     (simulated via Claude analysis)
 *   - Google AIO (simulated via Claude analysis)
 *   - Copilot    (simulated via Claude analysis)
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite } from "@/lib/business-context";

// ── Types ──

export interface CitationCheckConfig {
  siteId: string;
  platforms?: Platform[];
  maxQueries?: number;           // limit queries per run (default: 20)
  includeCompetitors?: boolean;  // also check competitor brand mentions
}

export type Platform = "perplexity" | "chatgpt" | "gemini" | "google_aio" | "copilot";

export interface PlatformResult {
  platform: Platform;
  query: string;
  brandMentioned: boolean;
  urlCited: string | null;
  context: string | null;        // snippet of response mentioning the brand
  citationType: CitationType | null;
  sentiment: Sentiment | null;
  responseLength: number;
  position: number | null;       // position of brand mention (1 = first)
  competitorMentions: CompetitorMention[];
}

export type CitationType = "direct_quote" | "brand_mention" | "url_citation" | "recommendation";
export type Sentiment = "positive" | "neutral" | "negative";

export interface CompetitorMention {
  competitorId: string;
  domain: string;
  name: string;
  mentioned: boolean;
  urlCited: string | null;
  context: string | null;
}

export interface CheckRunSummary {
  runId: string;
  siteId: string;
  totalQueries: number;
  totalPlatforms: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number;
  platformBreakdown: Record<Platform, { mentions: number; citations: number; total: number }>;
  durationMs: number;
}

// ── Query Generation ──

/**
 * Build a set of search queries that a potential customer might ask AI.
 * Pulls from tracked keywords, business context, and common query patterns.
 */
export async function buildCitationQueries(
  siteId: string,
  maxQueries: number = 20
): Promise<string[]> {
  const queries: string[] = [];

  // 1. Get business context for brand-relevant queries
  let brandName = "SeedTech";
  let location = "Northern New Jersey";
  let primaryService = "managed IT";
  let secondaryServices: string[] = [];

  try {
    const ctx = await getBusinessContextForSite(siteId);
    brandName = ctx.companyName;
    location = ctx.location;
    primaryService = ctx.primaryService;
    secondaryServices = ctx.secondaryServices;
  } catch {
    /* use defaults */
  }

  // 2. Direct brand queries — does AI know about us?
  queries.push(
    `What is ${brandName}?`,
    `Tell me about ${brandName}`,
    `${brandName} reviews`,
    `Is ${brandName} a good company?`,
  );

  // 3. Service + location queries (how local businesses actually ask AI)
  const locationShort = location.split("(")[0]?.trim() || location;
  queries.push(
    `Best ${primaryService} companies in ${locationShort}`,
    `${primaryService} providers near ${locationShort}`,
    `Who provides ${primaryService} in ${locationShort}?`,
    `Top rated ${primaryService} ${locationShort}`,
  );

  // 4. Service-specific queries from secondary services
  for (const svc of secondaryServices.slice(0, 3)) {
    const cleanSvc = svc.split("(")[0]?.trim().toLowerCase() || svc;
    queries.push(`Best ${cleanSvc} for small business in ${locationShort}`);
  }

  // 5. Pull from tracked keywords (high-priority ones)
  const trackedKeywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ tier: "asc" }, { impressions28d: "desc" }],
    take: 10,
    select: { keyword: true },
  });

  for (const tk of trackedKeywords) {
    // Transform keywords into conversational queries
    const kw = tk.keyword;
    if (kw.startsWith("how") || kw.startsWith("what") || kw.startsWith("why")) {
      queries.push(kw);
    } else {
      queries.push(`What is the best ${kw}?`);
    }
  }

  // Deduplicate and limit
  const unique = Array.from(new Set(queries.map((q) => q.toLowerCase()))).map(
    (q) => q.charAt(0).toUpperCase() + q.slice(1)
  );

  return unique.slice(0, maxQueries);
}

// ── Platform Checkers ──

const PERPLEXITY_API_KEY = () => process.env.PERPLEXITY_API_KEY;
const OPENAI_API_KEY = () => process.env.OPENAI_API_KEY;
const CLAUDE_API_KEY = () => process.env.CLAUDE_API_KEY;
const FETCH_TIMEOUT_MS = 30000;

/**
 * Query Perplexity API — the gold standard for citation checking.
 * Perplexity returns structured citations with source URLs.
 */
async function queryPerplexity(
  query: string,
  brandName: string,
  domain: string,
  competitors: { id: string; domain: string; name: string }[]
): Promise<PlatformResult | null> {
  const apiKey = PERPLEXITY_API_KEY();
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a helpful search assistant. Provide detailed, well-sourced answers with specific company recommendations when relevant.",
          },
          { role: "user", content: query },
        ],
        max_tokens: 1024,
        return_citations: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    const citations: string[] = data.citations || [];

    return analyzeResponseForBrand(
      "perplexity",
      query,
      text,
      brandName,
      domain,
      competitors,
      citations
    );
  } catch (e) {
    console.error("Perplexity query failed:", e);
    return null;
  }
}

/**
 * Query OpenAI API (ChatGPT) — checks if ChatGPT mentions the brand.
 * ChatGPT doesn't return structured citations, so we analyze the text.
 */
async function queryChatGPT(
  query: string,
  brandName: string,
  domain: string,
  competitors: { id: string; domain: string; name: string }[]
): Promise<PlatformResult | null> {
  const apiKey = OPENAI_API_KEY();
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. When recommending services or companies, be specific about names and include relevant URLs when you know them.",
          },
          { role: "user", content: query },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || "";

    return analyzeResponseForBrand(
      "chatgpt",
      query,
      text,
      brandName,
      domain,
      competitors
    );
  } catch (e) {
    console.error("ChatGPT query failed:", e);
    return null;
  }
}

/**
 * Simulate Google AIO / Gemini / Copilot responses using Claude.
 * We ask Claude to generate a response AS IF it were that platform,
 * then analyze the response for brand mentions.
 *
 * This is a pragmatic approach — direct API access for Google AIO
 * doesn't exist, and Gemini/Copilot APIs have different patterns.
 */
async function querySimulatedPlatform(
  platform: "gemini" | "google_aio" | "copilot",
  query: string,
  brandName: string,
  domain: string,
  competitors: { id: string; domain: string; name: string }[]
): Promise<PlatformResult | null> {
  const apiKey = CLAUDE_API_KEY();
  if (!apiKey) return null;

  const platformDescriptions: Record<string, string> = {
    gemini: "Google Gemini — tends to cite well-known brands, Google Business profiles, and high-authority domains. Favors structured content with clear entity signals.",
    google_aio: "Google AI Overview (Search Generative Experience) — appears at the top of Google search results. Heavily weights content from high-ranking pages, uses structured data, and tends to cite 3-5 sources per response.",
    copilot: "Microsoft Copilot (Bing Chat) — uses Bing search index, tends to cite recent web pages, Wikipedia-style content, and Microsoft-indexed domains. Includes inline source citations.",
  };

  try {
    const competitorList = competitors.map((c) => `${c.name} (${c.domain})`).join(", ");

    const prompt = `You are simulating how ${platformDescriptions[platform]} would respond to a user query.

Important context:
- Real business: ${brandName} (${domain})
- Competitors in this space: ${competitorList || "various competitors"}
- Respond EXACTLY as this AI platform would, including whether it would naturally mention ${brandName} based on their typical content indexing patterns.
- Be realistic — don't artificially include or exclude ${brandName}. Only mention them if the platform would likely have indexed enough content about them.
- If the brand wouldn't realistically be mentioned, don't mention it.

User query: "${query}"

Respond as the AI platform would. Include source citations in brackets like [Source: domain.com] if the platform typically does that.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error(`Claude API error for ${platform} simulation: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text: string = data.content?.[0]?.text || "";

    return analyzeResponseForBrand(
      platform,
      query,
      text,
      brandName,
      domain,
      competitors
    );
  } catch (e) {
    console.error(`${platform} simulation failed:`, e);
    return null;
  }
}

// ── Response Analysis ──

/**
 * Analyze an AI response for brand mentions, URL citations, and sentiment.
 * This is the core detection logic shared across all platforms.
 */
function analyzeResponseForBrand(
  platform: Platform,
  query: string,
  responseText: string,
  brandName: string,
  domain: string,
  competitors: { id: string; domain: string; name: string }[],
  structuredCitations?: string[]
): PlatformResult {
  const textLower = responseText.toLowerCase();
  const brandLower = brandName.toLowerCase();
  const domainLower = domain.toLowerCase();

  // ── Brand mention detection ──
  // Check for brand name (exact and partial matches)
  const brandRegex = new RegExp(`\\b${escapeRegex(brandName)}\\b`, "gi");
  const brandMatches = responseText.match(brandRegex) || [];
  const brandMentioned = brandMatches.length > 0;

  // ── URL citation detection ──
  // Check response text for our domain
  const urlRegex = new RegExp(
    `https?://(?:www\\.)?${escapeRegex(domainLower)}[^\\s)\\]]*`,
    "gi"
  );
  const urlMatches = responseText.match(urlRegex) || [];

  // Also check structured citations (Perplexity returns these separately)
  let urlFromStructured: string | null = null;
  if (structuredCitations?.length) {
    const ourCitation = structuredCitations.find((c) =>
      c.toLowerCase().includes(domainLower)
    );
    if (ourCitation) urlFromStructured = ourCitation;
  }

  const urlCited = urlMatches[0] || urlFromStructured || null;

  // ── Context extraction ──
  // Get the sentence/paragraph containing the brand mention
  let context: string | null = null;
  let position: number | null = null;

  if (brandMentioned) {
    const brandIndex = textLower.indexOf(brandLower);
    position = 1; // 1-indexed position among all entity mentions

    // Count how many other entities are mentioned before our brand
    const textBeforeBrand = responseText.slice(0, brandIndex);
    const allCompNames = competitors.map((c) => c.name.toLowerCase());
    for (const compName of allCompNames) {
      if (textBeforeBrand.toLowerCase().includes(compName)) {
        position++;
      }
    }

    // Extract surrounding context (up to 300 chars around the mention)
    const start = Math.max(0, brandIndex - 100);
    const end = Math.min(responseText.length, brandIndex + brandName.length + 200);
    context = responseText.slice(start, end).trim();
    if (start > 0) context = "..." + context;
    if (end < responseText.length) context = context + "...";
  } else if (urlCited) {
    // Brand not mentioned by name but URL was cited
    const urlIndex = textLower.indexOf(domainLower);
    const start = Math.max(0, urlIndex - 100);
    const end = Math.min(responseText.length, urlIndex + domain.length + 200);
    context = responseText.slice(start, end).trim();
    if (start > 0) context = "..." + context;
    if (end < responseText.length) context = context + "...";
  }

  // ── Citation type classification ──
  let citationType: CitationType | null = null;
  if (brandMentioned || urlCited) {
    if (urlCited && brandMentioned) {
      citationType = "url_citation";
    } else if (brandMentioned) {
      // Check if it's a recommendation or just a mention
      const recPatterns = /recommend|suggest|top pick|best choice|go with|check out|consider/i;
      const quotePatterns = /according to|says|states|reports|notes/i;

      if (quotePatterns.test(context || "")) {
        citationType = "direct_quote";
      } else if (recPatterns.test(context || "")) {
        citationType = "recommendation";
      } else {
        citationType = "brand_mention";
      }
    } else {
      citationType = "url_citation";
    }
  }

  // ── Sentiment analysis ──
  let sentiment: Sentiment | null = null;
  if (context) {
    const positivePatterns = /excellent|great|reliable|trusted|leading|top|best|recommended|highly rated|quality|professional|reputable/i;
    const negativePatterns = /avoid|poor|unreliable|expensive|overpriced|complaints|issues|problems|worst|disappointing/i;

    if (positivePatterns.test(context)) {
      sentiment = "positive";
    } else if (negativePatterns.test(context)) {
      sentiment = "negative";
    } else {
      sentiment = "neutral";
    }
  }

  // ── Competitor mentions ──
  const competitorMentions: CompetitorMention[] = competitors.map((comp) => {
    const compNameRegex = new RegExp(`\\b${escapeRegex(comp.name)}\\b`, "gi");
    const compDomainRegex = new RegExp(
      `https?://(?:www\\.)?${escapeRegex(comp.domain)}[^\\s)\\]]*`,
      "gi"
    );
    const compMentioned = compNameRegex.test(responseText);
    const compUrlMatches = responseText.match(compDomainRegex);
    const compStructured = structuredCitations?.find((c) =>
      c.toLowerCase().includes(comp.domain.toLowerCase())
    );

    let compContext: string | null = null;
    if (compMentioned) {
      const idx = textLower.indexOf(comp.name.toLowerCase());
      const start = Math.max(0, idx - 80);
      const end = Math.min(responseText.length, idx + comp.name.length + 150);
      compContext = responseText.slice(start, end).trim();
    }

    return {
      competitorId: comp.id,
      domain: comp.domain,
      name: comp.name,
      mentioned: compMentioned,
      urlCited: compUrlMatches?.[0] || compStructured || null,
      context: compContext,
    };
  });

  return {
    platform,
    query,
    brandMentioned: brandMentioned || !!urlCited,
    urlCited,
    context,
    citationType,
    sentiment,
    responseLength: responseText.length,
    position,
    competitorMentions,
  };
}

// ── Orchestration ──

const DEFAULT_PLATFORMS: Platform[] = ["perplexity", "chatgpt", "google_aio", "gemini", "copilot"];

/**
 * Run a full citation check for a site.
 * Creates a CitationCheckRun, queries all platforms, stores results.
 */
export async function runCitationCheck(
  config: CitationCheckConfig
): Promise<CheckRunSummary> {
  const { siteId, includeCompetitors = true } = config;
  const platforms = config.platforms || getAvailablePlatforms();
  const maxQueries = config.maxQueries || 20;
  const startTime = Date.now();

  // Create the check run record
  const run = await prisma.citationCheckRun.create({
    data: {
      siteId,
      status: "running",
      totalPlatforms: platforms.length,
    },
  });

  try {
    // Get business context
    let brandName = "SeedTech";
    let domain = "seedtechllc.com";
    try {
      const ctx = await getBusinessContextForSite(siteId);
      brandName = ctx.companyName;
      domain = ctx.domain;
    } catch {
      // Also try from the site record directly
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        select: { domain: true, name: true },
      });
      if (site) {
        domain = site.domain;
        brandName = site.name;
      }
    }

    // Get competitors if requested
    let competitors: { id: string; domain: string; name: string }[] = [];
    if (includeCompetitors) {
      competitors = await prisma.competitorDomain.findMany({
        where: { siteId, isActive: true },
        select: { id: true, domain: true, name: true },
      });
    }

    // Build queries
    const queries = await buildCitationQueries(siteId, maxQueries);

    // Track results
    const allResults: PlatformResult[] = [];
    let brandMentions = 0;
    let urlCitations = 0;

    // Query each platform with each query (rate-limited)
    for (const query of queries) {
      for (const platform of platforms) {
        const result = await queryPlatform(
          platform,
          query,
          brandName,
          domain,
          competitors
        );
        if (!result) continue;

        allResults.push(result);
        if (result.brandMentioned) brandMentions++;
        if (result.urlCited) urlCitations++;

        // Store the citation record
        await prisma.aICitation.create({
          data: {
            siteId,
            checkRunId: run.id,
            platform: result.platform,
            query: result.query,
            brandMentioned: result.brandMentioned,
            urlCited: result.urlCited,
            context: result.context,
            citationType: result.citationType,
            sentiment: result.sentiment,
            responseLength: result.responseLength,
            position: result.position,
            metadata: result.competitorMentions.length > 0
              ? JSON.parse(JSON.stringify({ competitorMentions: result.competitorMentions }))
              : undefined,
          },
        });

        // Also store competitor citation records (if they were mentioned)
        for (const comp of result.competitorMentions) {
          if (comp.mentioned || comp.urlCited) {
            await prisma.aICitation.create({
              data: {
                siteId,
                checkRunId: run.id,
                platform: result.platform,
                query: result.query,
                brandMentioned: comp.mentioned,
                urlCited: comp.urlCited,
                context: comp.context,
                competitorId: comp.competitorId,
                responseLength: result.responseLength,
                sentiment: null,
                citationType: comp.urlCited ? "url_citation" : "brand_mention",
              },
            });
          }
        }

        // Rate limiting — small delay between platform calls
        await sleep(500);
      }

      // Slightly longer delay between queries
      await sleep(300);
    }

    // Calculate final stats
    const totalChecks = allResults.length;
    const mentionRate = totalChecks > 0 ? brandMentions / totalChecks : 0;
    const durationMs = Date.now() - startTime;

    // Update the check run
    await prisma.citationCheckRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        totalQueries: queries.length,
        totalPlatforms: platforms.length,
        brandMentions,
        urlCitations,
        mentionRate,
        completedAt: new Date(),
        durationMs,
      },
    });

    // Build platform breakdown
    const platformBreakdown = buildPlatformBreakdown(allResults, platforms);

    return {
      runId: run.id,
      siteId,
      totalQueries: queries.length,
      totalPlatforms: platforms.length,
      brandMentions,
      urlCitations,
      mentionRate,
      platformBreakdown,
      durationMs,
    };
  } catch (e) {
    // Mark run as failed
    const durationMs = Date.now() - startTime;
    await prisma.citationCheckRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        completedAt: new Date(),
        durationMs,
        errorMessage: e instanceof Error ? e.message : String(e),
      },
    });
    throw e;
  }
}

/**
 * Route a query to the appropriate platform checker.
 */
async function queryPlatform(
  platform: Platform,
  query: string,
  brandName: string,
  domain: string,
  competitors: { id: string; domain: string; name: string }[]
): Promise<PlatformResult | null> {
  switch (platform) {
    case "perplexity":
      return queryPerplexity(query, brandName, domain, competitors);
    case "chatgpt":
      return queryChatGPT(query, brandName, domain, competitors);
    case "gemini":
    case "google_aio":
    case "copilot":
      return querySimulatedPlatform(platform, query, brandName, domain, competitors);
    default:
      return null;
  }
}

/**
 * Determine which platforms we can actually query based on available API keys.
 */
function getAvailablePlatforms(): Platform[] {
  const platforms: Platform[] = [];

  if (PERPLEXITY_API_KEY()) platforms.push("perplexity");
  if (OPENAI_API_KEY()) platforms.push("chatgpt");
  if (CLAUDE_API_KEY()) {
    // Claude-simulated platforms
    platforms.push("google_aio", "gemini", "copilot");
  }

  // If no API keys at all, return all (they'll fail gracefully)
  if (platforms.length === 0) return DEFAULT_PLATFORMS;

  return platforms;
}

/**
 * Run a quick single-query check (useful for testing or spot checks).
 */
export async function checkSingleQuery(
  siteId: string,
  query: string,
  platform: Platform
): Promise<PlatformResult | null> {
  let brandName = "SeedTech";
  let domain = "seedtechllc.com";

  try {
    const ctx = await getBusinessContextForSite(siteId);
    brandName = ctx.companyName;
    domain = ctx.domain;
  } catch {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { domain: true, name: true },
    });
    if (site) {
      domain = site.domain;
      brandName = site.name;
    }
  }

  const competitors = await prisma.competitorDomain.findMany({
    where: { siteId, isActive: true },
    select: { id: true, domain: true, name: true },
  });

  return queryPlatform(platform, query, brandName, domain, competitors);
}

/**
 * Get the latest check run for a site.
 */
export async function getLatestCheckRun(siteId: string) {
  return prisma.citationCheckRun.findFirst({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    include: {
      citations: {
        where: { competitorId: null }, // only our citations, not competitor records
        orderBy: { checkedAt: "desc" },
      },
    },
  });
}

/**
 * Get all check runs for a site (with summary stats).
 */
export async function getCheckRunHistory(siteId: string, limit: number = 20) {
  return prisma.citationCheckRun.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      totalQueries: true,
      totalPlatforms: true,
      brandMentions: true,
      urlCitations: true,
      mentionRate: true,
      durationMs: true,
      startedAt: true,
      completedAt: true,
      createdAt: true,
    },
  });
}

// ── Helpers ──

function buildPlatformBreakdown(
  results: PlatformResult[],
  platforms: Platform[]
): Record<Platform, { mentions: number; citations: number; total: number }> {
  const breakdown: Record<string, { mentions: number; citations: number; total: number }> = {};

  for (const p of platforms) {
    breakdown[p] = { mentions: 0, citations: 0, total: 0 };
  }

  for (const r of results) {
    if (!breakdown[r.platform]) {
      breakdown[r.platform] = { mentions: 0, citations: 0, total: 0 };
    }
    breakdown[r.platform].total++;
    if (r.brandMentioned) breakdown[r.platform].mentions++;
    if (r.urlCited) breakdown[r.platform].citations++;
  }

  return breakdown as Record<Platform, { mentions: number; citations: number; total: number }>;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
