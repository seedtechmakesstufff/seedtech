/**
 * GET    /api/admin/seo/clusters/[id] — Get cluster detail with subtopics
 * PATCH  /api/admin/seo/clusters/[id] — Update cluster metadata / status
 * DELETE /api/admin/seo/clusters/[id] — Archive or delete a cluster
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const cluster = await prisma.keywordCluster.findFirst({
    where: { id: params.id, siteId },
    include: {
      subtopics: { orderBy: { priority: "desc" } },
      keywords: {
        select: {
          id: true,
          keyword: true,
          tier: true,
          currentPosition: true,
          clicks28d: true,
          impressions28d: true,
        },
        orderBy: { tier: "asc" },
      },
      linkSuggestions: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          subtopics: true,
          keywords: true,
          linkSuggestions: { where: { status: "pending" } },
          contentIdeas: true,
        },
      },
    },
  });

  if (!cluster) {
    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  }

  return NextResponse.json({ cluster });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const allowed = ["name", "pillarPage", "description", "status", "seedKeyword"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const cluster = await prisma.keywordCluster.updateMany({
    where: { id: params.id, siteId },
    data,
  });

  if (cluster.count === 0) {
    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  // Archive instead of hard delete (to preserve history)
  const result = await prisma.keywordCluster.updateMany({
    where: { id: params.id, siteId },
    data: { status: "archived" },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, archived: true });
}
