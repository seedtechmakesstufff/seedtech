import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext, requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/authors — List authors for the current site
 * POST /api/admin/authors — Create a new author
 */

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const authors = await prisma.author.findMany({
    where: { siteId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({ authors });
}

export async function POST(req: NextRequest) {
  const ctx = await requireRole("editor");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { name, slug, jobTitle, bio, imageUrl, canonicalUrl, sameAs, expertise, credentials, experience, isDefault } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  // If setting as default, unset any existing default
  if (isDefault) {
    await prisma.author.updateMany({
      where: { siteId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const author = await prisma.author.create({
    data: {
      siteId,
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      jobTitle: jobTitle || "",
      bio: bio || "",
      imageUrl: imageUrl || null,
      canonicalUrl: canonicalUrl || "",
      sameAs: sameAs || [],
      expertise: expertise || [],
      credentials: credentials || [],
      experience: experience || "",
      isDefault: isDefault || false,
    },
  });

  return NextResponse.json({ author }, { status: 201 });
}
