/**
 * /api/admin/seo/settings/default-og-image
 *
 * GET    — returns { defaultOgImageUrl: string | null }
 * POST   — multipart upload, stores in Vercel Blob, updates Site.defaultOgImageUrl
 * DELETE — removes blob + clears field
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── GET — Fetch current default OG image ─────────────────────
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { defaultOgImageUrl: true },
  });

  return NextResponse.json({ defaultOgImageUrl: site?.defaultOgImageUrl ?? null });
}

// ── POST — Upload default OG image ──────────────────────────
export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = formData.get("ogImage");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided (field name: ogImage)" }, { status: 400 });
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Allowed: PNG, JPEG, WebP, GIF.` },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds 5 MB limit." }, { status: 400 });
  }

  // Delete old blob if one exists
  const existing = await prisma.site.findUnique({
    where: { id: siteId },
    select: { defaultOgImageUrl: true },
  });
  if (existing?.defaultOgImageUrl && existing.defaultOgImageUrl.startsWith("http")) {
    try {
      await del(existing.defaultOgImageUrl);
    } catch {
      /* already gone */
    }
  }

  // Upload to Vercel Blob
  const ext = file.name.split(".").pop() ?? "png";
  const pathname = `og-images/${siteId}/default-og.${ext}`;
  const blob = await put(pathname, file, { access: "public", contentType: file.type });

  // Update Site record
  await prisma.site.update({
    where: { id: siteId },
    data: { defaultOgImageUrl: blob.url },
  });

  return NextResponse.json({
    defaultOgImageUrl: blob.url,
    recommended: { width: 1200, height: 630 },
  });
}

// ── DELETE — Remove default OG image ─────────────────────────
export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const existing = await prisma.site.findUnique({
    where: { id: siteId },
    select: { defaultOgImageUrl: true },
  });

  if (existing?.defaultOgImageUrl && existing.defaultOgImageUrl.startsWith("http")) {
    try {
      await del(existing.defaultOgImageUrl);
    } catch {
      /* already gone */
    }
  }

  await prisma.site.update({
    where: { id: siteId },
    data: { defaultOgImageUrl: null },
  });

  return NextResponse.json({ success: true });
}
