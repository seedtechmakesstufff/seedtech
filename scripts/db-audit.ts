import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const site = await prisma.site.findFirst();
  const siteId = site!.id;

  // Keywords breakdown
  const kws = await prisma.trackedKeyword.findMany({ where: { siteId }, select: { keyword: true, tier: true, currentPosition: true, intent: true, targetPage: true } });
  console.log("=== Keywords (18) ===");
  kws.forEach(k => console.log(`  [${k.tier}] "${k.keyword}" → ${k.targetPage} | pos: ${k.currentPosition ?? '—'} | intent: ${k.intent}`));

  // Competitors
  const comps = await prisma.competitorDomain.findMany({ where: { siteId }, select: { domain: true, name: true } });
  console.log("\n=== Competitors ===");
  comps.forEach(c => console.log(`  ${c.name} (${c.domain})`));

  // Crawl results
  const crawl = await prisma.seoCrawlRun.findFirst({ where: { siteId }, orderBy: { startedAt: "desc" }, select: { startedAt: true, criticalCount: true, warningCount: true, status: true } });
  console.log("\n=== Latest Crawl ===", crawl);

  // Metadata coverage
  const totalMeta = await prisma.pageMetadata.count({ where: { siteId } });
  const withTitle = await prisma.pageMetadata.count({ where: { siteId, title: { not: "" } } });
  const withDesc = await prisma.pageMetadata.count({ where: { siteId, description: { not: null } } });
  console.log(`\n=== Metadata: ${withTitle}/${totalMeta} have titles ===`);

  // Existing insight
  const insight = await prisma.seoInsight.findFirst({ where: { siteId, status: "active" } });
  console.log("\n=== Active Insight ===", insight?.title);

  // Blog post
  const post = await prisma.blogPost.findFirst({ where: { siteId }, select: { title: true, targetKeyword: true, status: true, publishedAt: true } });
  console.log("\n=== Blog Post ===", post);

  // Snapshot scores
  const snaps = await prisma.seoSnapshot.findMany({ where: { siteId }, orderBy: { date: "asc" }, select: { date: true, healthScore: true, totalClicks: true, avgPosition: true } });
  console.log("\n=== Snapshots ===");
  snaps.forEach(s => console.log(`  ${s.date.toISOString().split('T')[0]}: health=${s.healthScore} clicks=${s.totalClicks} pos=${s.avgPosition}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
