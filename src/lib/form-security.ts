/**
 * form-security.ts
 * ────────────────
 * Shared server-side security checks for all public form API routes.
 *
 * Five layers:
 *  1. Rate limiting      — max 5 submissions per IP per 60s
 *  2. Honeypot           — hidden field `website_url` must be empty
 *  3. Timing guard       — form must take ≥ 2 seconds to fill out
 *  4. Content validation — name/message must look like human input (not random strings)
 *  5. reCAPTCHA v3       — Google bot score must be ≥ 0.5 (0=bot, 1=human)
 *
 * Usage in a route:
 *   import { validateFormSecurity, getClientIp } from "@/lib/form-security";
 *
 *   const ip = getClientIp(req);
 *   const rejection = await validateFormSecurity(ip, body);
 *   if (rejection) return rejection;
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

function shannonEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const ch of str) freq[ch] = (freq[ch] ?? 0) + 1;
  return Object.values(freq).reduce((sum, count) => {
    const p = count / str.length;
    return sum - p * Math.log2(p);
  }, 0);
}

function looksRandom(value: string): boolean {
  if (!value || value.trim().length === 0) return false;
  const trimmed = value.trim();
  if (!trimmed.includes(" ") && trimmed.length > 15) return true;
  if (shannonEntropy(trimmed) > 4.4) return true;
  return false;
}

export async function validateFormSecurity(
  ip: string,
  body: Record<string, unknown>
): Promise<NextResponse | null> {
  // 1. Rate limiting
  const { limited } = formLimiter.check(ip);
  if (limited) {
    console.warn(`[form-security] Rate limited: ${ip}`);
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  // 2. Honeypot
  if (body.website_url) {
    console.warn(`[form-security] Honeypot triggered: ${ip}`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }

  // 3. Timing guard
  const startedAt = typeof body._started === "number" ? body._started : 0;
  if (startedAt > 0 && Date.now() - startedAt < 2000) {
    console.warn(`[form-security] Too fast: ${ip}`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }

  // 4. Content validation
  const name = typeof body.fullName === "string" ? body.fullName : "";
  const message = typeof body.message === "string" ? body.message : "";
  const company = typeof body.company === "string" ? body.company : "";

  if (name && !name.trim().includes(" ")) {
    console.warn(`[form-security] Name has no space: ${ip} — "${name}"`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }
  if (name && looksRandom(name)) {
    console.warn(`[form-security] Name looks random: ${ip} — "${name}"`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }
  if (message && looksRandom(message)) {
    console.warn(`[form-security] Message looks random: ${ip} — "${message}"`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }
  if (company && looksRandom(company)) {
    console.warn(`[form-security] Company looks random: ${ip} — "${company}"`);
    return NextResponse.json({ success: true, id: "ok" }, { status: 200 });
  }

  // 5. reCAPTCHA v3 — checked separately per-route via verifyRecaptcha()
  // (contact route calls it directly; this layer is a no-op here)

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
