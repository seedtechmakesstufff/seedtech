/**
 * GET  /api/admin/email/config  — fetch current email config (DB merged with env fallbacks)
 * PATCH /api/admin/email/config — upsert the email config row
 */
import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const cfg = await prisma.emailConfig.findUnique({ where: { siteId } });

  // Return DB values if set, otherwise show env var fallbacks so the UI
  // can pre-populate the fields with whatever is already active.
  return NextResponse.json({
    fromAddress:      cfg?.fromAddress      || process.env.EMAIL_FROM        || "",
    notifyRecipients: cfg?.notifyRecipients || process.env.EMAIL_NOTIFY      || process.env.ADMIN_EMAILS || "",
    reportFromEmail:  cfg?.reportFromEmail  || process.env.REPORT_FROM_EMAIL || "",
    reportToEmail:    cfg?.reportToEmail    || process.env.REPORT_TO_EMAIL   || "",
    // Tell the UI where the value is coming from
    sourceFromAddress:      cfg?.fromAddress      ? "db" : process.env.EMAIL_FROM        ? "env" : "none",
    sourceNotifyRecipients: cfg?.notifyRecipients ? "db" : (process.env.EMAIL_NOTIFY || process.env.ADMIN_EMAILS) ? "env" : "none",
    sourceReportFrom:       cfg?.reportFromEmail  ? "db" : process.env.REPORT_FROM_EMAIL ? "env" : "none",
    sourceReportTo:         cfg?.reportToEmail    ? "db" : process.env.REPORT_TO_EMAIL   ? "env" : "none",
  });
}

export async function PATCH(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { fromAddress, notifyRecipients, reportFromEmail, reportToEmail } = body;

  const result = await prisma.emailConfig.upsert({
    where:  { siteId },
    update: {
      ...(fromAddress      !== undefined && { fromAddress }),
      ...(notifyRecipients !== undefined && { notifyRecipients }),
      ...(reportFromEmail  !== undefined && { reportFromEmail }),
      ...(reportToEmail    !== undefined && { reportToEmail }),
    },
    create: {
      siteId,
      fromAddress:      fromAddress      ?? process.env.EMAIL_FROM        ?? "",
      notifyRecipients: notifyRecipients ?? process.env.EMAIL_NOTIFY      ?? process.env.ADMIN_EMAILS ?? "",
      reportFromEmail:  reportFromEmail  ?? process.env.REPORT_FROM_EMAIL ?? "",
      reportToEmail:    reportToEmail    ?? process.env.REPORT_TO_EMAIL   ?? "",
    },
  });

  return NextResponse.json(result);
}
