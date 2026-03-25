/* ── Cron: AI Insights ──
 * GET /api/cron/insights?siteId=xxx
 * Generates AI insights (freshness, cannibalization, E-E-A-T, CTR) for one or all sites.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateAllInsights } from "@/lib/seo-insights";
import { authenticateCron, getCronSiteId, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";

export async function GET(req: NextRequest) {
  const authErr = authenticateCron(req);
  if (authErr) return authErr;

  const requestedSiteId = getCronSiteId(req);
  const siteIds = requestedSiteId ? [requestedSiteId] : await getAllActiveSiteIds();

  const results: Record<string, unknown> = {};
  for (const siteId of siteIds) {
    results[siteId] = await runTrackedJob(siteId, "insights", () => generateAllInsights(siteId));
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), results });
}
