/**
 * Week 1 Integration Tests — run directly against the DB
 * Run: npx tsx scripts/test-week1.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

let passed = 0;
let failed = 0;

function assert(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}${detail ? ` — ${detail}` : ""}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Week 1 — Data Loop Integration Tests");
  console.log("═══════════════════════════════════════════\n");

  // ── Test 1: GSC Sync Log exists ──
  console.log("1️⃣  GSC Sync Logs");
  const syncLogs = await prisma.gscSyncLog.findMany({
    where: { siteId: SITE_ID },
    orderBy: { createdAt: "desc" },
  });
  assert("Sync logs exist", syncLogs.length > 0, `${syncLogs.length} log(s)`);
  if (syncLogs.length > 0) {
    const latest = syncLogs[0];
    assert("Latest sync completed", latest.status === "completed", `status: ${latest.status}`);
    assert("Keywords were fetched", latest.keywordsFetched > 0, `${latest.keywordsFetched} keywords`);
    assert("Pages were fetched", latest.pagesFetched > 0, `${latest.pagesFetched} pages`);
    assert("Duration tracked", (latest.durationMs ?? 0) > 0, `${latest.durationMs}ms`);
  }

  // ── Test 2: GSC Daily Keywords stored ──
  console.log("\n2️⃣  GSC Daily Keywords");
  const gscKeywords = await prisma.gscDailyKeyword.findMany({
    where: { siteId: SITE_ID },
    orderBy: { clicks: "desc" },
    take: 5,
  });
  assert("Keyword data stored", gscKeywords.length > 0, `${gscKeywords.length} records (showing top 5)`);
  for (const kw of gscKeywords.slice(0, 3)) {
    console.log(`     "${kw.query}" → pos ${kw.position}, ${kw.clicks} clicks, ${kw.impressions} imp`);
  }

  // ── Test 3: GSC Daily Pages stored ──
  console.log("\n3️⃣  GSC Daily Pages");
  const gscPages = await prisma.gscDailyPage.findMany({
    where: { siteId: SITE_ID },
    orderBy: { clicks: "desc" },
    take: 5,
  });
  assert("Page data stored", gscPages.length > 0, `${gscPages.length} records (showing top 5)`);
  for (const pg of gscPages.slice(0, 3)) {
    console.log(`     ${pg.pageUrl} → pos ${pg.position}, ${pg.clicks} clicks`);
  }

  // ── Test 4: SeoTasks generated ──
  console.log("\n4️⃣  SEO Tasks (from crawl)");
  const tasks = await prisma.seoTask.findMany({
    where: { siteId: SITE_ID },
    orderBy: { createdAt: "desc" },
  });
  assert("Tasks exist", tasks.length > 0, `${tasks.length} total tasks`);
  
  const crawlTasks = tasks.filter(t => t.sourceType === "crawl");
  assert("Tasks have source tracking", crawlTasks.length > 0, `${crawlTasks.length} crawl-sourced tasks`);
  
  const criticalTasks = tasks.filter(t => t.priority === "critical");
  const highTasks = tasks.filter(t => t.priority === "high");
  const mediumTasks = tasks.filter(t => t.priority === "medium");
  console.log(`     Priority breakdown: ${criticalTasks.length} critical, ${highTasks.length} high, ${mediumTasks.length} medium`);
  
  const withUrl = crawlTasks.filter(t => t.sourceUrl);
  assert("Tasks have sourceUrl", withUrl.length === crawlTasks.length, `${withUrl.length}/${crawlTasks.length}`);
  
  const withCheckType = crawlTasks.filter(t => t.sourceCheckType);
  assert("Tasks have sourceCheckType", withCheckType.length === crawlTasks.length, `${withCheckType.length}/${crawlTasks.length}`);

  // ── Test 5: Task dedup keys are unique ──
  console.log("\n5️⃣  Task Deduplication");
  const keys = crawlTasks.map(t => `${t.sourceUrl}::${t.sourceCheckType}`);
  const uniqueKeys = new Set(keys);
  assert("No duplicate tasks", keys.length === uniqueKeys.size, `${keys.length} tasks, ${uniqueKeys.size} unique keys`);

  // ── Test 6: Competitors ──
  console.log("\n6️⃣  Competitors");
  const competitors = await prisma.competitorDomain.findMany({
    where: { siteId: SITE_ID },
    orderBy: { isActive: "desc" },
  });
  assert("Competitors exist", competitors.length >= 2, `${competitors.length} total`);
  
  const active = competitors.filter(c => c.isActive);
  assert("Active competitors include Dataprise", active.some(c => c.domain === "dataprise.com"));
  assert("Active competitors include Ntiva", active.some(c => c.domain === "ntiva.com"));
  
  const hibu = competitors.find(c => c.domain.includes("hibu"));
  if (hibu) {
    assert("HIBU is deactivated", !hibu.isActive);
  }

  // ── Test 7: Tracked Keywords exist ──
  console.log("\n7️⃣  Tracked Keywords");
  const tracked = await prisma.trackedKeyword.findMany({
    where: { siteId: SITE_ID, isActive: true },
  });
  assert("Tracked keywords exist", tracked.length > 0, `${tracked.length} active keywords`);
  
  // Check if any got updated from GSC (they may not match yet — that's expected)
  const withPosition = tracked.filter(t => t.currentPosition !== null);
  console.log(`     ${withPosition.length}/${tracked.length} have GSC position data (0 is expected for aspirational targets)`);

  // ── Test 8: Crawl Run exists ──
  console.log("\n8️⃣  Crawl Runs");
  const crawlRuns = await prisma.seoCrawlRun.findMany({
    where: { siteId: SITE_ID },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  assert("Crawl runs exist", crawlRuns.length > 0);
  if (crawlRuns[0]) {
    assert("Latest crawl completed", crawlRuns[0].status === "completed", 
      `${crawlRuns[0].pagesScanned} pages, ${crawlRuns[0].criticalCount} critical, ${crawlRuns[0].warningCount} warning`);
  }

  // ── Test 9: CronJobRun tracking for GSC ──
  console.log("\n9️⃣  Cron Job Tracking");
  const gscJobs = await prisma.cronJobRun.findMany({
    where: { siteId: SITE_ID, jobType: "gsc_pull" },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  assert("GSC sync logged in CronJobRun", gscJobs.length > 0);
  if (gscJobs[0]) {
    assert("GSC cron job completed", gscJobs[0].status === "completed", gscJobs[0].resultSummary ?? undefined);
  }

  // ── Summary ──
  console.log("\n═══════════════════════════════════════════");
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log("═══════════════════════════════════════════\n");

  if (failed > 0) process.exit(1);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
