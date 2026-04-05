/* ── Page Metadata CRUD API ──
 * GET  /api/admin/seo/metadata          → list all page metadata for the active site
 * POST /api/admin/seo/metadata          → create or upsert page metadata
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import { STATIC_ROUTES } from "@/lib/static-routes";

interface MergedPage {
  path: string;
  kind: string;
  pageTitle: string | null;
  id: string | null;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  twitterCard: string;
  canonical: string | null;
  noIndex: boolean;
  noFollow: boolean;
  jsonLdType: string | null;
  lastCrawledAt: Date | string | null;
  crawlStatus: string | null;
  updatedAt: Date | string | null;
}

function buildEmptyPage(path: string, kind: string, pageTitle?: string | null): MergedPage {
  return {
    path,
    kind,
    pageTitle: pageTitle ?? null,
    id: null,
    title: null,
    description: null,
    ogTitle: null,
    ogDescription: null,
    ogImageUrl: null,
    twitterCard: "summary_large_image",
    canonical: null,
    noIndex: false,
    noFollow: false,
    jsonLdType: null,
    lastCrawledAt: null,
    crawlStatus: null,
    updatedAt: null,
  };
}

export async function GET() {
  try {
    const ctx = await requireSiteContext();
    if (ctx instanceof NextResponse) return ctx;

    // 1. Saved metadata records
    const records = await prisma.pageMetadata.findMany({
      where: { siteId: ctx.siteId },
      orderBy: { path: "asc" },
    });

    // 2. Crawled pages from SitePage
    const sitePages = await prisma.sitePage.findMany({
      where: { siteId: ctx.siteId, status: "active" },
      select: { path: true, title: true, kind: true },
      orderBy: { path: "asc" },
    });

    // 3. Dynamic blog posts
    let blogPosts: { slug: string; title: string }[] = [];
    try {
      blogPosts = await prisma.blogPost.findMany({
        where: { status: "published", siteId: ctx.siteId },
        select: { slug: true, title: true },
        orderBy: { publishedAt: "desc" },
      });
    } catch {
      /* blog table may not exist for all sites */
    }

    // ── Merge all sources into a single map keyed by path ──
    const pageMap = new Map<string, MergedPage>();

    // Seed with static routes
    for (const route of STATIC_ROUTES) {
      pageMap.set(route.path, buildEmptyPage(route.path, route.kind));
    }

    // Add blog posts
    for (const post of blogPosts) {
      const blogPath = `/blog/${post.slug}`;
      if (!pageMap.has(blogPath)) {
        pageMap.set(blogPath, buildEmptyPage(blogPath, "blog", post.title));
      }
    }

    // Overlay crawled SitePage data (may add paths not in static list)
    for (const sp of sitePages) {
      if (!pageMap.has(sp.path)) {
        pageMap.set(sp.path, buildEmptyPage(sp.path, sp.kind, sp.title));
      } else {
        const existing = pageMap.get(sp.path)!;
        existing.kind = sp.kind || existing.kind;
        existing.pageTitle = sp.title || existing.pageTitle;
      }
    }

    // Overlay saved PageMetadata
    for (const rec of records) {
      if (!pageMap.has(rec.path)) {
        pageMap.set(rec.path, buildEmptyPage(rec.path, "unknown"));
      }
      const page = pageMap.get(rec.path)!;
      page.id = rec.id;
      page.title = rec.title;
      page.description = rec.description;
      page.ogTitle = rec.ogTitle;
      page.ogDescription = rec.ogDescription;
      page.ogImageUrl = rec.ogImageUrl;
      page.twitterCard = rec.twitterCard;
      page.canonical = rec.canonical;
      page.noIndex = rec.noIndex;
      page.noFollow = rec.noFollow;
      page.jsonLdType = rec.jsonLdType;
      page.lastCrawledAt = rec.lastCrawledAt;
      page.crawlStatus = rec.crawlStatus;
      page.updatedAt = rec.updatedAt;
    }

    // Sort and return
    const merged = Array.from(pageMap.values()).sort((a, b) => a.path.localeCompare(b.path));

    return NextResponse.json({ pages: merged });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireSiteContext();
    if (ctx instanceof NextResponse) return ctx;

    const body = await req.json();
    const { path, title, description, ogTitle, ogDescription, ogImageUrl, twitterCard, canonical, noIndex, noFollow, jsonLdType, jsonLdData } = body;

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const record = await prisma.pageMetadata.upsert({
      where: { siteId_path: { siteId: ctx.siteId, path } },
      create: {
        siteId: ctx.siteId,
        path,
        title: title ?? null,
        description: description ?? null,
        ogTitle: ogTitle ?? null,
        ogDescription: ogDescription ?? null,
        ogImageUrl: ogImageUrl ?? null,
        twitterCard: twitterCard ?? "summary_large_image",
        canonical: canonical ?? null,
        noIndex: noIndex ?? false,
        noFollow: noFollow ?? false,
        jsonLdType: jsonLdType ?? null,
        jsonLdData: jsonLdData ?? undefined,
        lastEditedBy: ctx.userId,
      },
      update: {
        title: title ?? null,
        description: description ?? null,
        ogTitle: ogTitle ?? null,
        ogDescription: ogDescription ?? null,
        ogImageUrl: ogImageUrl ?? null,
        twitterCard: twitterCard ?? "summary_large_image",
        canonical: canonical ?? null,
        noIndex: noIndex ?? false,
        noFollow: noFollow ?? false,
        jsonLdType: jsonLdType ?? null,
        jsonLdData: jsonLdData ?? undefined,
        lastEditedBy: ctx.userId,
      },
    });

    // Bust the static cache so the page regenerates with new metadata
    revalidatePath(path);

    return NextResponse.json({ success: true, record });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
