/**
 * POST /api/admin/email/send-test
 * Sends a real test email via Resend to verify the full pipeline works.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { sendEmail, getEmailBranding } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { to, templateKey } = body;

  if (!to) {
    return NextResponse.json({ error: "Recipient email required" }, { status: 400 });
  }

  // Resolve branding for the current site
  const branding = await getEmailBranding(siteId);

  // Resolve logo — Vercel Blob URLs are already absolute public https:// URLs
  let logoUrl: string | null = null;
  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { siteId },
      select: { logoUrl: true },
    });
    logoUrl = profile?.logoUrl ?? null;
  } catch { /* use no logo */ }

  const label = (templateKey as string)?.replace(/_/g, " ") ?? "test";

  const headerContent = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" height="48" style="max-height:48px;max-width:240px;object-fit:contain;display:block;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#fff;">${branding.companyName || "Admin"}</span>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Test Email</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0e1117;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          ${headerContent}
        </td></tr>
        <tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;">
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0e1117;">✅ Test Email — ${label}</h1>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
            This is a test email sent from the admin panel to confirm that your Resend integration is working correctly.
          </p>
          <p style="font-size:14px;color:#6b7280;margin:0;">
            Sent at: <strong>${new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}</strong>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            ${branding.companyName}${branding.domain ? `<br /><a href="https://${branding.domain}" style="color:#4ade80;text-decoration:none;">${branding.domain}</a>` : ""}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to,
    subject: `[Test] ${branding.companyName || "Admin"} Email — ${label}`,
    html,
  });

  if (!result.success) {
    return NextResponse.json({ ok: false, message: result.error ?? "Send failed" });
  }

  return NextResponse.json({ ok: true, messageId: result.messageId, message: `Test email sent to ${to}` });
}
