/* POST /api/admin/integrations/gbp/artifacts/[id]/upload-image
 * Accepts a multipart/form-data upload with field "image".
 * Uploads the file to Vercel Blob, then writes the public URL back onto
 * the AgentArtifact payload as `uploadedImageUrl`.
 * Returns { ok: true, url: "https://..." } on success.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
// 10 MB limit — GBP recommends images ≥ 720px, typically < 5 MB
export const maxDuration = 30;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const artifact = await prisma.agentArtifact.findUnique({
    where: { id },
    select: { id: true, siteId: true, type: true, state: true, payload: true },
  });

  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }
  if (artifact.type !== "gbp_post_draft") {
    return NextResponse.json({ error: "Only gbp_post_draft artifacts accept images" }, { status: 400 });
  }
  if (artifact.state !== "pending_review") {
    return NextResponse.json({ error: "Can only upload images to pending artifacts" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("image");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const mimeType = file.type;
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are accepted" },
      { status: 400 }
    );
  }

  const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  const blobPath = `gbp-posts/${artifact.siteId}/${artifact.id}-${Date.now()}.${ext}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: mimeType,
  });

  // Merge uploadedImageUrl into the artifact payload (JSON merge)
  const existingPayload = (artifact.payload ?? {}) as Record<string, unknown>;
  const updatedPayload = { ...existingPayload, uploadedImageUrl: blob.url };

  await prisma.agentArtifact.update({
    where: { id },
    data: { payload: updatedPayload },
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
