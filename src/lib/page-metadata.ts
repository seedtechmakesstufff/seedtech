/* ── Dynamic Page Metadata ──
 *
 * Single source of truth: the PageMetadata DB table (managed via admin dashboard).
 * No code-level fallbacks. If a DB record is missing, the page renders with a
 * visible "[MISSING METADATA]" title so it gets caught immediately.
 *
 * Usage in any page.tsx:
 *
 *   import { buildMetadata } from "@/lib/page-metadata";
 *
 *   export const generateMetadata = buildMetadata("/about");
 */

import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import type { Metadata } from "next";

/**
 * Fetch PageMetadata record for a given path.
 * Returns null if no record exists in the DB.
 */
async function getPageMetadataFromDB(path: string, siteId: string = DEFAULT_SITE_ID) {
  try {
    return await prisma.pageMetadata.findUnique({
      where: { siteId_path: { siteId, path } },
    });
  } catch {
    return null;
  }
}

/**
 * Build a Next.js `generateMetadata` function for a page.
 * DB is the single source of truth — no inline fallbacks.
 *
 * @param path  The page path (e.g. "/about", "/services/managed-it")
 */
export function buildMetadata(path: string) {
  return async function generateMetadata(): Promise<Metadata> {
    const record = await getPageMetadataFromDB(path);

    if (!record) {
      console.warn(`[metadata] No PageMetadata record for "${path}" — add it in the admin dashboard.`);
      return {
        title: `[MISSING METADATA] ${path}`,
        description: undefined,
        alternates: { canonical: path },
      };
    }

    const title = record.title || undefined;
    const description = record.description || undefined;
    const ogTitle = record.ogTitle || title;
    const ogDescription = record.ogDescription || description;
    const ogImage = record.ogImageUrl || undefined;
    const canonical = record.canonical || path;
    const noIndex = record.noIndex ?? false;
    const noFollow = record.noFollow ?? false;

    const robots: Metadata["robots"] = {};
    if (noIndex) robots.index = false;
    if (noFollow) robots.follow = false;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: {
        card: (record.twitterCard as "summary_large_image" | "summary") || "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
      ...(noIndex || noFollow ? { robots } : {}),
    };
  };
}

/**
 * For dynamic routes (e.g. blog posts), call this directly inside generateMetadata.
 * DB is the single source of truth.
 *
 * @param path  The full path (e.g. "/blog/my-post")
 */
export async function resolveMetadata(path: string): Promise<Metadata> {
  return buildMetadata(path)();
}

/**
 * Get the raw PageMetadata DB record for a given path.
 * Useful when you need to merge DB overrides into custom generateMetadata logic
 * (e.g. blog posts that already build metadata from post content).
 */
export async function getPageMetadataRecord(path: string) {
  return getPageMetadataFromDB(path);
}
