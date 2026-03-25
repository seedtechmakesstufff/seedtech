/* ── Cron: Weekly Snapshot ──
 * GET /api/cron/snapshot?siteId=xxx
 * Takes a GSC + PageSpeed health snapshot for one or all sites.
 */

import { NextRequest, NextResponse } from "next/server";
import { takeSnapshot } from "@/lib/seo-snapshot";
import { authenticateCron, getCronSiteId, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";

export async function GET(req: NextRequest) {
  const authErr = authenticateCron(req);
  if (authErr) return authErr;

  const requestedSiteId = getCronSiteId(req);
  const siteIds = requestedSiteId ? [requestedSiteId] : await getAllActiveSiteIds();

  const results: Record<string, unknown> = {};
  for (const siteId of siteIds) {
    results[siteId] = await runTrackedJob(siteId, "snapshot", () => takeSnapshot(siteId));
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), results });
}
