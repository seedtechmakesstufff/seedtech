import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * POST   /api/admin/seo/context-nodes/[id]/link — Link pages to this node
 *        Body: { links: [{ pageContextId, relevance }] }
 * DELETE /api/admin/seo/context-nodes/[id]/link — Unlink a page from this node
 *        Body: { pageContextId }
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id: contextNodeId } = await params;

  // Verify node ownership
  const node = await prisma.contextNode.findFirst({
    where: { id: contextNodeId, siteId },
  });
  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  const body = await req.json();
  const { links } = body as {
    links: { pageContextId: string; relevance?: string }[];
  };

  if (!Array.isArray(links) || links.length === 0) {
    return NextResponse.json({ error: "links array is required" }, { status: 400 });
  }

  // Upsert each link
  const results = await Promise.allSettled(
    links.map((link) =>
      prisma.pageContextNode.upsert({
        where: {
          pageContextId_contextNodeId: {
            pageContextId: link.pageContextId,
            contextNodeId,
          },
        },
        update: {
          relevance: link.relevance || "primary",
        },
        create: {
          pageContextId: link.pageContextId,
          contextNodeId,
          relevance: link.relevance || "primary",
        },
      })
    )
  );

  const linked = results.filter((r) => r.status === "fulfilled").length;

  // Return updated node
  const updated = await prisma.contextNode.findUnique({
    where: { id: contextNodeId },
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { id: true, path: true, pageType: true } },
        },
      },
    },
  });

  return NextResponse.json({ node: updated, linked });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id: contextNodeId } = await params;

  // Verify node ownership
  const node = await prisma.contextNode.findFirst({
    where: { id: contextNodeId, siteId },
  });
  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  const body = await req.json();
  const { pageContextId } = body;

  if (!pageContextId) {
    return NextResponse.json({ error: "pageContextId is required" }, { status: 400 });
  }

  await prisma.pageContextNode.deleteMany({
    where: { pageContextId, contextNodeId },
  });

  // Return updated node
  const updated = await prisma.contextNode.findUnique({
    where: { id: contextNodeId },
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { id: true, path: true, pageType: true } },
        },
      },
    },
  });

  return NextResponse.json({ node: updated });
}
