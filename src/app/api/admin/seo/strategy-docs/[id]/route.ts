/**
 * /api/admin/seo/strategy-docs/[id]
 *
 * GET    — fetch a single strategy doc
 * PUT    — update a strategy doc
 * DELETE — delete a strategy doc
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const doc = await prisma.seoStrategyDoc.findFirst({
    where: { id, siteId },
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.seoStrategyDoc.findFirst({
    where: { id, siteId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, category, content, isActive, source } = body;

  const updated = await prisma.seoStrategyDoc.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(category !== undefined && { category }),
      ...(content !== undefined && { content, version: existing.version + 1 }),
      ...(isActive !== undefined && { isActive }),
      ...(source !== undefined && { source }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.seoStrategyDoc.findFirst({
    where: { id, siteId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.seoStrategyDoc.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
