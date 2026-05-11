/* ── Agent Manual-Trigger Rate Limit ──
 * Shared limiter applied to every POST /api/admin/agents/* route to prevent
 * accidental loops or runaway costs. Keyed by siteId so multi-tenant traffic
 * doesn't share a bucket.
 *
 * Defaults:
 *   - 10 manual agent runs per minute per site
 *   - 60 per hour per site (hard ceiling on accidental loops)
 *
 * Tune via env if needed:
 *   AGENT_RATE_PER_MIN, AGENT_RATE_PER_HOUR
 */

import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const PER_MIN_LIMIT = Number(process.env.AGENT_RATE_PER_MIN ?? 10);
const PER_HOUR_LIMIT = Number(process.env.AGENT_RATE_PER_HOUR ?? 60);

const minuteLimiter = rateLimit({ interval: 60_000, limit: PER_MIN_LIMIT });
const hourLimiter = rateLimit({ interval: 3_600_000, limit: PER_HOUR_LIMIT });

/**
 * Returns null when the request is allowed; otherwise a 429 NextResponse.
 * Caller should:
 *   const limited = checkAgentRateLimit(siteId);
 *   if (limited) return limited;
 */
export function checkAgentRateLimit(siteId: string): NextResponse | null {
  const minuteKey = `min:${siteId}`;
  const hourKey = `hr:${siteId}`;
  const m = minuteLimiter.check(minuteKey);
  if (m.limited) {
    return NextResponse.json(
      { error: "Too many agent runs in the last minute. Wait a moment and try again." },
      { status: 429 }
    );
  }
  const h = hourLimiter.check(hourKey);
  if (h.limited) {
    return NextResponse.json(
      { error: "Hourly agent-run cap reached. Wait until the next hour." },
      { status: 429 }
    );
  }
  return null;
}
