/* ── Crawl-to-Tasks Pipeline ──
 *
 * Converts crawl issues (SeoPageAudit) into actionable SeoTask records.
 *
 * Features:
 *   - Dedup: won't create duplicate tasks for same page + checkType
 *   - Auto-resolve: marks tasks as "done" when crawl issue disappears
 *   - Priority mapping: critical → high, warning → medium
 *   - Skips "pass" and "info" severity issues (not actionable)
 *   - Phase assignment: on-page fixes = phase 1, content = phase 2
 */

import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

/* ── Check Type → Task Metadata Mapping ── */

interface TaskTemplate {
  title: (url: string) => string;
  priority: "critical" | "high" | "medium" | "low";
  phase: number;
}

const TASK_TEMPLATES: Record<string, TaskTemplate> = {
  // Critical issues
  "missing-title": {
    title: (url) => `Add missing <title> tag on ${url}`,
    priority: "critical",
    phase: 1,
  },
  "missing-meta-description": {
    title: (url) => `Add missing meta description on ${url}`,
    priority: "critical",
    phase: 1,
  },
  "missing-h1": {
    title: (url) => `Add missing H1 heading on ${url}`,
    priority: "critical",
    phase: 1,
  },
  "fetch-failed": {
    title: (url) => `Fix unreachable page: ${url}`,
    priority: "critical",
    phase: 1,
  },
  "noindex-detected": {
    title: (url) => `Remove noindex directive from ${url}`,
    priority: "critical",
    phase: 1,
  },
  "broken-internal-link": {
    title: (url) => `Fix broken internal link on ${url}`,
    priority: "critical",
    phase: 1,
  },

  // High-priority warnings
  "thin-content": {
    title: (url) => `Expand thin content on ${url} (< 300 words)`,
    priority: "high",
    phase: 2,
  },
  "missing-og-tags": {
    title: (url) => `Add Open Graph tags to ${url}`,
    priority: "high",
    phase: 1,
  },
  "missing-canonical": {
    title: (url) => `Add canonical tag to ${url}`,
    priority: "high",
    phase: 1,
  },
  "no-structured-data": {
    title: (url) => `Add structured data (JSON-LD) to ${url}`,
    priority: "high",
    phase: 2,
  },
  "invalid-json-ld": {
    title: (url) => `Fix invalid JSON-LD structured data on ${url}`,
    priority: "high",
    phase: 1,
  },
  "duplicate-title": {
    title: (url) => `Fix duplicate title tag on ${url}`,
    priority: "high",
    phase: 1,
  },
  "duplicate-meta-description": {
    title: (url) => `Fix duplicate meta description on ${url}`,
    priority: "high",
    phase: 1,
  },
  "multiple-h1": {
    title: (url) => `Fix multiple H1 tags on ${url}`,
    priority: "high",
    phase: 1,
  },

  // Medium-priority improvements
  "short-title": {
    title: (url) => `Improve short title tag on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "long-title": {
    title: (url) => `Shorten overly long title on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "short-meta-description": {
    title: (url) => `Expand short meta description on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "long-meta-description": {
    title: (url) => `Shorten meta description on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "missing-alt-text": {
    title: (url) => `Add alt text to images on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "few-internal-links": {
    title: (url) => `Add more internal links on ${url}`,
    priority: "medium",
    phase: 2,
  },
  "missing-lang": {
    title: (url) => `Add lang attribute to ${url}`,
    priority: "medium",
    phase: 1,
  },
  "heading-hierarchy-broken": {
    title: (url) => `Fix heading hierarchy on ${url}`,
    priority: "medium",
    phase: 1,
  },
  "redirect-chain": {
    title: (url) => `Fix redirect chain for ${url}`,
    priority: "medium",
    phase: 1,
  },
  "content-duplication": {
    title: (url) => `Address content duplication on ${url}`,
    priority: "medium",
    phase: 2,
  },

  // Low-priority / nice-to-have
  "missing-viewport": {
    title: (url) => `Add viewport meta tag to ${url}`,
    priority: "low",
    phase: 1,
  },
  "bad-viewport": {
    title: (url) => `Fix viewport configuration on ${url}`,
    priority: "low",
    phase: 1,
  },
  "no-speakable": {
    title: (url) => `Add speakable structured data to ${url}`,
    priority: "low",
    phase: 2,
  },
  "unoptimized-image-format": {
    title: (url) => `Convert images to WebP/AVIF on ${url}`,
    priority: "low",
    phase: 2,
  },
  "missing-lazy-loading": {
    title: (url) => `Add lazy loading to images on ${url}`,
    priority: "low",
    phase: 2,
  },
};

/* ── Severities that generate tasks ── */
const ACTIONABLE_SEVERITIES = new Set(["critical", "warning"]);

/* ── Types ── */

export interface CrawlToTasksResult {
  tasksCreated: number;
  tasksAutoResolved: number;
  tasksSkippedDuplicate: number;
  totalIssuesProcessed: number;
}

/* ── Main Pipeline ── */

/**
 * Generate tasks from the latest crawl run.
 * Call this after a crawl completes.
 */
export async function generateTasksFromCrawl(
  runId: string,
  siteId: string = DEFAULT_SITE_ID
): Promise<CrawlToTasksResult> {
  // ── 1. Get all actionable issues from this crawl run ──
  const issues = await prisma.seoPageAudit.findMany({
    where: {
      siteId,
      runId,
      severity: { in: ["critical", "warning"] },
    },
  });

  // ── 2. Get existing open tasks for this site (for dedup) ──
  const existingTasks = await prisma.seoTask.findMany({
    where: {
      siteId,
      sourceType: "crawl",
      status: { in: ["not-started", "in-progress"] },
    },
  });

  // Build a dedup set: "url::checkType"
  const existingTaskKeys = new Set(
    existingTasks.map((t) => `${t.sourceUrl}::${t.sourceCheckType}`)
  );

  // ── 3. Create tasks for new issues ──
  let tasksCreated = 0;
  let tasksSkippedDuplicate = 0;

  for (const issue of issues) {
    if (!ACTIONABLE_SEVERITIES.has(issue.severity)) continue;

    const key = `${issue.url}::${issue.checkType}`;
    if (existingTaskKeys.has(key)) {
      tasksSkippedDuplicate++;
      continue;
    }

    const template = TASK_TEMPLATES[issue.checkType];
    if (!template) {
      // Unknown check type — create a generic task
      await prisma.seoTask.create({
        data: {
          siteId,
          phase: 1,
          title: `Fix ${issue.checkType} on ${shortenUrl(issue.url)}`,
          status: "not-started",
          priority: issue.severity === "critical" ? "critical" : "medium",
          sourceType: "crawl",
          sourceUrl: issue.url,
          sourceCheckType: issue.checkType,
          sourceRunId: runId,
        },
      });
      tasksCreated++;
      existingTaskKeys.add(key); // prevent duplicates within same batch
      continue;
    }

    await prisma.seoTask.create({
      data: {
        siteId,
        phase: template.phase,
        title: template.title(shortenUrl(issue.url)),
        status: "not-started",
        priority: template.priority,
        sourceType: "crawl",
        sourceUrl: issue.url,
        sourceCheckType: issue.checkType,
        sourceRunId: runId,
      },
    });
    tasksCreated++;
    existingTaskKeys.add(key);
  }

  // ── 4. Auto-resolve tasks for issues that no longer exist ──
  // Find open crawl-sourced tasks whose issue wasn't found in this run
  const currentIssueKeys = new Set(
    issues.map((i) => `${i.url}::${i.checkType}`)
  );

  let tasksAutoResolved = 0;

  for (const task of existingTasks) {
    const taskKey = `${task.sourceUrl}::${task.sourceCheckType}`;
    if (!currentIssueKeys.has(taskKey)) {
      await prisma.seoTask.update({
        where: { id: task.id },
        data: {
          status: "done",
          autoResolved: true,
        },
      });
      tasksAutoResolved++;
    }
  }

  return {
    tasksCreated,
    tasksAutoResolved,
    tasksSkippedDuplicate,
    totalIssuesProcessed: issues.length,
  };
}

/**
 * Generate tasks from the most recent completed crawl run.
 * Convenience method — finds the latest run automatically.
 */
export async function generateTasksFromLatestCrawl(
  siteId: string = DEFAULT_SITE_ID
): Promise<CrawlToTasksResult | null> {
  const latestRun = await prisma.seoCrawlRun.findFirst({
    where: { siteId, status: "completed" },
    orderBy: { createdAt: "desc" },
  });

  if (!latestRun) return null;

  return generateTasksFromCrawl(latestRun.runId, siteId);
}

/* ── Helpers ── */

/** Shorten a full URL to just the path for readable task titles */
function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname || "/";
  } catch {
    return url;
  }
}
