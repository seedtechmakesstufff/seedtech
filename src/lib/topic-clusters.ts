/**
 * Topic Authority Engine — cluster generation, gap analysis, authority scoring, link enforcement.
 *
 * Powers the "Topic Clusters" tab on the SEO dashboard.
 * Uses Claude to generate pillar/spoke topic maps from a seed keyword,
 * then analyzes existing content to find gaps and score authority.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, type BusinessContext } from "@/lib/business-context";

// ── Types ──

export interface GeneratedCluster {
  name: string;
  pillarPage: string;
  description: string;
  subtopics: GeneratedSubtopic[];
}

export interface GeneratedSubtopic {
  title: string;
  slug: string;
  targetKeyword: string;
  searchIntent: "transactional" | "commercial" | "informational" | "navigational";
  priority: number;
  wordCountTarget: number;
  briefNotes: string;
}

export interface ClusterGapResult {
  clusterId: string;
  clusterName: string;
  totalSubtopics: number;
  publishedCount: number;
  draftCount: number;
  missingCount: number;
  coveragePercent: number;
  missingTopics: { title: string; targetKeyword: string; priority: number; searchIntent: string }[];
  weakTopics: { title: string; pageUrl: string; score: number; issue: string }[];
}

export interface ClusterAuthorityResult {
  clusterId: string;
  clusterName: string;
  authorityScore: number;
  coveragePercent: number;
  avgContentScore: number;
  avgAiVisScore: number;
  linkDensity: number;
  breakdown: {
    topicCoverage: number;
    contentQuality: number;
    internalLinking: number;
    aiVisibility: number;
  };
}

export interface LinkSuggestion {
  sourcePageUrl: string;
  targetPageUrl: string;
  anchorText: string;
  reason: string;
  clusterId?: string;
}

// ── Cluster Generator ──

/**
 * Generate a topic cluster from a seed keyword using Claude.
 * Returns a pillar + spoke structure ready to be saved.
 */
export async function generateTopicCluster(
  siteId: string,
  seedKeyword: string
): Promise<GeneratedCluster> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  let bizContext: BusinessContext | null = null;
  try {
    bizContext = await getBusinessContextForSite(siteId);
  } catch {
    /* proceed without business context */
  }

  const businessInfo = bizContext
    ? `
Business: ${bizContext.companyName}
Industry: ${bizContext.primaryService}
Location: ${bizContext.location}
Target audience: ${bizContext.targetAudience}
Secondary services: ${bizContext.secondaryServices.join(", ")}
`
    : "";

  const prompt = `You are an expert SEO strategist specializing in topic authority and AI visibility for local businesses.

Given this seed keyword, generate a comprehensive topic cluster that would establish topical authority.

Seed keyword: "${seedKeyword}"
${businessInfo}

Return a JSON object with this exact structure:
{
  "name": "Cluster display name",
  "pillarPage": "/suggested-pillar-url",
  "description": "1-2 sentence cluster description",
  "subtopics": [
    {
      "title": "Subtopic page title / H1",
      "slug": "url-slug-for-this-page",
      "targetKeyword": "primary keyword to target",
      "searchIntent": "informational|commercial|transactional|navigational",
      "priority": 85,
      "wordCountTarget": 1500,
      "briefNotes": "2-3 sentences about what this page should cover, including key sections and unique angles."
    }
  ]
}

Requirements:
- Generate 8-15 subtopics (spoke pages) that support the pillar
- Mix of search intents: mostly informational, some commercial, 1-2 transactional
- Each subtopic should target a specific long-tail keyword
- Priority 0-100 (higher = create this content first)
- Word count targets should vary: shorter for definitions (800), longer for guides (2000+)
- Brief notes should suggest unique angles, not generic descriptions
- Think about what questions local business customers actually ask
- Include "vs" comparison topics, "how to" guides, "cost/pricing" pages, and FAQ-style content
- Pillar page URL should be a clean, keyword-rich path
- Subtopic slugs should be relative to the pillar (e.g., if pillar is /managed-it, subtopic might be "managed-it/benefits")

Return ONLY valid JSON, no markdown fences.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  // Parse JSON — handle markdown fences if Claude wraps them
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned) as GeneratedCluster;

  // Validate structure
  if (!parsed.name || !parsed.pillarPage || !Array.isArray(parsed.subtopics)) {
    throw new Error("Invalid cluster structure returned from Claude");
  }

  return parsed;
}

/**
 * Save a generated cluster to the database.
 * Creates the KeywordCluster + ClusterSubtopics.
 */
export async function saveGeneratedCluster(
  siteId: string,
  seedKeyword: string,
  cluster: GeneratedCluster
): Promise<string> {
  const result = await prisma.keywordCluster.create({
    data: {
      siteId,
      name: cluster.name,
      pillarPage: cluster.pillarPage,
      description: cluster.description,
      seedKeyword,
      status: "draft",
      subtopics: {
        create: cluster.subtopics.map((st) => ({
          title: st.title,
          slug: st.slug,
          targetKeyword: st.targetKeyword,
          searchIntent: st.searchIntent,
          contentStatus: "missing",
          priority: st.priority,
          wordCountTarget: st.wordCountTarget,
          briefNotes: st.briefNotes,
        })),
      },
    },
  });

  return result.id;
}

// ── Gap Analysis ──

/**
 * Analyze a cluster for content gaps:
 * - Which subtopics have no published content?
 * - Which existing pages are underperforming?
 */
export async function analyzeClusterGaps(siteId: string, clusterId: string): Promise<ClusterGapResult> {
  const cluster = await prisma.keywordCluster.findUniqueOrThrow({
    where: { id: clusterId },
    include: {
      subtopics: { orderBy: { priority: "desc" } },
    },
  });

  // Get all published blog posts and site pages for matching
  const [blogPosts, sitePages, contentScores] = await Promise.all([
    prisma.blogPost.findMany({
      where: { siteId, status: "published" },
      select: { id: true, slug: true, title: true, targetKeyword: true, body: true },
    }),
    prisma.sitePage.findMany({
      where: { siteId },
      select: { path: true, title: true },
    }),
    prisma.contentScore.findMany({
      where: { siteId },
      select: { pageUrl: true, overallScore: true, eeatScore: true, aioScore: true },
    }),
  ]);

  const scoreMap = new Map(contentScores.map((s) => [s.pageUrl, s]));
  const missingTopics: ClusterGapResult["missingTopics"] = [];
  const weakTopics: ClusterGapResult["weakTopics"] = [];
  let publishedCount = 0;
  let draftCount = 0;
  let missingCount = 0;

  // Update subtopic statuses based on content matching
  for (const subtopic of cluster.subtopics) {
    const match = findContentMatch(subtopic, blogPosts, sitePages);

    if (match) {
      const score = scoreMap.get(match.pageUrl);
      const newStatus = match.type === "blog" ? "published" : "published";

      // Update subtopic with matched page
      await prisma.clusterSubtopic.update({
        where: { id: subtopic.id },
        data: {
          contentStatus: newStatus,
          matchedPageUrl: match.pageUrl,
          matchedBlogId: match.blogId || null,
        },
      });

      publishedCount++;

      // Check if existing content is weak
      if (score && score.overallScore < 60) {
        weakTopics.push({
          title: subtopic.title,
          pageUrl: match.pageUrl,
          score: score.overallScore,
          issue: score.eeatScore < 50
            ? "Low E-E-A-T score"
            : score.aioScore < 50
              ? "Low AIO readiness"
              : "Below average overall quality",
        });
      }
    } else {
      // Check if there's a draft/idea
      const hasIdea = await prisma.contentIdea.findFirst({
        where: {
          siteId,
          targetKeyword: { contains: subtopic.targetKeyword, mode: "insensitive" },
          status: { in: ["idea", "scheduled"] },
        },
      });

      const status = hasIdea ? "idea" : "missing";
      await prisma.clusterSubtopic.update({
        where: { id: subtopic.id },
        data: { contentStatus: status, matchedPageUrl: null, matchedBlogId: null },
      });

      if (status === "idea") {
        draftCount++;
      } else {
        missingCount++;
        missingTopics.push({
          title: subtopic.title,
          targetKeyword: subtopic.targetKeyword,
          priority: subtopic.priority,
          searchIntent: subtopic.searchIntent,
        });
      }
    }
  }

  const total = cluster.subtopics.length;
  const coveragePercent = total > 0 ? Math.round((publishedCount / total) * 100) : 0;

  // Update cluster coverage
  await prisma.keywordCluster.update({
    where: { id: clusterId },
    data: { coveragePercent },
  });

  return {
    clusterId,
    clusterName: cluster.name,
    totalSubtopics: total,
    publishedCount,
    draftCount,
    missingCount,
    coveragePercent,
    missingTopics,
    weakTopics,
  };
}

/**
 * Run gap analysis on ALL clusters for a site.
 */
export async function analyzeAllClusterGaps(siteId: string): Promise<ClusterGapResult[]> {
  const clusters = await prisma.keywordCluster.findMany({
    where: { siteId, status: { not: "archived" } },
    select: { id: true },
  });

  const results: ClusterGapResult[] = [];
  for (const cluster of clusters) {
    results.push(await analyzeClusterGaps(siteId, cluster.id));
  }
  return results;
}

// ── Authority Scoring ──

/**
 * Score a cluster's topical authority.
 * Composite of: coverage %, content quality, internal linking, AI visibility.
 */
export async function scoreClusterAuthority(
  siteId: string,
  clusterId: string
): Promise<ClusterAuthorityResult> {
  const cluster = await prisma.keywordCluster.findUniqueOrThrow({
    where: { id: clusterId },
    include: {
      subtopics: true,
    },
  });

  const publishedUrls = cluster.subtopics
    .filter((st) => st.matchedPageUrl)
    .map((st) => st.matchedPageUrl as string);

  // Include pillar page
  if (cluster.pillarPage) publishedUrls.push(cluster.pillarPage);

  // Get content scores for all cluster pages
  const contentScores = publishedUrls.length > 0
    ? await prisma.contentScore.findMany({
        where: { siteId, pageUrl: { in: publishedUrls } },
      })
    : [];

  // Get AI Visibility scores (latest per page)
  const aiVisScores = publishedUrls.length > 0
    ? await prisma.aIVisibilityScore.findMany({
        where: { siteId, pageUrl: { in: publishedUrls } },
        orderBy: { scoredAt: "desc" },
        distinct: ["pageUrl"],
      })
    : [];

  // Calculate metrics
  const totalSubtopics = cluster.subtopics.length;
  const publishedCount = cluster.subtopics.filter(
    (st) => st.contentStatus === "published"
  ).length;
  const coveragePercent = totalSubtopics > 0
    ? Math.round((publishedCount / totalSubtopics) * 100)
    : 0;

  const avgContentScore = contentScores.length > 0
    ? Math.round(contentScores.reduce((s, c) => s + c.overallScore, 0) / contentScores.length)
    : 0;

  const avgAiVisScore = aiVisScores.length > 0
    ? Math.round(aiVisScores.reduce((s, c) => s + c.overallScore, 0) / aiVisScores.length)
    : 0;

  // Internal link density: average internal links per published cluster page
  const totalInternalLinks = contentScores.reduce((s, c) => s + c.internalLinks, 0);
  const linkDensity = contentScores.length > 0
    ? Math.round((totalInternalLinks / contentScores.length) * 10) / 10
    : 0;

  // Composite authority score (weighted)
  const breakdown = {
    topicCoverage: coveragePercent,                           // 30% weight
    contentQuality: avgContentScore,                          // 25% weight
    internalLinking: Math.min(linkDensity * 20, 100),         // 20% weight (5+ links = 100)
    aiVisibility: avgAiVisScore,                              // 25% weight
  };

  const authorityScore = Math.round(
    breakdown.topicCoverage * 0.3 +
    breakdown.contentQuality * 0.25 +
    breakdown.internalLinking * 0.2 +
    breakdown.aiVisibility * 0.25
  );

  // Persist scores
  await prisma.keywordCluster.update({
    where: { id: clusterId },
    data: {
      authorityScore,
      coveragePercent,
      avgContentScore,
      avgAiVisScore: avgAiVisScore,
      linkDensity,
      lastScoredAt: new Date(),
    },
  });

  return {
    clusterId,
    clusterName: cluster.name,
    authorityScore,
    coveragePercent,
    avgContentScore,
    avgAiVisScore,
    linkDensity,
    breakdown,
  };
}

/**
 * Score authority for ALL clusters of a site.
 */
export async function scoreAllClustersAuthority(siteId: string): Promise<ClusterAuthorityResult[]> {
  const clusters = await prisma.keywordCluster.findMany({
    where: { siteId, status: { not: "archived" } },
    select: { id: true },
  });

  const results: ClusterAuthorityResult[] = [];
  for (const cluster of clusters) {
    results.push(await scoreClusterAuthority(siteId, cluster.id));
  }
  return results;
}

// ── Internal Link Enforcer ──

/**
 * Analyze a cluster's content for missing internal links.
 * Generates suggestions for links that should exist between cluster pages.
 */
export async function enforceClusterLinks(
  siteId: string,
  clusterId: string
): Promise<LinkSuggestion[]> {
  const cluster = await prisma.keywordCluster.findUniqueOrThrow({
    where: { id: clusterId },
    include: {
      subtopics: { where: { matchedPageUrl: { not: null } } },
    },
  });

  // Collect all cluster pages (pillar + spokes with content)
  const clusterPages: { url: string; title: string; keyword: string }[] = [
    { url: cluster.pillarPage, title: cluster.name, keyword: cluster.seedKeyword },
  ];
  for (const st of cluster.subtopics) {
    if (st.matchedPageUrl) {
      clusterPages.push({
        url: st.matchedPageUrl,
        title: st.title,
        keyword: st.targetKeyword,
      });
    }
  }

  if (clusterPages.length < 2) return [];

  // Get blog post content for all cluster pages
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      siteId,
      status: "published",
      slug: {
        in: clusterPages
          .filter((p) => p.url.startsWith("/blog/"))
          .map((p) => p.url.replace("/blog/", "")),
      },
    },
    select: { slug: true, body: true, title: true },
  });

  const bodyMap = new Map(blogPosts.map((p) => [`/blog/${p.slug}`, p.body]));

  const suggestions: LinkSuggestion[] = [];

  // For each page, check if it links to every other cluster page
  for (const source of clusterPages) {
    const body = bodyMap.get(source.url);
    if (!body) continue;

    for (const target of clusterPages) {
      if (source.url === target.url) continue;

      // Check if source already links to target
      const linkPatterns = [
        target.url,
        target.url.replace(/^\//, ""),
        `](${target.url})`,
      ];

      const hasLink = linkPatterns.some((pattern) => body.includes(pattern));

      if (!hasLink) {
        suggestions.push({
          sourcePageUrl: source.url,
          targetPageUrl: target.url,
          anchorText: target.keyword || target.title,
          reason:
            target.url === cluster.pillarPage
              ? `Spoke page should link back to pillar "${cluster.name}"`
              : source.url === cluster.pillarPage
                ? `Pillar page should link to spoke "${target.title}"`
                : `Related cluster pages should be cross-linked for topic authority`,
          clusterId,
        });
      }
    }
  }

  // Save suggestions to DB (upsert to avoid duplicates)
  for (const suggestion of suggestions) {
    await prisma.internalLinkSuggestion.upsert({
      where: {
        siteId_sourcePageUrl_targetPageUrl: {
          siteId,
          sourcePageUrl: suggestion.sourcePageUrl,
          targetPageUrl: suggestion.targetPageUrl,
        },
      },
      update: {
        anchorText: suggestion.anchorText,
        reason: suggestion.reason,
        clusterId: suggestion.clusterId,
      },
      create: {
        siteId,
        clusterId: suggestion.clusterId,
        sourcePageUrl: suggestion.sourcePageUrl,
        targetPageUrl: suggestion.targetPageUrl,
        anchorText: suggestion.anchorText,
        reason: suggestion.reason,
        status: "pending",
      },
    });
  }

  return suggestions;
}

/**
 * Run link enforcement on ALL clusters for a site.
 */
export async function enforceAllClusterLinks(siteId: string): Promise<LinkSuggestion[]> {
  const clusters = await prisma.keywordCluster.findMany({
    where: { siteId, status: { not: "archived" } },
    select: { id: true },
  });

  const allSuggestions: LinkSuggestion[] = [];
  for (const cluster of clusters) {
    const suggestions = await enforceClusterLinks(siteId, cluster.id);
    allSuggestions.push(...suggestions);
  }
  return allSuggestions;
}

// ── Helpers ──

interface ContentMatch {
  pageUrl: string;
  blogId?: string;
  type: "blog" | "page";
}

/**
 * Try to match a subtopic to existing content.
 * Uses keyword/slug matching against blog posts and site pages.
 */
function findContentMatch(
  subtopic: { targetKeyword: string; slug: string; title: string },
  blogPosts: { id: string; slug: string; title: string; targetKeyword: string; body: string }[],
  sitePages: { path: string; title: string | null }[]
): ContentMatch | null {
  const normalizedKeyword = subtopic.targetKeyword.toLowerCase();
  const normalizedSlug = subtopic.slug.toLowerCase();
  const normalizedTitle = subtopic.title.toLowerCase();

  // 1. Exact keyword match on blog posts
  for (const post of blogPosts) {
    if (post.targetKeyword.toLowerCase() === normalizedKeyword) {
      return { pageUrl: `/blog/${post.slug}`, blogId: post.id, type: "blog" };
    }
  }

  // 2. Slug match on blog posts
  for (const post of blogPosts) {
    const postSlug = post.slug.toLowerCase();
    if (
      postSlug.includes(normalizedSlug) ||
      normalizedSlug.includes(postSlug) ||
      postSlug.includes(normalizedKeyword.replace(/\s+/g, "-"))
    ) {
      return { pageUrl: `/blog/${post.slug}`, blogId: post.id, type: "blog" };
    }
  }

  // 3. Title similarity on blog posts
  for (const post of blogPosts) {
    const postTitle = post.title.toLowerCase();
    const words = normalizedKeyword.split(/\s+/).filter((w) => w.length > 3);
    const matchCount = words.filter((w) => postTitle.includes(w)).length;
    if (words.length > 0 && matchCount >= Math.ceil(words.length * 0.6)) {
      return { pageUrl: `/blog/${post.slug}`, blogId: post.id, type: "blog" };
    }
  }

  // 4. Site page path match
  for (const page of sitePages) {
    const pagePath = page.path.toLowerCase();
    if (
      pagePath.includes(normalizedSlug) ||
      normalizedSlug.includes(pagePath.replace(/\//g, "")) ||
      (page.title && page.title.toLowerCase().includes(normalizedTitle))
    ) {
      return { pageUrl: page.path, type: "page" };
    }
  }

  return null;
}
