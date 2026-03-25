import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * PUT    /api/admin/authors/[id] — Update an author
 * DELETE /api/admin/authors/[id] — Delete an author
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("editor");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.author.findFirst({ where: { id, siteId } });
  if (!existing) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, slug, jobTitle, bio, imageUrl, canonicalUrl, sameAs, expertise, credentials, experience, isDefault } = body;

  // If setting as default, unset existing default
  if (isDefault && !existing.isDefault) {
    await prisma.author.updateMany({
      where: { siteId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const author = await prisma.author.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") }),
      ...(jobTitle !== undefined && { jobTitle }),
      ...(bio !== undefined && { bio }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(canonicalUrl !== undefined && { canonicalUrl }),
      ...(sameAs !== undefined && { sameAs }),
      ...(expertise !== undefined && { expertise }),
      ...(credentials !== undefined && { credentials }),
      ...(experience !== undefined && { experience }),
      ...(isDefault !== undefined && { isDefault }),
    },
  });

  return NextResponse.json({ author });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.author.findFirst({ where: { id, siteId } });
  if (!existing) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  await prisma.author.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
