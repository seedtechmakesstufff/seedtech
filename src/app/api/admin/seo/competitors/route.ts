import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET    /api/admin/seo/competitors — List competitor domains
 * POST   /api/admin/seo/competitors — Add a competitor domain
 * DELETE /api/admin/seo/competitors — Remove a competitor domain (and its analyses)
 */

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const competitors = await prisma.competitorDomain.findMany({
    where: { siteId, isActive: true },
    orderBy: { overlapKeywords: "desc" },
  });

  return NextResponse.json({ competitors });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { domain, name, notes } = body;

  if (!domain || !name) {
    return NextResponse.json(
      { error: "domain and name are required" },
      { status: 400 }
    );
  }

  const competitor = await prisma.competitorDomain.upsert({
    where: { siteId_domain: { siteId, domain } },
    update: { name, notes, isActive: true },
    create: { siteId, domain, name, notes },
  });

  return NextResponse.json({ competitor });
}

export async function DELETE(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // Verify the competitor belongs to this site
  const existing = await prisma.competitorDomain.findFirst({
    where: { id, siteId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
  }

  // Delete associated analyses first (cascade should handle it, but be explicit)
  await prisma.competitorAnalysis.deleteMany({
    where: { competitorId: id, siteId },
  });

  // Delete the competitor domain
  await prisma.competitorDomain.delete({
    where: { id },
  });

  return NextResponse.json({ deleted: true });
}
