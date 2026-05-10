/* ── Sales Rep Gate API ──
 * POST /api/sales-rep-gate — validates email + access code server-side.
 * Password is read from SALES_REP_GATE_PASSWORD env var (never exposed to client).
 * Fires a lead notification email on success.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = body as { email?: string; password?: string };

  // Validate email format
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  // Validate access code against server-side env var only
  const gatePassword = process.env.SALES_REP_GATE_PASSWORD;
  if (!gatePassword) {
    console.error("[sales-rep-gate] SALES_REP_GATE_PASSWORD env var is not set.");
    return NextResponse.json({ error: "Access gate is not configured. Contact SeedTech." }, { status: 500 });
  }

  if (!password || password.trim() !== gatePassword) {
    return NextResponse.json({ error: "Incorrect access code." }, { status: 401 });
  }

  // Fire-and-forget lead notification to admin
  const adminEmails = (process.env.EMAIL_NOTIFY ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    sendEmail({
      to: adminEmails,
      subject: `🔓 Sales Rep Page Unlocked — ${email}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f4f4f5;border-radius:12px;">
          <h2 style="margin:0 0 8px;font-size:18px;color:#111827;">Sales Rep Page Unlocked</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#374151;">
            <strong>${email}</strong> entered the correct access code and unlocked the compensation details on <code>/work-with-seedtech</code>.
          </p>
          <p style="margin:0;font-size:12px;color:#9ca3af;">Automated lead notification · SeedTech</p>
        </div>
      `,
    }).catch((err) => console.error("[sales-rep-gate] Email notification error:", err));
  }

  return NextResponse.json({ success: true });
}
