/**
 * Seed TrackedKeywords + KeywordClusters for the default SeedTech site.
 * Run: npx tsx prisma/seed-keywords.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config(); // load .env

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

async function main() {
  console.log("Seeding keyword clusters...");

  // ── Keyword Clusters ──
  const managedIT = await prisma.keywordCluster.upsert({
    where: { siteId_name: { siteId: SITE_ID, name: "Managed IT Services" } },
    update: {},
    create: {
      siteId: SITE_ID,
      name: "Managed IT Services",
      pillarPage: "/services/managed-it",
      description: "Core managed IT support, MSP, and help desk keywords",
    },
  });

  const pricing = await prisma.keywordCluster.upsert({
    where: { siteId_name: { siteId: SITE_ID, name: "IT Pricing" } },
    update: {},
    create: {
      siteId: SITE_ID,
      name: "IT Pricing",
      pillarPage: "/pricing/it-support",
      description: "Pricing, cost comparison, and value-oriented keywords",
    },
  });

  const webDev = await prisma.keywordCluster.upsert({
    where: { siteId_name: { siteId: SITE_ID, name: "Web Development" } },
    update: {},
    create: {
      siteId: SITE_ID,
      name: "Web Development",
      pillarPage: "/services/web-development",
      description: "Web development and design keywords",
    },
  });

  const infoIT = await prisma.keywordCluster.upsert({
    where: { siteId_name: { siteId: SITE_ID, name: "IT Education" } },
    update: {},
    create: {
      siteId: SITE_ID,
      name: "IT Education",
      pillarPage: "/blog",
      description: "Informational long-tail keywords for blog content",
    },
  });

  console.log("Seeding tracked keywords...");

  const keywords = [
    // Tier 1 — Primary money keywords
    { keyword: "managed IT services NJ", tier: "tier1" as const, volume: "300–500", competition: "medium-high", intent: "transactional" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "IT support Northern NJ", tier: "tier1" as const, volume: "400–600", competition: "medium", intent: "transactional" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "IT support company NJ", tier: "tier1" as const, volume: "200–350", competition: "medium", intent: "transactional" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "managed service provider NJ", tier: "tier1" as const, volume: "150–250", competition: "medium", intent: "transactional" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "NJ IT services", tier: "tier1" as const, volume: "200–400", competition: "medium", intent: "transactional" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },

    // Tier 2 — Secondary commercial
    { keyword: "best managed IT services NJ", tier: "tier2" as const, volume: "100–200", competition: "medium", intent: "commercial" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "small business IT support NJ", tier: "tier2" as const, volume: "150–300", competition: "low-medium", intent: "commercial" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "outsourced IT support NJ", tier: "tier2" as const, volume: "100–200", competition: "low-medium", intent: "commercial" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "IT help desk NJ", tier: "tier2" as const, volume: "100–150", competition: "low", intent: "commercial" as const, targetPage: "/services/managed-it", clusterId: managedIT.id },
    { keyword: "IT support pricing", tier: "tier2" as const, volume: "500–800", competition: "medium", intent: "commercial" as const, targetPage: "/pricing/it-support", clusterId: pricing.id },
    { keyword: "managed IT cost per user", tier: "tier2" as const, volume: "200–400", competition: "low-medium", intent: "commercial" as const, targetPage: "/pricing/it-support", clusterId: pricing.id },
    { keyword: "web development NJ", tier: "tier2" as const, volume: "200–400", competition: "medium", intent: "transactional" as const, targetPage: "/services/web-development", clusterId: webDev.id },

    // Tier 3 — Long-tail / informational (blog targets)
    { keyword: "how much does managed IT cost", tier: "tier3" as const, volume: "500–800", competition: "low-medium", intent: "informational" as const, targetPage: "/blog", clusterId: pricing.id },
    { keyword: "break fix vs managed IT", tier: "tier3" as const, volume: "300–500", competition: "low", intent: "informational" as const, targetPage: "/blog", clusterId: infoIT.id },
    { keyword: "how to choose an MSP", tier: "tier3" as const, volume: "200–400", competition: "low", intent: "informational" as const, targetPage: "/blog", clusterId: infoIT.id },
    { keyword: "cybersecurity for small business NJ", tier: "tier3" as const, volume: "100–200", competition: "low", intent: "informational" as const, targetPage: "/blog", clusterId: infoIT.id },
    { keyword: "what is endpoint monitoring", tier: "tier3" as const, volume: "100–300", competition: "low", intent: "informational" as const, targetPage: "/blog", clusterId: infoIT.id },
    { keyword: "per user IT pricing", tier: "tier3" as const, volume: "100–200", competition: "low", intent: "informational" as const, targetPage: "/blog", clusterId: pricing.id },
  ];

  for (const kw of keywords) {
    await prisma.trackedKeyword.upsert({
      where: { siteId_keyword: { siteId: SITE_ID, keyword: kw.keyword } },
      update: { tier: kw.tier, volume: kw.volume, competition: kw.competition, intent: kw.intent, targetPage: kw.targetPage, clusterId: kw.clusterId },
      create: { siteId: SITE_ID, ...kw },
    });
  }

  const count = await prisma.trackedKeyword.count({ where: { siteId: SITE_ID } });
  const clusterCount = await prisma.keywordCluster.count({ where: { siteId: SITE_ID } });
  console.log(`✅ Seeded ${count} keywords in ${clusterCount} clusters for site_seedtech`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
