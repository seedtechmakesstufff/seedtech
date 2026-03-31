/**
 * /api/admin/seo/context-preview
 *
 * POST — Returns the full AI prompt that would be sent to Claude for a given page.
 * Used by the AI Context > Preview section to debug and inspect context quality.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { buildSeoContext } from "@/lib/seo-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { path } = body;

  if (!path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  // Get existing titles for context
  const existingMeta = await prisma.pageMetadata.findMany({
    where: { siteId, NOT: { path } },
    select: { title: true },
  });
  const existingTitles = existingMeta
    .map((m) => m.title)
    .filter(Boolean) as string[];

  const seoContext = await buildSeoContext({
    siteId,
    path,
    existingTitles,
  });

  return NextResponse.json({ prompt: seoContext.fullPrompt });
}
