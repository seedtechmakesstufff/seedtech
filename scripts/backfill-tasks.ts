/**
 * Generate tasks from the latest crawl run (backfill)
 * Run: npx tsx scripts/backfill-tasks.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

/* ── Task templates (simplified) ── */
const TASK_TEMPLATES: Record<string, { title: (url: string) => string; priority: string; phase: number }> = {
  "missing-title": { title: (u) => `Add missing <title> tag on ${u}`, priority: "critical", phase: 1 },
  "missing-meta-description": { title: (u) => `Add missing meta description on ${u}`, priority: "critical", phase: 1 },
  "missing-h1": { title: (u) => `Add missing H1 heading on ${u}`, priority: "critical", phase: 1 },
  "fetch-failed": { title: (u) => `Fix unreachable page: ${u}`, priority: "critical", phase: 1 },
  "noindex-detected": { title: (u) => `Remove noindex directive from ${u}`, priority: "critical", phase: 1 },
  "broken-internal-link": { title: (u) => `Fix broken internal link on ${u}`, priority: "critical", phase: 1 },
  "thin-content": { title: (u) => `Expand thin content on ${u}`, priority: "high", phase: 2 },
  "missing-og-tags": { title: (u) => `Add Open Graph tags to ${u}`, priority: "high", phase: 1 },
  "missing-canonical": { title: (u) => `Add canonical tag to ${u}`, priority: "high", phase: 1 },
  "no-structured-data": { title: (u) => `Add structured data (JSON-LD) to ${u}`, priority: "high", phase: 2 },
  "invalid-json-ld": { title: (u) => `Fix invalid JSON-LD on ${u}`, priority: "high", phase: 1 },
  "duplicate-title": { title: (u) => `Fix duplicate title on ${u}`, priority: "high", phase: 1 },
  "duplicate-meta-description": { title: (u) => `Fix duplicate meta description on ${u}`, priority: "high", phase: 1 },
  "multiple-h1": { title: (u) => `Fix multiple H1 tags on ${u}`, priority: "high", phase: 1 },
  "short-title": { title: (u) => `Improve short title on ${u}`, priority: "medium", phase: 1 },
  "long-title": { title: (u) => `Shorten long title on ${u}`, priority: "medium", phase: 1 },
  "short-meta-description": { title: (u) => `Expand short meta description on ${u}`, priority: "medium", phase: 1 },
  "long-meta-description": { title: (u) => `Shorten meta description on ${u}`, priority: "medium", phase: 1 },
  "missing-alt-text": { title: (u) => `Add alt text to images on ${u}`, priority: "medium", phase: 1 },
  "few-internal-links": { title: (u) => `Add more internal links on ${u}`, priority: "medium", phase: 2 },
  "missing-lang": { title: (u) => `Add lang attribute to ${u}`, priority: "medium", phase: 1 },
  "heading-hierarchy-broken": { title: (u) => `Fix heading hierarchy on ${u}`, priority: "medium", phase: 1 },
  "redirect-chain": { title: (u) => `Fix redirect chain for ${u}`, priority: "medium", phase: 1 },
  "content-duplication": { title: (u) => `Address content duplication on ${u}`, priority: "medium", phase: 2 },
  "missing-viewport": { title: (u) => `Add viewport meta tag to ${u}`, priority: "low", phase: 1 },
  "bad-viewport": { title: (u) => `Fix viewport on ${u}`, priority: "low", phase: 1 },
  "no-speakable": { title: (u) => `Add speakable data to ${u}`, priority: "low", phase: 2 },
  "unoptimized-image-format": { title: (u) => `Convert images to WebP on ${u}`, priority: "low", phase: 2 },
  "missing-lazy-loading": { title: (u) => `Add lazy loading on ${u}`, priority: "low", phase: 2 },
};

function shortenUrl(url: string): string {
  try { return new URL(url).pathname || "/"; } catch { return url; }
}

async function main() {
  // Get latest crawl run
  const latestRun = await prisma.seoCrawlRun.findFirst({
    where: { siteId: SITE_ID, status: "completed" },
    orderBy: { createdAt: "desc" },
  });

  if (!latestRun) {
    console.log("No completed crawl runs found.");
    return;
  }

  console.log(`Using crawl run: ${latestRun.runId} (${latestRun.createdAt.toISOString()})`);
  console.log(`Issues: ${latestRun.criticalCount} critical, ${latestRun.warningCount} warning\n`);

  // Get issues
  const issues = await prisma.seoPageAudit.findMany({
    where: { siteId: SITE_ID, runId: latestRun.runId, severity: { in: ["critical", "warning"] } },
  });

  // Get existing tasks
  const existing = await prisma.seoTask.findMany({
    where: { siteId: SITE_ID, sourceType: "crawl", status: { in: ["not-started", "in-progress"] } },
  });
  const existingKeys = new Set(existing.map((t) => `${t.sourceUrl}::${t.sourceCheckType}`));

  let created = 0;
  let skipped = 0;

  for (const issue of issues) {
    const key = `${issue.url}::${issue.checkType}`;
    if (existingKeys.has(key)) { skipped++; continue; }

    const template = TASK_TEMPLATES[issue.checkType];
    const title = template
      ? template.title(shortenUrl(issue.url))
      : `Fix ${issue.checkType} on ${shortenUrl(issue.url)}`;
    const priority = template?.priority ?? (issue.severity === "critical" ? "critical" : "medium");
    const phase = template?.phase ?? 1;

    await prisma.seoTask.create({
      data: {
        siteId: SITE_ID,
        phase,
        title,
        status: "not-started",
        priority,
        sourceType: "crawl",
        sourceUrl: issue.url,
        sourceCheckType: issue.checkType,
        sourceRunId: latestRun.runId,
      },
    });
    created++;
    existingKeys.add(key);
    console.log(`+ [${priority}] ${title}`);
  }

  console.log(`\nDone: ${created} tasks created, ${skipped} duplicates skipped.`);

  const total = await prisma.seoTask.count({ where: { siteId: SITE_ID } });
  console.log(`Total tasks in DB: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
