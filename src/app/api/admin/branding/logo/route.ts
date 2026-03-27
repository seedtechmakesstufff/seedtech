/**
 * /api/admin/branding/logo
 *
 * GET    — returns { logoUrl: string | null }
 * POST   — multipart upload, stores in Vercel Blob, saves public URL to BusinessProfile
 * DELETE — deletes blob and clears logoUrl
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── GET ──────────────────────────────────────────────────────
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const profile = await prisma.businessProfile.findUnique({
    where: { siteId },
    select: { logoUrl: true },
  });

  return NextResponse.json({ logoUrl: profile?.logoUrl ?? null });
}

// ── POST ─────────────────────────────────────────────────────
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

  const file = formData.get("logo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided (field name: logo)" }, { status: 400 });
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Allowed: PNG, JPEG, WebP, SVG, GIF.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds 5 MB limit." }, { status: 400 });
  }

  // Delete old blob if one exists
  const existing = await prisma.businessProfile.findUnique({
    where: { siteId },
    select: { logoUrl: true },
  });
  if (existing?.logoUrl) {
    try { await del(existing.logoUrl); } catch { /* already gone */ }
  }

  // Upload to Vercel Blob — pathname is the blob key, access must be public
  const ext = file.name.split(".").pop() ?? "png";
  const pathname = `logos/${siteId}_${Date.now()}.${ext}`;
  const blob = await put(pathname, file, { access: "public", contentType: file.type });

  // Persist the permanent public URL
  await prisma.businessProfile.upsert({
    where: { siteId },
    update: { logoUrl: blob.url },
    create: { siteId, companyName: "", logoUrl: blob.url },
  });

  return NextResponse.json({ logoUrl: blob.url });
}

// ── DELETE ───────────────────────────────────────────────────
export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const profile = await prisma.businessProfile.findUnique({
    where: { siteId },
    select: { logoUrl: true },
  });

  if (profile?.logoUrl) {
    try { await del(profile.logoUrl); } catch { /* already gone */ }
    await prisma.businessProfile.update({
      where: { siteId },
      data: { logoUrl: null },
    });
  }

  return NextResponse.json({ success: true });
}
