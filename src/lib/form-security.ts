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
