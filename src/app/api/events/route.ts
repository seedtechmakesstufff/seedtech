import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { queryEvents, type EventSeverity } from "@/lib/events";

export const dynamic = "force-dynamic";

const VALID_SEVERITIES: EventSeverity[] = ["info", "warn", "critical"];

/**
 * GET /api/events
 * Query params:
 *   types=content.published,keyword.moved   (comma-separated)
 *   severity=warn,critical                  (comma-separated)
 *   since=2026-05-01                        (ISO date)
 *   until=2026-05-10                        (ISO date)
 *   entityType=BlogPost
 *   entityId=...
 *   limit=100 (max 500)
 *   offset=0
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const url = new URL(req.url);
  const sp = url.searchParams;

  const types = sp.get("types")?.split(",").map((s) => s.trim()).filter(Boolean);
  const severityList = sp.get("severity")?.split(",").map((s) => s.trim()).filter(Boolean);
  const severities = severityList?.filter((s): s is EventSeverity =>
    VALID_SEVERITIES.includes(s as EventSeverity)
  );

  const since = sp.get("since") ? new Date(sp.get("since")!) : undefined;
  const until = sp.get("until") ? new Date(sp.get("until")!) : undefined;
  const entityType = sp.get("entityType") ?? undefined;
  const entityId = sp.get("entityId") ?? undefined;
  const limit = Math.min(500, Math.max(1, parseInt(sp.get("limit") ?? "100", 10) || 100));
  const offset = Math.max(0, parseInt(sp.get("offset") ?? "0", 10) || 0);

  const events = await queryEvents({
    siteId: ctx.siteId,
    types,
    severities,
    since,
    until,
    entityType,
    entityId,
    limit,
    offset,
  });

  return NextResponse.json({ events, count: events.length });
}
