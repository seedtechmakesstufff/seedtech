import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * PUT    /api/admin/evidence/[id] — Update evidence
 * DELETE /api/admin/evidence/[id] — Delete evidence
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("editor");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.experienceEvidence.findFirst({ where: { id, siteId } });
  if (!existing) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  const body = await req.json();
  const { type, title, content, source, tags, isPublic } = body;

  const item = await prisma.experienceEvidence.update({
    where: { id },
    data: {
      ...(type !== undefined && { type }),
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(source !== undefined && { source }),
      ...(tags !== undefined && { tags }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json({ evidence: item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireRole("admin");
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const existing = await prisma.experienceEvidence.findFirst({ where: { id, siteId } });
  if (!existing) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  await prisma.experienceEvidence.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
