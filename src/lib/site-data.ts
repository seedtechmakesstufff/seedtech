/* ── Site Data Helpers ──
 * DB-backed queries for tracked keywords, keyword clusters,
 * site pages, and integration credentials.
 *
 * Replaces the static src/data/seo-strategy.ts for runtime reads.
 */

import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

/* ── Tracked Keywords ── */

export interface TrackedKeywordRow {
  id: string;
  keyword: string;
  tier: "tier1" | "tier2" | "tier3";
  volume: string;
  competition: string;
  intent: "transactional" | "commercial" | "informational" | "navigational";
  targetPage: string;
  currentPosition: number | null;
  previousPosition: number | null;
  bestPosition: number | null;
  clicks28d: number;
  impressions28d: number;
  ctr28d: number;
  clusterId: string | null;
  isActive: boolean;
}

/**
 * Get all active tracked keywords for a site, ordered by tier then keyword.
 */
export async function getTrackedKeywords(
  siteId: string = DEFAULT_SITE_ID
): Promise<TrackedKeywordRow[]> {
  const rows = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ tier: "asc" }, { keyword: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    keyword: r.keyword,
    tier: r.tier as "tier1" | "tier2" | "tier3",
    volume: r.volume,
    competition: r.competition,
    intent: r.intent as "transactional" | "commercial" | "informational" | "navigational",
    targetPage: r.targetPage,
    currentPosition: r.currentPosition,
    previousPosition: r.previousPosition,
    bestPosition: r.bestPosition,
    clicks28d: r.clicks28d,
    impressions28d: r.impressions28d,
    ctr28d: r.ctr28d,
    clusterId: r.clusterId,
    isActive: r.isActive,
  }));
}

/**
 * Get just the keyword strings for a site (for GSC lookups, snapshot, etc.)
 */
export async function getTrackedKeywordStrings(
  siteId: string = DEFAULT_SITE_ID
): Promise<string[]> {
  const rows = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    select: { keyword: true },
  });
  return rows.map((r) => r.keyword);
}

/**
 * Update keyword positions from GSC data.
 */
export async function updateKeywordPositions(
  siteId: string,
  positions: Record<string, number | null>
): Promise<number> {
  let updated = 0;
  for (const [keyword, position] of Object.entries(positions)) {
    if (position === null) continue;
    try {
      const existing = await prisma.trackedKeyword.findUnique({
        where: { siteId_keyword: { siteId, keyword } },
        select: { currentPosition: true, bestPosition: true },
      });
      if (!existing) continue;

      await prisma.trackedKeyword.update({
        where: { siteId_keyword: { siteId, keyword } },
        data: {
          previousPosition: existing.currentPosition,
          currentPosition: position,
          bestPosition:
            existing.bestPosition === null || position < existing.bestPosition
              ? position
              : existing.bestPosition,
        },
      });
      updated++;
    } catch {
      // keyword not tracked — skip
    }
  }
  return updated;
}

/* ── Keyword Clusters ── */

export interface KeywordClusterRow {
  id: string;
  name: string;
  pillarPage: string;
  description: string | null;
  keywordCount: number;
}

export async function getKeywordClusters(
  siteId: string = DEFAULT_SITE_ID
): Promise<KeywordClusterRow[]> {
  const rows = await prisma.keywordCluster.findMany({
    where: { siteId },
    include: { _count: { select: { keywords: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    pillarPage: r.pillarPage,
    description: r.description,
    keywordCount: r._count.keywords,
  }));
}

/* ── Site Pages ── */

export interface SitePageRow {
  id: string;
  path: string;
  kind: string;
  title: string | null;
  source: string;
  status: string;
}

/**
 * Get all active site pages, ordered by kind then path.
 */
export async function getSitePages(
  siteId: string = DEFAULT_SITE_ID
): Promise<SitePageRow[]> {
  const rows = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    orderBy: [{ kind: "asc" }, { path: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    path: r.path,
    kind: r.kind,
    title: r.title,
    source: r.source,
    status: r.status,
  }));
}

/**
 * Get just the path strings for key pages (non-blog, active).
 * Used by PageSpeed audits, crawlers, etc.
 */
export async function getSiteKeyPagePaths(
  siteId: string = DEFAULT_SITE_ID
): Promise<string[]> {
  const rows = await prisma.sitePage.findMany({
    where: {
      siteId,
      status: "active",
      kind: { not: "blog" },
    },
    select: { path: true },
    orderBy: { path: "asc" },
  });
  return rows.map((r) => r.path);
}

/**
 * Get all page paths (including blog) for crawling.
 */
export async function getAllSitePagePaths(
  siteId: string = DEFAULT_SITE_ID
): Promise<string[]> {
  const rows = await prisma.sitePage.findMany({
    where: { siteId, status: "active" },
    select: { path: true },
    orderBy: { path: "asc" },
  });
  return rows.map((r) => r.path);
}

/**
 * Sync published blog posts into SitePage table.
 * Creates a SitePage entry for each published blog post that doesn't already exist.
 */
export async function syncBlogPostsToSitePages(
  siteId: string = DEFAULT_SITE_ID
): Promise<number> {
  const posts = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    select: { slug: true, title: true },
  });

  let created = 0;
  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    const existing = await prisma.sitePage.findUnique({
      where: { siteId_path: { siteId, path } },
    });
    if (!existing) {
      await prisma.sitePage.create({
        data: {
          siteId,
          path,
          kind: "blog",
          title: post.title,
          source: "blog",
          status: "active",
        },
      });
      created++;
    }
  }
  return created;
}

/* ── Integration Credentials ── */

export interface SearchConsoleIntegration {
  property: string;
  authType: "service-account" | "oauth";
  credentials: string; // decrypted credential JSON or PEM
}

/**
 * Get Search Console integration for a site.
 * Falls back to env vars for backward compatibility.
 */
export async function getSearchConsoleIntegration(
  siteId: string = DEFAULT_SITE_ID
): Promise<SearchConsoleIntegration | null> {
  // Try DB first
  try {
    const row = await prisma.integrationCredential.findUnique({
      where: { siteId_type: { siteId, type: "google_search_console" } },
    });
    if (row && row.isActive && row.encryptedCredentials) {
      return {
        property: row.property,
        authType: row.authType as "service-account" | "oauth",
        credentials: row.encryptedCredentials, // TODO: decrypt in production
      };
    }
  } catch {
    // DB not available
  }

  // Fall back to env vars (single-tenant compat)
  if (
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE
  ) {
    return {
      property: process.env.GOOGLE_SEARCH_CONSOLE_SITE,
      authType: "service-account",
      credentials: JSON.stringify({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      }),
    };
  }

  return null;
}

/**
 * Get the site URL for a site (for PageSpeed, crawling, etc.).
 * Reads from the Site record, falls back to env vars.
 */
export async function getSiteUrl(
  siteId: string = DEFAULT_SITE_ID
): Promise<string> {
  try {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { siteUrl: true, domain: true },
    });
    if (site?.siteUrl) return site.siteUrl;
    if (site?.domain) return `https://${site.domain}`;
  } catch {
    // DB not available
  }

  // Fallback
  return (
    process.env.GOOGLE_SEARCH_CONSOLE_SITE?.replace("sc-domain:", "https://") ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL || ""
  );
}
