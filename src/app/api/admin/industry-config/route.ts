import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext, requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET /api/admin/industry-config — Get industry config for current site
 * PUT /api/admin/industry-config — Upsert industry config
 */

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const config = await prisma.industryConfig.findUnique({
    where: { siteId },
  });

  // Return empty defaults if no config exists yet
  return NextResponse.json({
    config: config || {
      siteId,
      industry: "general",
      credentialKeywords: [],
      geographicTerms: [],
      knownEntities: [],
      authorityDomains: [],
    },
  });
}

export async function PUT(req: NextRequest) {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { industry, credentialKeywords, geographicTerms, knownEntities, authorityDomains } = body;

  const config = await prisma.industryConfig.upsert({
    where: { siteId },
    update: {
      ...(industry !== undefined && { industry }),
      ...(credentialKeywords !== undefined && { credentialKeywords }),
      ...(geographicTerms !== undefined && { geographicTerms }),
      ...(knownEntities !== undefined && { knownEntities }),
      ...(authorityDomains !== undefined && { authorityDomains }),
    },
    create: {
      siteId,
      industry: industry || "general",
      credentialKeywords: credentialKeywords || [],
      geographicTerms: geographicTerms || [],
      knownEntities: knownEntities || [],
      authorityDomains: authorityDomains || [],
    },
  });

  return NextResponse.json({ config });
}
