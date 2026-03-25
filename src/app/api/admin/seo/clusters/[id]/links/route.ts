/**
 * GET  /api/admin/seo/clusters/[id]/links — Get internal link suggestions for a cluster
 * POST /api/admin/seo/clusters/[id]/links — Re-analyze and generate link suggestions
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { enforceClusterLinks } from "@/lib/topic-clusters";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const suggestions = await prisma.internalLinkSuggestion.findMany({
    where: { siteId, clusterId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ suggestions });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const suggestions = await enforceClusterLinks(siteId, params.id);
    return NextResponse.json({
      suggestions,
      message: `Found ${suggestions.length} link suggestions`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Link analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
