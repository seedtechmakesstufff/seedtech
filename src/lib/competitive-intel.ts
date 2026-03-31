/* ── Competitive Intelligence Engine ──
 *
 * Analyzes competitor pages for AI Visibility, content structure, and gaps.
 * Uses the existing crawl + scoring infrastructure to evaluate competitor content
 * and identify opportunities where our site can win.
 *
 * Architecture:
 *   1. Fetch competitor page HTML (using existing crawler fetch logic)
 *   2. Score with AI Visibility + E-E-A-T engines
 *   3. Extract topics, structure signals, word count
 *   4. Store as CompetitorAnalysis records
 *   5. Compare against our own scores to find gaps
 */

import { JSDOM } from "jsdom";
import { prisma } from "@/lib/prisma";
import { scoreAIVisibility } from "@/lib/ai-visibility";
import { auditEEAT } from "@/lib/seo-eeat";
import { loadSiteScoringConfig } from "@/lib/site-scoring-config";
import type { SiteScoringConfig } from "@/lib/site-scoring-config";
import { computeSimilarityMatrix } from "@/lib/semantic-embeddings";

/* ── Optional Playwright (headless browser fallback) ── */

let playwrightAvailable = false;
let chromium: typeof import("playwright-core").chromium | null = null;

try {
  // Dynamic import so the module still works when playwright isn't installed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pw = require("playwright-core");
  chromium = pw.chromium;
  playwrightAvailable = true;
} catch {
  // Playwright not available — fetch-only mode
}

/* ── Types ── */

export interface CompetitorPageResult {
  pageUrl: string;
  pageTitle: string;
  wordCount: number;
  aiVisScore: number;
  eeatScore: number;
  topicsDetected: string[];
  hasSchema: boolean;
  hasFaq: boolean;
}

export interface CompetitorGap {
  topic: string;
  competitorUrl: string;
  competitorScore: number;
  ourScore: number | null; // null = we don't have content for this
  gapType: "missing" | "weaker" | "stronger";
  opportunity: string;
}

export interface CompetitorOverview {
  competitorId: string;
  domain: string;
  name: string;
  pagesAnalyzed: number;
  avgAiVisScore: number;
  avgEeatScore: number;
  topTopics: string[];
  lastAnalyzed: Date | null;
}

/* ── Page Fetching & Analysis ── */

const USER_AGENT = "Mozilla/5.0 (compatible; SEO-Bot/1.0)";
const BROWSER_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const FETCH_TIMEOUT_MS = 15000;
const HEADLESS_TIMEOUT_MS = 30000;

/**
 * Fetch HTML using a headless browser (Playwright).
 * Used as fallback when plain fetch fails (403, JS-rendered content, bot detection).
 */
async function fetchWithHeadless(url: string): Promise<string | null> {
  if (!playwrightAvailable || !chromium) return null;

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const context = await browser.newContext({
      userAgent: BROWSER_USER_AGENT,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    // Block heavy resources to speed up loading
    await page.route("**/*.{png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf,eot}", (route) =>
      route.abort()
    );
    await page.route("**/{analytics,gtm,tracking,ads,pixel}*", (route) =>
      route.abort()
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: HEADLESS_TIMEOUT_MS,
    });

    // Wait briefly for JS-rendered content
    await page.waitForTimeout(2000);

    const html = await page.content();
    await browser.close();
    return html;
  } catch (err) {
    console.warn(`[competitive-intel] Headless fetch failed for ${url}:`, err instanceof Error ? err.message : err);
    if (browser) await browser.close().catch(() => {});
    return null;
  }
}

/**
 * Fetch page HTML — tries plain fetch first, falls back to headless browser.
 */
async function fetchPageHtml(url: string): Promise<string | null> {
  // ── Attempt 1: Plain fetch ──
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (response.ok) {
      const html = await response.text();
      // Check if the page is JS-rendered (very little content in initial HTML)
      const textLength = html.replace(/<[^>]*>/g, "").trim().length;
      if (textLength > 500) {
        return html; // Has enough content — no need for headless
      }
      // Might be JS-rendered — fall through to headless
      console.log(`[competitive-intel] ${url} appears JS-rendered (${textLength} chars), trying headless`);
    } else if (response.status === 403 || response.status === 429) {
      // Bot detection — try headless
      console.log(`[competitive-intel] ${url} returned ${response.status}, trying headless`);
    } else {
      return null; // 4xx/5xx that headless won't fix
    }
  } catch {
    // Network error or timeout — try headless
    console.log(`[competitive-intel] Plain fetch failed for ${url}, trying headless`);
  }

  // ── Attempt 2: Headless browser ──
  return fetchWithHeadless(url);
}

/**
 * Fetch and analyze a single competitor page.
 */
async function analyzeCompetitorPage(
  url: string,
  siteConfig?: SiteScoringConfig
): Promise<CompetitorPageResult | null> {
  try {
    const html = await fetchPageHtml(url);
    if (!html) return null;
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // Extract page title
    const pageTitle = doc.querySelector("title")?.textContent?.trim() || "";

    // Extract main content text for analysis
    const mainEl = doc.querySelector("main, article, [role='main'], .content, #content");
    const bodyText = (mainEl || doc.querySelector("body"))?.textContent || "";
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

    // Extract markdown-like content for AI Visibility scoring
    // Simplified: use heading + paragraph structure
    const markdown = extractMarkdown(doc);

    // Score with AI Visibility
    const aiVis = scoreAIVisibility(markdown, undefined, undefined, siteConfig);

    // Score with E-E-A-T
    const eeat = auditEEAT(url, dom, siteConfig);

    // Detect topics from headings
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3"))
      .map((h) => h.textContent?.trim() || "")
      .filter(Boolean);
    const topicsDetected = headings.slice(0, 10);

    // Check for schema markup
    const hasSchema = !!doc.querySelector('script[type="application/ld+json"]');

    // Check for FAQ
    const hasFaq = /faq|frequently asked/i.test(
      headings.join(" ") + (doc.querySelector('[itemtype*="FAQPage"]') ? " faq" : "")
    );

    return {
      pageUrl: url,
      pageTitle,
      wordCount,
      aiVisScore: aiVis.overall,
      eeatScore: eeat.overall,
      topicsDetected,
      hasSchema,
      hasFaq,
    };
  } catch {
    return null;
  }
}

/**
 * Extract a simplified markdown representation from a DOM document.
 * Used for scoring competitor pages with our AI Visibility engine.
 */
function extractMarkdown(doc: Document): string {
  const lines: string[] = [];
  const main = doc.querySelector("main, article, [role='main']") || doc.querySelector("body");
  if (!main) return "";

  const elements = main.querySelectorAll("h1, h2, h3, h4, p, li, table, blockquote");
  for (const el of Array.from(elements)) {
    const text = el.textContent?.trim() || "";
    if (!text) continue;

    const tag = el.tagName.toLowerCase();
    if (tag === "h1") lines.push(`# ${text}`);
    else if (tag === "h2") lines.push(`\n## ${text}`);
    else if (tag === "h3") lines.push(`\n### ${text}`);
    else if (tag === "h4") lines.push(`\n#### ${text}`);
    else if (tag === "li") lines.push(`- ${text}`);
    else if (tag === "blockquote") lines.push(`> ${text}`);
    else if (tag === "table") {
      // Simplified table extraction
      const rows = el.querySelectorAll("tr");
      for (const row of Array.from(rows)) {
        const cells = Array.from(row.querySelectorAll("th, td"))
          .map((c) => c.textContent?.trim() || "");
        lines.push(`| ${cells.join(" | ")} |`);
      }
    } else {
      lines.push(text);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/* ── Competitor Analysis Runner ── */

/**
 * Analyze a competitor's key pages. Discovers pages from sitemap or manual URLs.
 * Stores results as CompetitorAnalysis records.
 */
export async function analyzeCompetitor(
  siteId: string,
  competitorId: string,
  urls?: string[]
): Promise<{ pagesAnalyzed: number; avgScore: number }> {
  const competitor = await prisma.competitorDomain.findUnique({
    where: { id: competitorId },
  });
  if (!competitor) throw new Error("Competitor not found");

  let siteConfig: SiteScoringConfig | undefined;
  try {
    siteConfig = await loadSiteScoringConfig(siteId);
  } catch { /* use defaults */ }

  // If no URLs provided, try to discover from sitemap
  const pagesToAnalyze = urls || (await discoverCompetitorPages(competitor.domain, 20));

  const results: CompetitorPageResult[] = [];
  for (const url of pagesToAnalyze) {
    const result = await analyzeCompetitorPage(url, siteConfig);
    if (result) {
      results.push(result);

      // Store in DB
      await prisma.competitorAnalysis.create({
        data: {
          siteId,
          competitorId,
          pageUrl: result.pageUrl,
          pageTitle: result.pageTitle,
          wordCount: result.wordCount,
          aiVisScore: result.aiVisScore,
          eeatScore: result.eeatScore,
          topicsDetected: result.topicsDetected,
          hasSchema: result.hasSchema,
          hasFaq: result.hasFaq,
        },
      });
    }

    // Rate limit: 1 req per 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Update competitor domain stats
  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.aiVisScore, 0) / results.length)
    : 0;

  await prisma.competitorDomain.update({
    where: { id: competitorId },
    data: { lastAnalyzed: new Date() },
  });

  return { pagesAnalyzed: results.length, avgScore };
}

/**
 * Discover competitor pages from their sitemap.
 * Falls back to homepage if sitemap isn't available.
 */
async function discoverCompetitorPages(domain: string, maxPages: number = 20): Promise<string[]> {
  const urls: string[] = [];
  const baseUrl = `https://${domain}`;

  try {
    // Try sitemap
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const response = await fetch(sitemapUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const xml = await response.text();
      const locMatches = xml.match(/<loc>([^<]+)<\/loc>/gi) || [];
      for (const match of locMatches.slice(0, maxPages)) {
        const url = match.replace(/<\/?loc>/gi, "");
        // Only include HTML pages, skip images/pdfs
        if (!url.match(/\.(jpg|png|gif|pdf|xml|txt|css|js)$/i)) {
          urls.push(url);
        }
      }
    }
  } catch { /* sitemap not available */ }

  // Always include homepage
  if (!urls.includes(baseUrl) && !urls.includes(`${baseUrl}/`)) {
    urls.unshift(baseUrl);
  }

  return urls.slice(0, maxPages);
}

/* ── Gap Analysis ── */

/**
 * Compare competitor analyses against our own content scores
 * to identify content gaps and opportunities.
 */
export async function findContentGaps(siteId: string): Promise<CompetitorGap[]> {
  // Get our content scores
  const ourScores = await prisma.aIVisibilityScore.findMany({
    where: { siteId },
    orderBy: { scoredAt: "desc" },
    distinct: ["pageUrl"],
  });

  // Get all competitor analyses
  const competitorResults = await prisma.competitorAnalysis.findMany({
    where: { siteId },
    include: { competitor: { select: { domain: true } } },
    orderBy: { analyzedAt: "desc" },
  });

  const gaps: CompetitorGap[] = [];

  // Build a map of our topics (from page URLs / titles)
  const ourScoreMap = new Map(ourScores.map((s) => [s.pageUrl, s.overallScore]));

  // For each competitor page, check if we have comparable content
  for (const compResult of competitorResults) {
    for (const topic of compResult.topicsDetected) {
      const normalizedTopic = topic.toLowerCase();

      // Check if any of our pages cover this topic
      let bestOurScore: number | null = null;
      for (const [pageUrl, score] of Array.from(ourScoreMap.entries()) as [string, number][]) {
        if (pageUrl.toLowerCase().includes(normalizedTopic.replace(/\s+/g, "-").slice(0, 20))) {
          bestOurScore = Math.max(bestOurScore || 0, score);
        }
      }

      if (bestOurScore === null) {
        gaps.push({
          topic,
          competitorUrl: compResult.pageUrl,
          competitorScore: compResult.aiVisScore,
          ourScore: null,
          gapType: "missing",
          opportunity: `Competitor covers "${topic}" (score: ${compResult.aiVisScore}) — we have no content on this topic`,
        });
      } else if (compResult.aiVisScore > bestOurScore + 10) {
        gaps.push({
          topic,
          competitorUrl: compResult.pageUrl,
          competitorScore: compResult.aiVisScore,
          ourScore: bestOurScore,
          gapType: "weaker",
          opportunity: `Competitor scores ${compResult.aiVisScore} vs our ${bestOurScore} on "${topic}" — opportunity to improve`,
        });
      }
    }
  }

  // Deduplicate by topic
  const seen = new Set<string>();
  return gaps.filter((g) => {
    const key = g.topic.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => {
    // Missing topics first, then by competitor score desc
    if (a.gapType !== b.gapType) return a.gapType === "missing" ? -1 : 1;
    return b.competitorScore - a.competitorScore;
  }).slice(0, 50);
}

/**
 * Get overview stats for all competitors of a site.
 */
export async function getCompetitorOverviews(siteId: string): Promise<CompetitorOverview[]> {
  const competitors = await prisma.competitorDomain.findMany({
    where: { siteId, isActive: true },
    include: {
      compAnalyses: {
        orderBy: { analyzedAt: "desc" },
        take: 50,
      },
    },
  });

  return competitors.map((c) => {
    const analyses = c.compAnalyses;
    const avgAiVis = analyses.length
      ? Math.round(analyses.reduce((sum, a) => sum + a.aiVisScore, 0) / analyses.length)
      : 0;
    const avgEeat = analyses.length
      ? Math.round(analyses.reduce((sum, a) => sum + a.eeatScore, 0) / analyses.length)
      : 0;

    // Collect all topics
    const topicCounts = new Map<string, number>();
    for (const a of analyses) {
      for (const t of a.topicsDetected) {
        topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
      }
    }
    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);

    return {
      competitorId: c.id,
      domain: c.domain,
      name: c.name,
      pagesAnalyzed: analyses.length,
      avgAiVisScore: avgAiVis,
      avgEeatScore: avgEeat,
      topTopics,
      lastAnalyzed: c.lastAnalyzed,
    };
  });
}

/* ── Keyword Gap Analysis ── */

export interface KeywordGap {
  keyword: string;
  competitorDomain: string;
  competitorUrl: string;
  competitorHasCoverage: boolean;
  weHaveCoverage: boolean;
  gapType: "they-have-we-dont" | "we-have-they-dont" | "both-have";
  opportunity: string;
}

/**
 * Analyze keyword gaps between our site and competitors.
 * Uses semantic embeddings (OpenAI or TF-IDF fallback) for smarter matching
 * instead of simple string matching.
 */
export async function findKeywordGaps(siteId: string): Promise<KeywordGap[]> {
  // Load our tracked keywords and published content
  const [trackedKeywords, blogPosts, competitorAnalyses] = await Promise.all([
    prisma.trackedKeyword.findMany({
      where: { siteId, isActive: true },
      select: { keyword: true, targetPage: true, tier: true },
    }),
    prisma.blogPost.findMany({
      where: { siteId, status: "published" },
      select: { title: true, slug: true, targetKeyword: true },
    }),
    prisma.competitorAnalysis.findMany({
      where: { siteId },
      include: { competitor: { select: { domain: true, name: true } } },
      orderBy: { analyzedAt: "desc" },
    }),
  ]);

  if (competitorAnalyses.length === 0) return [];

  // Build lists of our keywords and competitor topics
  const ourKeywordTexts = [
    ...trackedKeywords.map((k) => k.keyword),
    ...blogPosts.map((p) => p.targetKeyword),
  ].filter(Boolean);

  // Deduplicate competitor topics
  const competitorTopicMap = new Map<string, { topic: string; domain: string; url: string; score: number }>();
  for (const analysis of competitorAnalyses) {
    const domain = analysis.competitor?.domain || "unknown";
    for (const topic of analysis.topicsDetected) {
      const key = topic.toLowerCase().trim();
      if (key.length < 3) continue;
      if (!competitorTopicMap.has(key)) {
        competitorTopicMap.set(key, {
          topic,
          domain,
          url: analysis.pageUrl,
          score: analysis.aiVisScore,
        });
      }
    }
  }
  const competitorTopics = Array.from(competitorTopicMap.values());

  if (ourKeywordTexts.length === 0 || competitorTopics.length === 0) return [];

  // ── Compute semantic similarity matrix ──
  const SEMANTIC_MATCH_THRESHOLD = 0.6;
  const { matrix, method } = await computeSimilarityMatrix(
    competitorTopics.map((t) => t.topic),
    ourKeywordTexts
  );
  console.log(`[competitive-intel] Gap analysis using ${method} embeddings (${competitorTopics.length} competitor topics × ${ourKeywordTexts.length} our keywords)`);

  const gaps: KeywordGap[] = [];

  // For each competitor topic, check if we have semantically similar coverage
  for (let i = 0; i < competitorTopics.length; i++) {
    const comp = competitorTopics[i];
    const similarities = matrix[i];

    // Find the best match in our keywords
    const bestMatchIdx = similarities.indexOf(Math.max(...similarities));
    const bestSimilarity = similarities[bestMatchIdx];

    if (bestSimilarity < SEMANTIC_MATCH_THRESHOLD) {
      // No match — this is a gap
      gaps.push({
        keyword: comp.topic,
        competitorDomain: comp.domain,
        competitorUrl: comp.url,
        competitorHasCoverage: true,
        weHaveCoverage: false,
        gapType: "they-have-we-dont",
        opportunity: `${comp.domain} covers "${comp.topic}" (AI Vis: ${comp.score}) — we have no similar content (best match: ${Math.round(bestSimilarity * 100)}% to "${ourKeywordTexts[bestMatchIdx]}")`,
      });
    }
  }

  // Also find topics we cover that competitors don't
  // Build reverse similarity: for each of our keywords, check max match to competitor topics
  for (let j = 0; j < ourKeywordTexts.length; j++) {
    const kw = ourKeywordTexts[j];
    let maxSim = 0;
    for (let i = 0; i < competitorTopics.length; i++) {
      if (matrix[i][j] > maxSim) maxSim = matrix[i][j];
    }

    if (maxSim < SEMANTIC_MATCH_THRESHOLD) {
      const trackedKw = trackedKeywords.find((tk) => tk.keyword === kw);
      gaps.push({
        keyword: kw,
        competitorDomain: "—",
        competitorUrl: trackedKw?.targetPage || "",
        competitorHasCoverage: false,
        weHaveCoverage: true,
        gapType: "we-have-they-dont",
        opportunity: `We target "${kw}"${trackedKw?.tier ? ` (${trackedKw.tier})` : ""} — no competitor coverage found. This is our advantage.`,
      });
    }
  }

  // Sort: their gaps first (opportunities), then our advantages
  return gaps
    .sort((a, b) => {
      if (a.gapType !== b.gapType) {
        return a.gapType === "they-have-we-dont" ? -1 : 1;
      }
      return 0;
    })
    .slice(0, 75);
}
