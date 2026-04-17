/**
 * form-security.ts
 * ────────────────
 * Shared server-side security checks for all public form API routes.
 *
 * Three layers:
 *  1. Rate limiting   — max 5 submissions per IP per 60s
 *  2. Honeypot        — hidden field `website_url` must be empty
 *  3. Timing guard    — form must take ≥ 2 seconds to fill out
 *
 * Usage in a route:
 *   import { validateFormSecurity, getClientIp } from "@/lib/form-security";
 *
 *   const ip = getClientIp(req);
 *   const rejection = validateFormSecurity(ip, body);
 *   if (rejection) return rejection; // NextResponse 429 | 422
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit";

// Shared limiter instance — 5 form submissions per IP per 60 seconds
const formLimiter = rateLimit({ interval: 60_000, limit: 5 });

/** Extract the best-guess client IP from the request. */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Run all security checks against the parsed form body.
 * Returns a NextResponse if the submission should be rejected, or `null` if clean.
 */
export function validateFormSecurity(
  ip: string,
  body: Record<string, unknown>
): NextResponse | null {
  // ── 1. Rate limiting ──
  const { limited } = formLimiter.check(ip);
  if (limited) {
    console.warn(`[form-security] Rate limited: ${ip}`);
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  // ── 2. Honeypot — bots fill hidden fields ──
  // The frontend renders a hidden `website_url` field with tabindex=-1.
  // Humans never see or fill it. Bots auto-fill anything named "website_url".
  if (body.website_url) {
    console.warn(`[form-security] Honeypot triggered: ${ip}`);
    // Return 200 so the bot thinks it succeeded — don't educate it
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }

  // ── 3. Timing guard — reject instant submissions (< 2s) ──
  const startedAt = typeof body._started === "number" ? body._started : 0;
  if (startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < 2000) {
      console.warn(`[form-security] Too fast (${elapsed}ms): ${ip}`);
      return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
    }
  }

  return null; // All checks passed
}

/**
 * Verify a reCAPTCHA v3 token against Google's API.
 * Returns true if the score meets the threshold (≥ 0.5).
 * Returns true (graceful pass) if the secret key is not configured.
 */
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // Skip check if not configured

  if (!token) {
    console.warn("[form-security] reCAPTCHA token missing");
    return false;
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json() as { success: boolean; score?: number; "error-codes"?: string[] };

    if (!data.success) {
      console.warn("[form-security] reCAPTCHA failed:", data["error-codes"]);
      return false;
    }

    const score = data.score ?? 1;
    if (score < 0.5) {
      console.warn(`[form-security] reCAPTCHA low score: ${score}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[form-security] reCAPTCHA verification error:", err);
    return true; // Graceful pass on network error
  }
}
