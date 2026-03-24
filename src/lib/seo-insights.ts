/* ── SEO Insights Engine ──
 * Generates actionable insights:
 *   - Content freshness alerts
 *   - Keyword cannibalization detection
 *   - Internal linking suggestions
 *   - Keyword opportunities from AI
 *   - E-E-A-T signal deficiencies (v2)
 *   - AIO optimization opportunities (v2)
 *   - CTR improvement suggestions (v2)
 *
 * Stores results in SeoInsight table for the Insights UI panel.
 */

import { prisma } from "@/lib/prisma";
import {
  isSearchConsoleConfigured,
  getKeywordPerformance,
  getPagePerformance,
} from "@/lib/google-search-console";
import { TRACKED_KEYWORDS } from "@/data/seo-strategy";
import { buildStrategyPrompt } from "@/lib/business-context";

/* ── Types ── */

export interface InsightData {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  actionUrl: string | null;
  priority: number;
  createdAt: Date;
}

/* ── Content Freshness Alerts ── */

export async function detectStalContent(): Promise<InsightData[]> {
  const insights: InsightData[] = [];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    // Find published blog posts older than 3 months
    const stalePosts = await prisma.blogPost.findMany({
      where: {
        status: "published",
        updatedAt: { lt: threeMonthsAgo },
      },
      select: { id: true, title: true, slug: true, updatedAt: true, targetKeyword: true },
      orderBy: { updatedAt: "asc" },
    });

    for (const post of stalePosts) {
      const ageMonths = Math.floor((Date.now() - post.updatedAt.getTime()) / (30 * 24 * 60 * 60 * 1000));
      const isCritical = post.updatedAt < sixMonthsAgo;

      insights.push({
        id: `freshness-${post.id}`,
        type: "content_freshness",
        status: "active",
        title: `"${post.title}" hasn't been updated in ${ageMonths} months`,
        description: `This blog post was last updated ${ageMonths} months ago${post.targetKeyword ? ` and targets "${post.targetKeyword}"` : ""}. Search engines favor fresh content — consider updating stats, examples, or adding new sections to maintain rankings.`,
        actionUrl: `/admin/blog/${post.id}`,
        priority: isCritical ? 80 : 50,
        createdAt: new Date(),
      });
    }
  } catch {
    // DB not available
  }

  return insights;
}

/* ── Keyword Cannibalization Detection ── */

export async function detectCannibalization(): Promise<InsightData[]> {
  const insights: InsightData[] = [];

  if (!isSearchConsoleConfigured()) return insights;

  try {
    // Get page-level performance
    const pages = await getPagePerformance(28, 50);
    const keywords = await getKeywordPerformance(28, 200);

    // Group: which keywords bring traffic to which pages?
    // If two pages rank for the same tracked keyword, that's cannibalization
    const keywordPageMap: Record<string, { page: string; position: number; clicks: number }[]> = {};

    for (const kw of TRACKED_KEYWORDS) {
      const matches = keywords.filter(
        (k) => k.keyword.toLowerCase().includes(kw.keyword.toLowerCase()) ||
               kw.keyword.toLowerCase().includes(k.keyword.toLowerCase())
      );
      if (matches.length > 0) {
        // Check which pages these keywords drive traffic to
        // We need query+page dimension data, but GSC API only gives one dimension at a time
        // Instead, check if the keyword's target page is the actual top page
        const targetPage = kw.targetPage;
        const _topRanking = matches[0];

        // Find if any other tracked keyword shares the same target page with different intent
        const sameTarget = TRACKED_KEYWORDS.filter(
          (other) => other.targetPage === targetPage && other.keyword !== kw.keyword
        );

        if (sameTarget.length > 2) {
          if (!keywordPageMap[targetPage]) {
            keywordPageMap[targetPage] = [];
            const competing = [kw, ...sameTarget].map((k) => k.keyword);
            insights.push({
              id: `cannibalization-${targetPage}`,
              type: "cannibalization",
              status: "active",
              title: `${competing.length} keywords competing on ${targetPage}`,
              description: `The page ${targetPage} is targeted by ${competing.length} keywords: ${competing.slice(0, 4).map((k) => `"${k}"`).join(", ")}${competing.length > 4 ? `… and ${competing.length - 4} more` : ""}. Consider splitting into dedicated pages for better ranking focus.`,
              actionUrl: targetPage,
              priority: 60,
              createdAt: new Date(),
            });
          }
        }
      }
    }

    // Check for pages with very similar traffic patterns (potential cannibalization)
    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < Math.min(pages.length, 20); j++) {
        const a = pages[i];
        const b = pages[j];
        // If two pages have similar average positions for similar impressions, they may be cannibalizing
        if (
          Math.abs(a.position - b.position) < 5 &&
          Math.abs(a.impressions - b.impressions) / Math.max(a.impressions, 1) < 0.3 &&
          a.impressions > 10 && b.impressions > 10
        ) {
          const pathA = new URL(a.page).pathname;
          const pathB = new URL(b.page).pathname;
          // Only flag if they're in the same section
          const sectionA = pathA.split("/").slice(0, 3).join("/");
          const sectionB = pathB.split("/").slice(0, 3).join("/");
          if (sectionA === sectionB && pathA !== pathB) {
            insights.push({
              id: `cannibalization-pages-${pathA}-${pathB}`,
              type: "cannibalization",
              status: "active",
              title: `${pathA} and ${pathB} may be cannibalizing each other`,
              description: `Both pages rank at similar positions (${a.position.toFixed(1)} vs ${b.position.toFixed(1)}) with comparable impressions. Consider consolidating content or differentiating their keyword targets.`,
              actionUrl: pathA,
              priority: 55,
              createdAt: new Date(),
            });
          }
        }
      }
    }
  } catch {
    // GSC not available
  }

  return insights;
}

/* ── Internal Linking Suggestions ── */

export async function detectLinkingOpportunities(): Promise<InsightData[]> {
  const insights: InsightData[] = [];

  try {
    // Check blog posts for internal link count
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true, body: true, targetKeyword: true },
    });

    for (const post of posts) {
      // Count internal links in the body
      const internalLinkCount = (post.body.match(/\]\(\//g) || []).length +
        (post.body.match(/href="\//g) || []).length;

      if (internalLinkCount < 2) {
        // Find relevant pages to link to based on the target keyword
        const suggestedLinks: string[] = [];
        if (post.targetKeyword) {
          const kw = post.targetKeyword.toLowerCase();
          if (kw.includes("it") || kw.includes("support") || kw.includes("managed")) {
            suggestedLinks.push("/services/managed-it", "/pricing/it-support");
          }
          if (kw.includes("web") || kw.includes("site") || kw.includes("design")) {
            suggestedLinks.push("/services/web-development", "/pricing/web-development");
          }
          if (kw.includes("security") || kw.includes("cyber")) {
            suggestedLinks.push("/services/managed-it");
          }
        }
        if (suggestedLinks.length === 0) {
          suggestedLinks.push("/services/managed-it", "/contact");
        }

        insights.push({
          id: `linking-${post.id}`,
          type: "internal_linking",
          status: "active",
          title: `"${post.title}" has only ${internalLinkCount} internal link(s)`,
          description: `This post should link to at least 2-3 internal pages for better SEO equity distribution. Suggested links: ${suggestedLinks.map((l) => `\`${l}\``).join(", ")}`,
          actionUrl: `/admin/blog/${post.id}`,
          priority: 40,
          createdAt: new Date(),
        });
      }
    }

    // Check if high-value pages link to blog content
    if (isSearchConsoleConfigured()) {
      const pages = await getPagePerformance(28, 20);
      const topPages = pages.filter((p) => p.clicks > 5).slice(0, 5);

      if (topPages.length > 0 && posts.length > 0) {
        insights.push({
          id: "linking-top-to-blog",
          type: "internal_linking",
          status: "active",
          title: "Link your top-performing pages to recent blog content",
          description: `Your top traffic pages (${topPages.slice(0, 3).map((p) => new URL(p.page).pathname).join(", ")}) should link to relevant blog posts to distribute SEO authority and keep visitors engaged longer.`,
          actionUrl: null,
          priority: 35,
          createdAt: new Date(),
        });
      }
    }
  } catch {
    // DB/GSC not available
  }

  return insights;
}

/* ── E-E-A-T Issue Detection ── */

export async function detectEEATIssues(): Promise<InsightData[]> {
  const insights: InsightData[] = [];

  try {
    // Check crawl results for E-E-A-T issues
    const latestAudit = await prisma.seoPageAudit.findFirst({
      orderBy: { createdAt: "desc" },
      select: { runId: true },
    });
    if (!latestAudit) return insights;

    const eeatIssues = await prisma.seoPageAudit.findMany({
      where: {
        runId: latestAudit.runId,
        checkType: { startsWith: "eeat-" },
        severity: { in: ["critical", "warning"] },
      },
    });

    // Group by page
    const pageIssues: Record<string, typeof eeatIssues> = {};
    for (const issue of eeatIssues) {
      if (!pageIssues[issue.url]) pageIssues[issue.url] = [];
      pageIssues[issue.url].push(issue);
    }

    for (const [page, issues] of Object.entries(pageIssues)) {
      const critCount = issues.filter((i) => i.severity === "critical").length;
      insights.push({
        id: `eeat-${page}`,
        type: "eeat_issue",
        status: "active",
        title: `${page} has ${issues.length} E-E-A-T issue(s)${critCount > 0 ? ` (${critCount} critical)` : ""}`,
        description: issues.map((i) => i.message).join(". "),
        actionUrl: page,
        priority: critCount > 0 ? 75 : 55,
        createdAt: new Date(),
      });
    }

    // Check E-E-A-T scores
    const eeatScores = await prisma.seoPageAudit.findMany({
      where: {
        runId: latestAudit.runId,
        checkType: "eeat-score",
      },
    });

    const lowScorePages = eeatScores.filter((s) => {
      const overall = (s.details as { overall?: number })?.overall ?? 0;
      return overall < 40;
    });

    if (lowScorePages.length > 0) {
      insights.push({
        id: "eeat-low-scores",
        type: "eeat_issue",
        status: "active",
        title: `${lowScorePages.length} page(s) have low E-E-A-T scores (<40/100)`,
        description: `Pages with low E-E-A-T scores: ${lowScorePages.map((p) => p.url).join(", ")}. Add author attribution, citations, first-person experience language, and trust signals.`,
        actionUrl: null,
        priority: 70,
        createdAt: new Date(),
      });
    }
  } catch {
    // DB/crawl not available
  }

  return insights;
}

/* ── CTR Optimization Insights ── */

export async function detectCTROpportunities(): Promise<InsightData[]> {
  const insights: InsightData[] = [];

  if (!isSearchConsoleConfigured()) return insights;

  try {
    const keywords = await getKeywordPerformance(28, 100);

    // High impressions + low CTR = opportunity to improve title/description
    const lowCTR = keywords.filter(
      (k) => k.impressions > 50 && k.ctr < 0.02 && k.position <= 20
    );

    for (const kw of lowCTR.slice(0, 5)) {
      const ctrPct = (kw.ctr * 100).toFixed(1);
      insights.push({
        id: `ctr-${kw.keyword.replace(/\s+/g, "-")}`,
        type: "ctr_optimization",
        status: "active",
        title: `"${kw.keyword}" has ${ctrPct}% CTR with ${kw.impressions} impressions`,
        description: `This keyword ranks at position ${kw.position.toFixed(1)} but has a very low CTR. Improve the page title and meta description to be more compelling. Consider adding numbers, power words, or a clear value proposition.`,
        actionUrl: null,
        priority: kw.impressions > 200 ? 70 : 50,
        createdAt: new Date(),
      });
    }

    // Strike distance keywords (positions 8-20) — close to page 1
    const strikeDistance = keywords.filter(
      (k) => k.position >= 8 && k.position <= 20 && k.impressions > 20
    );

    if (strikeDistance.length > 0) {
      const top5 = strikeDistance
        .sort((a, b) => a.position - b.position)
        .slice(0, 5);
      insights.push({
        id: "strike-distance",
        type: "keyword_opportunity",
        status: "active",
        title: `${strikeDistance.length} keywords in strike distance (positions 8-20)`,
        description: `These keywords are close to page 1: ${top5.map((k) => `"${k.keyword}" (pos ${k.position.toFixed(1)})`).join(", ")}. Boost them with content updates, internal links, and backlinks.`,
        actionUrl: null,
        priority: 65,
        createdAt: new Date(),
      });
    }
  } catch {
    // GSC not available
  }

  return insights;
}

/* ── AI Keyword Discovery ── */

export async function discoverKeywords(): Promise<{
  suggestions: string;
  keywords: { keyword: string; rationale: string; estimatedVolume: string; difficulty: string }[];
}> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const businessContext = buildStrategyPrompt();
  const existingKeywords = TRACKED_KEYWORDS.map((k) => k.keyword).join(", ");

  // Get current GSC data for context
  let gscContext = "";
  if (isSearchConsoleConfigured()) {
    try {
      const keywords = await getKeywordPerformance(28, 50);
      gscContext = `\n\nCurrent top-performing keywords from Google Search Console:\n${keywords.slice(0, 20).map((k) => `- "${k.keyword}" (pos: ${k.position}, clicks: ${k.clicks}, impressions: ${k.impressions})`).join("\n")}`;
    } catch {
      // ignore
    }
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are an expert SEO keyword researcher. Analyze the business context and existing keyword strategy to discover NEW keyword opportunities the business should target. Focus on keywords that are: (1) relevant to the business, (2) not already tracked, (3) achievable for a small/mid-size business, (4) have reasonable search volume. Return exactly 10 keyword suggestions.`,
      messages: [{
        role: "user",
        content: `Business context:\n${businessContext}\n\nAlready tracking these keywords: ${existingKeywords}${gscContext}\n\nSuggest 10 NEW keywords this business should target. For each keyword, provide a JSON object with: keyword, rationale (why this keyword), estimatedVolume (e.g. "100-300/mo"), difficulty (Low/Medium/High).\n\nReturn a JSON array of objects. Only output the JSON array, no other text.`,
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude API error: ${(err as { error?: { message?: string } }).error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = (data as { content?: { text?: string }[] }).content?.[0]?.text ?? "[]";

  let keywords: { keyword: string; rationale: string; estimatedVolume: string; difficulty: string }[] = [];
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      keywords = JSON.parse(jsonMatch[0]);
    }
  } catch {
    keywords = [];
  }

  return { suggestions: content, keywords };
}

/* ── Run All Insights ── */

export async function generateAllInsights(): Promise<InsightData[]> {
  const [freshness, cannibalization, linking, eeat, ctr] = await Promise.allSettled([
    detectStalContent(),
    detectCannibalization(),
    detectLinkingOpportunities(),
    detectEEATIssues(),
    detectCTROpportunities(),
  ]);

  const all: InsightData[] = [
    ...(freshness.status === "fulfilled" ? freshness.value : []),
    ...(cannibalization.status === "fulfilled" ? cannibalization.value : []),
    ...(linking.status === "fulfilled" ? linking.value : []),
    ...(eeat.status === "fulfilled" ? eeat.value : []),
    ...(ctr.status === "fulfilled" ? ctr.value : []),
  ];

  // Sort by priority (highest first)
  all.sort((a, b) => b.priority - a.priority);

  // Store in DB (upsert — replace existing active insights)
  try {
    // Clear old active insights
    await prisma.seoInsight.deleteMany({ where: { status: "active" } });

    // Insert new ones
    if (all.length > 0) {
      await prisma.seoInsight.createMany({
        data: all.map((insight) => ({
          type: insight.type as "content_freshness" | "cannibalization" | "internal_linking" | "keyword_opportunity" | "eeat_issue" | "aio_opportunity" | "ctr_optimization" | "competitor_gap" | "lead_gen" | "general",
          status: "active" as const,
          title: insight.title,
          description: insight.description,
          actionUrl: insight.actionUrl,
          priority: insight.priority,
        })),
      });
    }
  } catch {
    // DB not available — still return insights
  }

  return all;
}

/* ── Get stored insights ── */

export async function getActiveInsights(): Promise<InsightData[]> {
  try {
    const insights = await prisma.seoInsight.findMany({
      where: { status: "active" },
      orderBy: { priority: "desc" },
    });
    return insights.map((i) => ({
      id: i.id,
      type: i.type,
      status: i.status,
      title: i.title,
      description: i.description,
      actionUrl: i.actionUrl,
      priority: i.priority,
      createdAt: i.createdAt,
    }));
  } catch {
    return [];
  }
}

/* ── Dismiss/resolve an insight ── */

export async function updateInsightStatus(id: string, status: "dismissed" | "resolved") {
  return prisma.seoInsight.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "resolved" ? new Date() : undefined,
    },
  });
}
