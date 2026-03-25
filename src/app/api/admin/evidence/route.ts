import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext, requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/evidence — List experience evidence for the current site
 * POST /api/admin/evidence — Create new evidence
 */

export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const typeFilter = req.nextUrl.searchParams.get("type");

  const evidence = await prisma.experienceEvidence.findMany({
    where: {
      siteId,
      ...(typeFilter ? { type: typeFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ evidence });
}

export async function POST(req: NextRequest) {
  const ctx = await requireRole("editor");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { type, title, content, source, tags, isPublic } = body;

  if (!type || !title || !content) {
    return NextResponse.json(
      { error: "type, title, and content are required" },
      { status: 400 }
    );
  }

  const validTypes = ["case_study", "metric", "testimonial", "certification", "process"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const item = await prisma.experienceEvidence.create({
    data: {
      siteId,
      type,
      title,
      content,
      source: source || null,
      tags: tags || [],
      isPublic: isPublic ?? true,
    },
  });

  return NextResponse.json({ evidence: item }, { status: 201 });
}
