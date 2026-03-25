/* ── Cron: Deep Crawl ──
 * GET /api/cron/crawl?siteId=xxx
 * Runs the on-page crawler for one or all sites.
 */

import { NextRequest, NextResponse } from "next/server";
import { runCrawl } from "@/lib/seo-crawler";
import { authenticateCron, getCronSiteId, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";

export async function GET(req: NextRequest) {
  const authErr = authenticateCron(req);
  if (authErr) return authErr;

  const requestedSiteId = getCronSiteId(req);
  const siteIds = requestedSiteId ? [requestedSiteId] : await getAllActiveSiteIds();

  const results: Record<string, unknown> = {};
  for (const siteId of siteIds) {
    results[siteId] = await runTrackedJob(siteId, "crawl", () => runCrawl(siteId));
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), results });
}
