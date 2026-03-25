/**
 * GET  /api/admin/seo/clusters — List all topic clusters for the site
 * POST /api/admin/seo/clusters — Create a new cluster manually
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const clusters = await prisma.keywordCluster.findMany({
    where: { siteId },
    include: {
      subtopics: {
        orderBy: { priority: "desc" },
      },
      _count: {
        select: {
          keywords: true,
          subtopics: true,
          linkSuggestions: { where: { status: "pending" } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ clusters });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { name, pillarPage, description, seedKeyword } = body;

  if (!name || !pillarPage) {
    return NextResponse.json(
      { error: "name and pillarPage are required" },
      { status: 400 }
    );
  }

  const cluster = await prisma.keywordCluster.create({
    data: {
      siteId,
      name,
      pillarPage,
      description: description || null,
      seedKeyword: seedKeyword || "",
      status: "draft",
    },
  });

  return NextResponse.json({ cluster }, { status: 201 });
}
