import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { encryptCredential, decryptCredential } from "@/lib/credential-encryption";
import { testWpCredentials } from "@/lib/wordpress-sync";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/integrations/wordpress/connect
 * Body: { siteUrl, username, appPassword, pathPrefix? }
 * Tests credentials, encrypts, upserts IntegrationCredential.
 *
 * DELETE /api/admin/integrations/wordpress/connect
 * Deactivates the WordPress credential for the active site.
 */

interface ConnectBody {
  siteUrl: string;
  username: string;
  appPassword: string;
  pathPrefix?: string;
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  let body: ConnectBody;
  try {
    body = (await req.json()) as ConnectBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { siteUrl, username, appPassword, pathPrefix } = body;
  if (!siteUrl || !username || !appPassword) {
    return NextResponse.json({ error: "siteUrl, username, and appPassword are required" }, { status: 400 });
  }

  // Normalize: strip trailing slash
  const normalizedUrl = siteUrl.replace(/\/$/, "");

  // Test before saving
  const test = await testWpCredentials({ siteUrl: normalizedUrl, username, appPassword, pathPrefix });
  if (!test.ok) {
    return NextResponse.json({ error: `Connection failed: ${test.error}` }, { status: 422 });
  }

  // Encrypt and store
  const payload = JSON.stringify({ siteUrl: normalizedUrl, username, appPassword, pathPrefix: pathPrefix ?? "/blog" });
  const encrypted = encryptCredential(payload);

  await prisma.integrationCredential.upsert({
    where: { siteId_type: { siteId: ctx.siteId, type: "wordpress" } },
    update: { encryptedCredentials: encrypted, isActive: true, authType: "api-key", property: normalizedUrl },
    create: {
      siteId: ctx.siteId,
      type: "wordpress",
      authType: "api-key",
      property: normalizedUrl,
      encryptedCredentials: encrypted,
      isActive: true,
    },
  });

  return NextResponse.json({ ok: true, siteTitle: test.siteTitle });
}

export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  await prisma.integrationCredential.updateMany({
    where: { siteId: ctx.siteId, type: "wordpress" },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const cred = await prisma.integrationCredential.findUnique({
    where: { siteId_type: { siteId: ctx.siteId, type: "wordpress" } },
    select: { isActive: true, property: true, updatedAt: true, encryptedCredentials: true },
  });

  if (!cred || !cred.isActive) {
    return NextResponse.json({ connected: false });
  }

  // Return masked info (no credentials)
  let postCount = 0;
  try {
    postCount = await prisma.blogPost.count({
      where: { siteId: ctx.siteId, wordPressSiteUrl: { not: null } },
    });
  } catch {}

  // Decode pathPrefix from credential for display
  let pathPrefix = "/blog";
  if (cred.encryptedCredentials) {
    try {
      const raw = decryptCredential(cred.encryptedCredentials);
      const parsed = JSON.parse(raw) as { pathPrefix?: string };
      pathPrefix = parsed.pathPrefix ?? "/blog";
    } catch {}
  }

  return NextResponse.json({
    connected: true,
    siteUrl: cred.property,
    pathPrefix,
    postCount,
    lastSyncAt: cred.updatedAt,
  });
}
