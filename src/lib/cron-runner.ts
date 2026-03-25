/* ── Cron Job Runner ──
 * Shared utilities for running and tracking cron jobs.
 * Every cron endpoint creates a CronJobRun record, executes,
 * then updates with completion/error status + duration.
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Authenticate a cron request.
 * Accepts Bearer token via Authorization header.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export function authenticateCron(req: NextRequest): NextResponse | null {
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Get the siteId from the request.
 * Cron jobs can specify ?siteId=xxx or default to processing all active sites.
 */
export function getCronSiteId(req: NextRequest): string | null {
  return req.nextUrl.searchParams.get("siteId");
}

/**
 * Get all active site IDs from the database.
 */
export async function getAllActiveSiteIds(): Promise<string[]> {
  const sites = await prisma.site.findMany({
    select: { id: true },
  });
  return sites.map((s) => s.id);
}

/**
 * Run a tracked cron job for a specific site.
 * Creates a CronJobRun record, executes the job function,
 * then updates the record with results.
 */
export async function runTrackedJob<T>(
  siteId: string,
  jobType: string,
  jobFn: () => Promise<T>
): Promise<{ success: boolean; result?: T; error?: string; durationMs: number }> {
  const startedAt = new Date();

  const run = await prisma.cronJobRun.create({
    data: {
      siteId,
      jobType,
      status: "running",
      startedAt,
    },
  });

  try {
    const result = await jobFn();
    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    await prisma.cronJobRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        completedAt,
        durationMs,
        resultSummary: typeof result === "object" ? JSON.stringify(result).slice(0, 1000) : String(result),
      },
    });

    return { success: true, result, durationMs };
  } catch (e) {
    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();
    const errorMessage = e instanceof Error ? e.message : String(e);

    await prisma.cronJobRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        completedAt,
        durationMs,
        errorMessage,
      },
    });

    return { success: false, error: errorMessage, durationMs };
  }
}
