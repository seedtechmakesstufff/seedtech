/* ── Weekly SEO Cron Job ──
 *
 * Endpoint: GET /api/cron/seo
 *
 * Runs a full SEO cycle:
 *   1. Take a health-score snapshot (GSC + PageSpeed)
 *   2. Run the on-page crawler
 *   3. Generate AI insights
 *   4. Build & send the weekly email report
 *
 * Auth: Requires CRON_SECRET header (set as env var).
 *       Vercel Cron automatically sends this header.
 *
 * Vercel cron config (vercel.json):
 *   { "crons": [{ "path": "/api/cron/seo", "schedule": "0 6 * * 1" }] }
 *   → Every Monday at 6 AM UTC
 */

import { NextRequest, NextResponse } from "next/server";
import { takeSnapshot } from "@/lib/seo-snapshot";
import { runCrawl } from "@/lib/seo-crawler";
import { generateAllInsights } from "@/lib/seo-insights";
import { sendReport } from "@/lib/seo-reports";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  /* ── Auth ── */
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  /* 1. Snapshot */
  try {
    results.snapshot = await takeSnapshot();
  } catch (e) {
    errors.push(`snapshot: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 2. Crawl */
  try {
    results.crawl = await runCrawl();
  } catch (e) {
    errors.push(`crawl: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 3. Insights */
  try {
    results.insights = await generateAllInsights();
  } catch (e) {
    errors.push(`insights: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 4. Email report */
  try {
    results.report = await sendReport();
  } catch (e) {
    errors.push(`report: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({
    ok: errors.length === 0,
    timestamp: new Date().toISOString(),
    results,
    errors: errors.length > 0 ? errors : undefined,
  });
}
