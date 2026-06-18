import { NextResponse } from "next/server";
import { checkTicketOpen } from "@/lib/firebase-helpdesk";

// firebase-admin needs the Node runtime (not Edge); never cache this.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Small in-memory rate limiter (per serverless instance) to blunt ticket-number
   enumeration. Generous enough for honest typos/retries. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { valid: false, reason: "rate_limited" },
      { status: 429 }
    );
  }

  let ticketNumber = "";
  try {
    const body = await req.json();
    ticketNumber =
      typeof body?.ticketNumber === "string" ? body.ticketNumber : "";
  } catch {
    return NextResponse.json(
      { valid: false, reason: "bad_request" },
      { status: 400 }
    );
  }

  if (!ticketNumber.trim()) {
    return NextResponse.json({ valid: false, reason: "not_found" });
  }

  try {
    const result = await checkTicketOpen(ticketNumber);
    if (result.ok) return NextResponse.json({ valid: true });
    return NextResponse.json({ valid: false, reason: result.reason });
  } catch (err) {
    // Misconfiguration or Firestore error — fail closed, but signal it's our
    // side so the UI can tell the visitor to call instead of "invalid ticket".
    console.error("[validate-ticket] lookup failed:", err);
    return NextResponse.json(
      { valid: false, reason: "error" },
      { status: 500 }
    );
  }
}
