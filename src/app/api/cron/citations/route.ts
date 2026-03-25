/* ── Citation Check Cron Job ──
 *
 * Endpoint: GET /api/cron/citations
 *
 * Runs an automated citation check for one site (?siteId=xxx) or ALL active sites.
 * Queries AI platforms (Perplexity, ChatGPT, simulated Google AIO/Gemini/Copilot)
 * to detect brand mentions and URL citations.
 *
 * Auth: Requires CRON_SECRET header.
 *
 * Recommended schedule: Weekly, offset from the main SEO cron.
 *   { "crons": [{ "path": "/api/cron/citations", "schedule": "0 6 * * 3" }] }
 *   → Every Wednesday at 6 AM UTC
 */

import { NextRequest, NextResponse } from "next/server";
import {
  authenticateCron,
  getCronSiteId,
  getAllActiveSiteIds,
  runTrackedJob,
} from "@/lib/cron-runner";
import { runCitationCheck } from "@/lib/citation-checker";

export async function GET(req: NextRequest) {
  /* ── Auth ── */
  const authErr = authenticateCron(req);
  if (authErr) return authErr;

  // Determine target sites
  const requestedSiteId = getCronSiteId(req);
  const siteIds = requestedSiteId
    ? [requestedSiteId]
    : await getAllActiveSiteIds();

  const allResults: Record<string, unknown> = {};

  for (const siteId of siteIds) {
    const result = await runTrackedJob(siteId, "citation-check", async () => {
      return runCitationCheck({
        siteId,
        maxQueries: 20,
        includeCompetitors: true,
      });
    });

    allResults[siteId] = result;
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    sites: allResults,
  });
}
