/**
 * /api/admin/seo/strategy-docs
 *
 * CRUD for SEO Strategy Documents.
 * These are versioned, categorized strategy narratives that feed into
 * every AI prompt across the platform (metadata, blog, keyword research, etc.)
 *
 * GET  — list all docs (optionally filter by category, active status)
 * POST — create or update a strategy doc
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const activeOnly = url.searchParams.get("active") !== "false";

  const where: Record<string, unknown> = { siteId };
  if (activeOnly) where.isActive = true;
  if (category) where.category = category;

  const docs = await prisma.seoStrategyDoc.findMany({
    where,
    orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { id, title, category, content, isActive, source } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 },
    );
  }

  if (id) {
    // Update existing
    const existing = await prisma.seoStrategyDoc.findFirst({
      where: { id, siteId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.seoStrategyDoc.update({
      where: { id },
      data: {
        title,
        category: category || existing.category,
        content,
        isActive: isActive ?? existing.isActive,
        source: source || existing.source,
        version: existing.version + 1,
      },
    });

    return NextResponse.json(updated);
  }

  // Create new
  const doc = await prisma.seoStrategyDoc.create({
    data: {
      siteId,
      title,
      category: category || "general",
      content,
      isActive: isActive ?? true,
      source: source || "manual",
    },
  });

  return NextResponse.json(doc);
}
