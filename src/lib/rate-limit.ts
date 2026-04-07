/**
 * rate-limit.ts
 * ─────────────
 * Lightweight in-memory sliding-window rate limiter for API routes.
 *
 * Usage:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const limiter = rateLimit({ interval: 60_000, limit: 5 });
 *
 *   // Inside a route handler:
 *   const ip = req.headers.get("x-forwarded-for") ?? "unknown";
 *   const { limited } = limiter.check(ip);
 *   if (limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
 *
 * Notes:
 *  - In-memory only — resets on deploy / cold start. Good enough for Vercel serverless
 *    because each instance still independently limits bursts.
 *  - Auto-prunes stale entries every `interval` to prevent memory leaks.
 */

interface RateLimitOptions {
  /** Time window in milliseconds (e.g. 60_000 = 1 minute). */
  interval: number;
  /** Max requests per IP within the window. */
  limit: number;
}

interface TokenBucket {
  timestamps: number[];
}

export function rateLimit({ interval, limit }: RateLimitOptions) {
  const buckets = new Map<string, TokenBucket>();

  // Prune old entries periodically
  let lastPrune = Date.now();

  function prune(now: number) {
    if (now - lastPrune < interval) return;
    lastPrune = now;
    const keys = Array.from(buckets.keys());
    for (const key of keys) {
      const bucket = buckets.get(key)!;
      bucket.timestamps = bucket.timestamps.filter((t: number) => now - t < interval);
      if (bucket.timestamps.length === 0) buckets.delete(key);
    }
  }

  return {
    check(key: string): { limited: boolean; remaining: number } {
      const now = Date.now();
      prune(now);

      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { timestamps: [] };
        buckets.set(key, bucket);
      }

      // Remove timestamps outside the window
      bucket.timestamps = bucket.timestamps.filter((t: number) => now - t < interval);

      if (bucket.timestamps.length >= limit) {
        return { limited: true, remaining: 0 };
      }

      bucket.timestamps.push(now);
      return { limited: false, remaining: limit - bucket.timestamps.length };
    },
  };
}
