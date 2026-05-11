/* ── WordPress Sync ────────────────────────────────────────────────────────
 * Pulls published posts + pages from a WordPress site into the platform's
 * BlogPost and SitePage tables so all agents can run against real content.
 *
 * Upsert key: (siteId, slug) — same as the BlogPost unique constraint.
 * A post is skipped when its wordPressPostId matches and modifiedAt hasn't
 * changed — keeping syncs idempotent and cheap on repeat runs.
 * ─────────────────────────────────────────────────────────────────────────── */

import { prisma } from "@/lib/prisma";
import { decryptCredential } from "@/lib/credential-encryption";
import {
  fetchWpPosts,
  fetchWpPages,
  testWpConnection,
  computeWordCount,
  deriveTargetKeyword,
  type WpCredentials,
} from "@/lib/wordpress";
import { syncBlogPostsToSitePages } from "@/lib/site-data";
import { logEvent } from "@/lib/events";

export interface WpSyncResult {
  postsUpserted: number;
  postsSkipped: number;
  pagesUpserted: number;
  errors: string[];
}

export interface WpSyncCredential extends WpCredentials {
  // pathPrefix is included in WpCredentials
}

/** Read and decrypt WordPress credentials for a site. Returns null if not configured. */
export async function getWpCredentials(siteId: string): Promise<WpSyncCredential | null> {
  const cred = await prisma.integrationCredential.findUnique({
    where: { siteId_type: { siteId, type: "wordpress" } },
  });
  if (!cred || !cred.isActive || !cred.encryptedCredentials) return null;

  try {
    const raw = decryptCredential(cred.encryptedCredentials);
    return JSON.parse(raw) as WpSyncCredential;
  } catch {
    return null;
  }
}

/** Run a full WordPress sync for one site. */
export async function syncWordPressForSite(siteId: string): Promise<WpSyncResult> {
  const result: WpSyncResult = { postsUpserted: 0, postsSkipped: 0, pagesUpserted: 0, errors: [] };

  const creds = await getWpCredentials(siteId);
  if (!creds) {
    // No WordPress integration configured for this site — silently skip
    return result;
  }

  // ── Posts ──────────────────────────────────────────────────────────────────

  let posts;
  try {
    posts = await fetchWpPosts(creds);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.errors.push(`fetchWpPosts: ${msg}`);
    await logEvent({
      siteId,
      type: "wordpress.sync_failed",
      severity: "warn",
      title: "WordPress sync failed",
      body: msg,
    });
    return result;
  }

  for (const post of posts) {
    try {
      const slug = post.slug;
      const modifiedAt = post.modifiedAt ? new Date(post.modifiedAt) : new Date();
      const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();

      // Check if already synced and unmodified
      const existing = await prisma.blogPost.findUnique({
        where: { siteId_slug: { siteId, slug } },
        select: { id: true, wordPressPostId: true, updatedAt: true },
      });

      if (
        existing &&
        existing.wordPressPostId === post.id &&
        existing.updatedAt >= modifiedAt
      ) {
        result.postsSkipped++;
        continue;
      }

      const targetKeyword =
        post.focusKeyword?.trim() ||
        deriveTargetKeyword(post.title, post.slug);

      const wordCount = computeWordCount(post.body);

      await prisma.blogPost.upsert({
        where: { siteId_slug: { siteId, slug } },
        update: {
          title: post.title,
          body: post.body,
          excerpt: post.excerpt,
          targetKeyword,
          wordCount,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          status: "published",
          publishedAt,
          wordPressPostId: post.id,
          wordPressSiteUrl: creds.siteUrl,
          updatedAt: modifiedAt,
        },
        create: {
          siteId,
          slug,
          title: post.title,
          body: post.body,
          excerpt: post.excerpt,
          targetKeyword,
          wordCount,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          category: "wordpress",
          status: "published",
          publishedAt,
          author: "",
          wordPressPostId: post.id,
          wordPressSiteUrl: creds.siteUrl,
        },
      });

      result.postsUpserted++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      result.errors.push(`post ${post.slug}: ${msg}`);
    }
  }

  // ── Pages ──────────────────────────────────────────────────────────────────

  let pages;
  try {
    pages = await fetchWpPages(creds);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.errors.push(`fetchWpPages: ${msg}`);
  }

  if (pages) {
    for (const page of pages) {
      try {
        // Heuristic: pages with service/product/about-style slugs get kind="service"
        const kind = inferPageKind(page.slug);
        const pathPrefix = creds.pathPrefix ?? "";
        const path = pathPrefix ? `${pathPrefix}/${page.slug}` : `/${page.slug}`;

        await prisma.sitePage.upsert({
          where: { siteId_path: { siteId, path } },
          update: { title: page.title, source: "wordpress" },
          create: {
            siteId,
            path,
            kind,
            title: page.title,
            source: "wordpress",
            status: "active",
          },
        });
        result.pagesUpserted++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        result.errors.push(`page ${page.slug}: ${msg}`);
      }
    }
  }

  // ── Ensure SitePages exist for all blog posts ──────────────────────────────

  try {
    await syncBlogPostsToSitePages(siteId);
  } catch (e) {
    result.errors.push(`syncBlogPostsToSitePages: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── Log completion event ───────────────────────────────────────────────────

  await logEvent({
    siteId,
    type: "wordpress.sync_completed",
    severity: result.errors.length > 0 ? "warn" : "info",
    title: `WordPress sync: ${result.postsUpserted} posts upserted, ${result.pagesUpserted} pages`,
    payload: {
      posts_upserted: result.postsUpserted,
      posts_skipped: result.postsSkipped,
      pages_upserted: result.pagesUpserted,
      errors: result.errors,
    },
  });

  return result;
}

/** Test a proposed credential before saving it. */
export async function testWpCredentials(
  creds: WpCredentials
): Promise<{ ok: boolean; siteTitle?: string; error?: string }> {
  return testWpConnection(creds);
}

function inferPageKind(slug: string): string {
  const s = slug.toLowerCase();
  if (/home|index/.test(s)) return "home";
  if (/service|solution|offering|product/.test(s)) return "service";
  if (/contact|quote|pricing|hire/.test(s)) return "landing";
  if (/location|area|city|county/.test(s)) return "location";
  return "service"; // default for WP pages
}
