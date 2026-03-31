/**
 * /api/admin/seo/metadata/og-image
 *
 * POST   — multipart upload of OG image, stores in Vercel Blob, updates PageMetadata.ogImageUrl
 * DELETE — removes current OG image blob and clears ogImageUrl
 *
 * Body (POST):  FormData with field "ogImage" + field "path" (the page path)
 * Body (DELETE): JSON { path: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const RECOMMENDED_WIDTH = 1200;
const RECOMMENDED_HEIGHT = 630;

// ── POST — Upload OG image ──────────────────────────────────
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

  const pagePath = formData.get("path");
  if (typeof pagePath !== "string" || !pagePath) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
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
  const existing = await prisma.pageMetadata.findUnique({
    where: { siteId_path: { siteId, path: pagePath } },
    select: { ogImageUrl: true },
  });
  if (existing?.ogImageUrl && existing.ogImageUrl.startsWith("http")) {
    try {
      await del(existing.ogImageUrl);
    } catch {
      /* already gone */
    }
  }

  // Upload to Vercel Blob
  const ext = file.name.split(".").pop() ?? "png";
  const safePath = pagePath.replace(/[^a-z0-9-]/gi, "_");
  const pathname = `og-images/${siteId}/${safePath}_${Date.now()}.${ext}`;
  const blob = await put(pathname, file, { access: "public", contentType: file.type });

  // Upsert PageMetadata with the new ogImageUrl
  await prisma.pageMetadata.upsert({
    where: { siteId_path: { siteId, path: pagePath } },
    create: {
      siteId,
      path: pagePath,
      ogImageUrl: blob.url,
    },
    update: {
      ogImageUrl: blob.url,
    },
  });

  return NextResponse.json({
    ogImageUrl: blob.url,
    recommended: { width: RECOMMENDED_WIDTH, height: RECOMMENDED_HEIGHT },
  });
}

// ── DELETE — Remove OG image ─────────────────────────────────
export async function DELETE(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { path: pagePath } = body;

  if (!pagePath) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  const existing = await prisma.pageMetadata.findUnique({
    where: { siteId_path: { siteId, path: pagePath } },
    select: { ogImageUrl: true },
  });

  if (existing?.ogImageUrl && existing.ogImageUrl.startsWith("http")) {
    try {
      await del(existing.ogImageUrl);
    } catch {
      /* already gone */
    }
  }

  await prisma.pageMetadata.updateMany({
    where: { siteId, path: pagePath },
    data: { ogImageUrl: null },
  });

  return NextResponse.json({ success: true });
}
