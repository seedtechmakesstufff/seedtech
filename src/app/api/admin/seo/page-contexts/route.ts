/**
 * /api/admin/seo/page-contexts
 *
 * GET  — Returns all known pages for the site with their context status
 *        (DB-configured pages + all known routes + blog posts + crawled pages)
 * POST — Upsert a page context (path + description + keywords + pageType)
 * DELETE — Remove a page context
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── Known static routes for the site ── */
const STATIC_ROUTES: { path: string; kind: string }[] = [
  { path: "/", kind: "page" },
  { path: "/about", kind: "page" },
  { path: "/contact", kind: "page" },
  { path: "/free-audit", kind: "landing" },
  { path: "/services", kind: "page" },
  { path: "/services/managed-it", kind: "service" },
  { path: "/services/managed-it/plans", kind: "service" },
  { path: "/services/managed-it/assessment", kind: "service" },
  { path: "/services/managed-it/onboarding", kind: "service" },
  { path: "/services/managed-it/why-seedtech", kind: "service" },
  { path: "/services/managed-it/mobile-device-management", kind: "service" },
  { path: "/services/web-development", kind: "service" },
  { path: "/services/seedtech-platform", kind: "service" },
  { path: "/services/ecommerce-development", kind: "service" },
  { path: "/services/custom-development", kind: "service" },
  { path: "/services/seo-autopilot", kind: "service" },
  { path: "/pricing/it-support", kind: "page" },
  { path: "/pricing/web-development", kind: "page" },
  { path: "/industries", kind: "page" },
  { path: "/industries/trucking", kind: "industry" },
  { path: "/industries/construction", kind: "industry" },
  { path: "/industries/law-firms", kind: "industry" },
  { path: "/industries/medical", kind: "industry" },
  { path: "/blog", kind: "page" },
  { path: "/our-work", kind: "page" },
  { path: "/reviews", kind: "page" },
  { path: "/terms-conditions", kind: "page" },
];

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  // 1. Get all DB-stored page contexts (user-configured)
  const dbContexts = await prisma.pageContext.findMany({
    where: { siteId },
    orderBy: { path: "asc" },
  });
  const dbMap = new Map(dbContexts.map((c) => [c.path, c]));

  // 2. Gather all known pages from multiple sources
  const pageMap = new Map<string, string>(); // path → kind

  // Static routes
  for (const r of STATIC_ROUTES) {
    pageMap.set(r.path, r.kind);
  }

  // Blog posts
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published", siteId },
      select: { slug: true },
    });
    for (const p of posts) {
      const blogPath = `/blog/${p.slug}`;
      if (!pageMap.has(blogPath)) pageMap.set(blogPath, "blog");
    }
  } catch { /* skip */ }

  // Crawled pages
  try {
    const sitePages = await prisma.sitePage.findMany({
      where: { siteId, status: "active" },
      select: { path: true, kind: true },
    });
    for (const sp of sitePages) {
      if (!pageMap.has(sp.path)) pageMap.set(sp.path, sp.kind);
    }
  } catch { /* skip */ }

  // Also include any DB context paths that might not be in the above lists
  for (const c of dbContexts) {
    if (!pageMap.has(c.path)) pageMap.set(c.path, c.pageType);
  }

  // 3. Build the page list — configured pages get their data, unconfigured pages show empty
  const pages = Array.from(pageMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, kind]) => {
      const db = dbMap.get(path);
      return {
        id: db?.id || null,
        path,
        description: db?.description || "",
        keywords: db?.keywords || [],
        pageType: db?.pageType || kind,
        source: db ? ("custom" as const) : ("unconfigured" as const),
        updatedAt: db?.updatedAt?.toISOString() || null,
      };
    });

  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { path, description, keywords, pageType } = body;

  if (!path || !description) {
    return NextResponse.json(
      { error: "path and description are required" },
      { status: 400 },
    );
  }

  const result = await prisma.pageContext.upsert({
    where: { siteId_path: { siteId, path } },
    create: {
      siteId,
      path,
      description,
      keywords: keywords || [],
      pageType: pageType || "page",
    },
    update: {
      description,
      keywords: keywords || [],
      pageType: pageType || "page",
    },
  });

  return NextResponse.json({ success: true, context: result });
}

export async function DELETE(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { path } = await req.json();
  if (!path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  try {
    await prisma.pageContext.delete({
      where: { siteId_path: { siteId, path } },
    });
  } catch {
    // Already deleted or doesn't exist
  }

  return NextResponse.json({ success: true });
}
