import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/competitors — List competitor domains
 * POST /api/admin/seo/competitors — Add a competitor domain
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
