/* ── Dynamic Page Metadata ──
 *
 * Bridges the admin Metadata tab (PageMetadata DB records) → live page rendering.
 *
 * Usage in any page.tsx:
 *
 *   import { buildMetadata } from "@/lib/page-metadata";
 *
 *   export const generateMetadata = buildMetadata("/about", {
 *     // static fallbacks (used when no DB record exists)
 *     title: "About SeedTech",
 *     description: "Learn about SeedTech...",
 *   });
 *
 * This ensures:
 *   1. If the admin has saved metadata in the Metadata tab → that's used
 *   2. If not → the static fallback you provide is used
 *   3. The SEO crawler sees the SAME metadata the admin manages
 */

import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import type { Metadata } from "next";

interface MetadataFallback {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

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
 *
 * @param path  The page path (e.g. "/about", "/services/managed-it")
 * @param fallback  Static fallback metadata used when no DB record exists
 */
export function buildMetadata(path: string, fallback: MetadataFallback = {}) {
  return async function generateMetadata(): Promise<Metadata> {
    const record = await getPageMetadataFromDB(path);

    // DB record takes priority, then fallback, then empty
    const title = record?.title || fallback.title || undefined;
    const description = record?.description || fallback.description || undefined;
    const ogTitle = record?.ogTitle || fallback.ogTitle || title;
    const ogDescription = record?.ogDescription || fallback.ogDescription || description;
    const ogImage = record?.ogImageUrl || fallback.ogImage || undefined;
    const canonical = record?.canonical || fallback.canonical || path;
    const noIndex = record?.noIndex ?? fallback.noIndex ?? false;
    const noFollow = record?.noFollow ?? false;

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
        card: (record?.twitterCard as "summary_large_image" | "summary") || "summary_large_image",
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
 *
 * @param path  The full path (e.g. "/blog/my-post")
 * @param fallback  Fallback metadata
 */
export async function resolveMetadata(
  path: string,
  fallback: MetadataFallback = {}
): Promise<Metadata> {
  return buildMetadata(path, fallback)();
}

/**
 * Get the raw PageMetadata DB record for a given path.
 * Useful when you need to merge DB overrides into custom generateMetadata logic
 * (e.g. blog posts that already build metadata from post content).
 */
export async function getPageMetadataRecord(path: string) {
  return getPageMetadataFromDB(path);
}
