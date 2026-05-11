import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Digest recipients are stored on EmailConfig.reportToEmail (comma-separated)
 * for simplicity — single source of truth, per-site, no per-user fanout.
 *
 * GET  → { recipients: string[], source: "email_config" | "fallback" }
 * PUT  → body { recipients: string[] }
 */

function parseList(s: string | null | undefined): string[] {
  return (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const config = await prisma.emailConfig.findUnique({
    where: { siteId: ctx.siteId },
    select: { reportToEmail: true },
  });
  const fromConfig = parseList(config?.reportToEmail);

  if (fromConfig.length > 0) {
    return NextResponse.json({ recipients: fromConfig, source: "email_config" });
  }
  // Fall back to env so the UI can show the effective recipient
  const fallback = process.env.WEEKLY_DIGEST_RECIPIENT
    ? [process.env.WEEKLY_DIGEST_RECIPIENT]
    : ["sswaynos@seedtechllc.com"];
  return NextResponse.json({ recipients: fallback, source: "fallback" });
}

export async function PUT(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const body = (await req.json().catch(() => ({}))) as { recipients?: string[] };
  if (!Array.isArray(body.recipients)) {
    return NextResponse.json({ error: "recipients must be an array of email strings" }, { status: 400 });
  }
  const cleaned = body.recipients
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  // Reject anything that doesn't look like an email — cheap sanity check
  for (const r of cleaned) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)) {
      return NextResponse.json({ error: `Invalid email: ${r}` }, { status: 400 });
    }
  }
  const reportToEmail = cleaned.join(",");

  await prisma.emailConfig.upsert({
    where: { siteId: ctx.siteId },
    update: { reportToEmail },
    create: { siteId: ctx.siteId, reportToEmail },
  });

  return NextResponse.json({ ok: true, recipients: cleaned });
}
