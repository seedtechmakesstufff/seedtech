/**
 * KEYWORD STRATEGY v4 — Google Keyword Planner Data Import
 *
 * Imports 384 keywords from the Keyword Planner CSV export with real data:
 *   - Actual monthly search volumes
 *   - Competition levels (Low/Medium/High + indexed value)
 *   - CPC bid ranges
 *
 * Maps every keyword to the correct target page based on topic clustering.
 * Creates new KeywordClusters for Tier 6 topics.
 * Preserves existing v3 keywords that aren't in the CSV.
 *
 * Run: npx tsx scripts/seed-keywords-v4.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const p = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

/* ── Keyword → Page mapping rules ──
 * Order matters: first match wins. More specific patterns come first.
 */
const ROUTE_RULES: [RegExp, string][] = [
  // ── HIPAA / Medical ──
  [/hipaa/i, "/hipaa-compliant-it-support-nj"],
  [/medical practice/i, "/industries/medical"],

  // ── Construction ──
  [/construction/i, "/it-support-construction-companies-nj"],

  // ── Law firm / Legal ──
  [/law firm.*(cyber|security|data)/i, "/cybersecurity-law-firms-nj"],
  [/cyber.*(law firm|solicitor|attorney)/i, "/cybersecurity-law-firms-nj"],
  [/law firm.*information security/i, "/data-security-law-firms-nj"],
  [/law firm.*compliance/i, "/it-compliance-law-firms-nj"],
  [/law firm.*(it|support|tech)/i, "/it-support-law-firms-new-jersey"],
  [/legal.*(it|support|tech|services|provider)/i, "/it-support-law-firms-new-jersey"],
  [/(it|tech).*(law firm|legal|solicitor)/i, "/it-support-law-firms-new-jersey"],
  [/cyber.*(attorney|solicitor|lawyer)/i, "/cybersecurity-law-firms-nj"],
  [/best cyber law/i, "/cybersecurity-law-firms-nj"],
  [/top cyber.*law/i, "/cybersecurity-law-firms-nj"],
  [/law firm.*network/i, "/data-security-law-firms-nj"],
  [/it solicitor/i, "/it-support-law-firms-new-jersey"],

  // ── Endpoint security ──
  [/endpoint/i, "/endpoint-security-new-jersey"],
  [/end point/i, "/endpoint-security-new-jersey"],
  [/end.to.end protection/i, "/endpoint-security-new-jersey"],

  // ── Ransomware / Anti-ransomware → ransomware-response page ──
  [/ransom/i, "/ransomware-response-new-jersey"],
  [/cryptolocker/i, "/ransomware-response-new-jersey"],

  // ── Help desk ──
  [/help desk|helpdesk|it desk|desk it|it help/i, "/help-desk-services-new-jersey"],

  // ── Server down / Emergency ──
  [/server.*(down|outage|status|issue|up down|tracker)/i, "/server-down-help"],
  [/down server/i, "/server-down-help"],
  [/emergency it/i, "/emergency-it-support-new-jersey"],
  [/it emergency/i, "/emergency-it-support-new-jersey"],

  // ── Outsourced IT ──
  [/outsourc/i, "/outsourced-it-support-new-jersey"],

  // ── MSP / Managed service provider ──
  [/\bmsp\b/i, "/managed-service-provider-new-jersey"],
  [/managed service provider/i, "/managed-service-provider-new-jersey"],
  [/managed provider/i, "/managed-service-provider-new-jersey"],

  // ── Managed IT services (broad) ──
  [/managed it/i, "/managed-it-services-new-jersey"],
  [/it managed/i, "/managed-it-services-new-jersey"],
  [/managed service(?!.*provider)/i, "/managed-it-services-new-jersey"],
  [/managed support/i, "/managed-it-services-new-jersey"],
  [/managed network/i, "/managed-it-services-new-jersey"],
  [/management as a service/i, "/managed-it-services-new-jersey"],
  [/managed business/i, "/managed-it-services-new-jersey"],

  // ── Cloud services ──
  [/cloud/i, "/cloud-services-new-jersey"],

  // ── Cybersecurity (broad) ──
  [/cyber.*security|security.*cyber/i, "/cybersecurity-services-new-jersey"],
  [/cyber.*service/i, "/cybersecurity-services-new-jersey"],
  [/cyber as a service/i, "/cybersecurity-services-new-jersey"],
  [/cyber network/i, "/cybersecurity-services-new-jersey"],
  [/information security/i, "/cybersecurity-services-new-jersey"],
  [/network.*security/i, "/cybersecurity-services-new-jersey"],
  [/computer.*security/i, "/cybersecurity-services-new-jersey"],
  [/lan security/i, "/cybersecurity-services-new-jersey"],
  [/network.*protection/i, "/cybersecurity-services-new-jersey"],
  [/data.*security/i, "/cybersecurity-services-new-jersey"],
  [/\ba secure\b/i, "/cybersecurity-services-new-jersey"],

  // ── IT support (broad) ──
  [/it support.*near me/i, "/it-support-new-jersey"],
  [/it support/i, "/it-support-new-jersey"],
  [/company.*it.*support/i, "/it-support-new-jersey"],
  [/it.*support.*company/i, "/it-support-new-jersey"],
  [/it.*support.*services/i, "/it-support-new-jersey"],
  [/proactive it/i, "/it-support-new-jersey"],
  [/it.*service.*provider/i, "/it-support-new-jersey"],
  [/it.*services/i, "/it-support-new-jersey"],
  [/it.*security.*services/i, "/cybersecurity-services-new-jersey"],
  [/business.*computer.*(support|repair|service)/i, "/it-support-new-jersey"],
  [/computer.*(support|repair|service).*business/i, "/it-support-new-jersey"],
  [/computer.*repair/i, "/it-support-new-jersey"],
  [/computer.*technician/i, "/it-support-new-jersey"],
  [/pc.*repair/i, "/it-support-new-jersey"],
  [/small business.*computer/i, "/it-support-new-jersey"],
  [/tech repair/i, "/it-support-new-jersey"],
  [/warehouse.*it/i, "/it-support-new-jersey"],
  [/commercial.*computer/i, "/it-support-new-jersey"],
  [/help my business/i, "/it-support-new-jersey"],
  [/service and support/i, "/it-support-new-jersey"],
  [/support services group/i, "/it-support-new-jersey"],

  // ── Backup / DR ──
  [/backup|disaster/i, "/backup-disaster-recovery-new-jersey"],
];

/**
 * Maps a keyword string to its best target page.
 */
function mapToPage(keyword: string): string {
  for (const [pattern, page] of ROUTE_RULES) {
    if (pattern.test(keyword)) return page;
  }
  // Fallback — general IT support page
  return "/it-support-new-jersey";
}

/**
 * Determines keyword tier based on volume + commercial intent.
 */
function assignTier(volume: number, competition: string): "tier1" | "tier2" | "tier3" {
  if (volume >= 1000) return "tier1";
  if (volume >= 50 || competition === "Medium" || competition === "High") return "tier2";
  return "tier3";
}

/**
 * Determines search intent from keyword text.
 */
function assignIntent(keyword: string): "commercial" | "transactional" | "informational" | "navigational" {
  const kw = keyword.toLowerCase();
  if (/near me|nj|new jersey|contact|call|hire/.test(kw)) return "transactional";
  if (/how|what|why|when|guide|checklist|vs|difference/.test(kw)) return "informational";
  if (/best|top|review|compare|alternative/.test(kw)) return "commercial";
  if (/service|support|provider|company|companies|solution/.test(kw)) return "commercial";
  return "informational";
}

/**
 * Maps a target page to a cluster name.
 */
function clusterForPage(page: string): string {
  if (page.includes("endpoint")) return "Endpoint Security";
  if (page.includes("help-desk")) return "Help Desk & Service Desk";
  if (page.includes("outsourced")) return "IT Outsourcing";
  if (page.includes("managed-service-provider") || page.includes("msp")) return "Managed Service Providers";
  if (page.includes("construction")) return "Construction IT";
  if (page.includes("hipaa")) return "HIPAA & Healthcare IT";
  if (page.includes("ransomware")) return "Ransomware Protection";
  if (page.includes("server-down") || page.includes("emergency")) return "Emergency IT Support";
  if (page.includes("cybersecurity") || page.includes("security")) return "Cybersecurity";
  if (page.includes("law-firm") || page.includes("legal") || page.includes("compliance") || page.includes("data-security-law")) return "Law Firm IT";
  if (page.includes("cloud")) return "Cloud Services";
  if (page.includes("backup")) return "Backup & Disaster Recovery";
  if (page.includes("managed-it")) return "Managed IT Services";
  if (page.includes("it-support")) return "IT Support";
  return "IT Support";
}

/* ── CSV Parser ── */
interface CSVRow {
  keyword: string;
  volume: number;
  competition: string;
  competitionIndexed: number;
  bidLow: number;
  bidHigh: number;
  threeMonthChange: string;
  yoyChange: string;
}

function parseCSV(path: string): CSVRow[] {
  // Google Keyword Planner exports as UTF-16LE with BOM
  const buf = readFileSync(path);
  let raw: string;
  // Detect UTF-16LE BOM (0xFF 0xFE)
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    raw = buf.toString("utf16le");
  } else {
    raw = buf.toString("utf-8");
  }
  // Strip BOM if present
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);

  const lines = raw.split(/\r?\n/);

  // Find the header line (starts with "Keyword")
  const headerIndex = lines.findIndex((l) => l.trimStart().startsWith("Keyword"));
  if (headerIndex === -1) throw new Error("Could not find header row in CSV");

  const rows: CSVRow[] = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split("\t");
    const keyword = cols[0]?.trim();
    if (!keyword) continue;

    // Skip aggregate rows (no keyword text or "All"/"United States" segmentation)
    if (!keyword || keyword === "") continue;

    const volume = parseFloat(cols[3]) || 0;
    if (volume === 0) continue; // Skip zero-volume keywords

    rows.push({
      keyword,
      volume,
      competition: cols[6]?.trim() || "Low",
      competitionIndexed: parseInt(cols[7]) || 0,
      bidLow: parseFloat(cols[8]) || 0,
      bidHigh: parseFloat(cols[9]) || 0,
      threeMonthChange: cols[4]?.trim() || "0%",
      yoyChange: cols[5]?.trim() || "0%",
    });
  }

  return rows;
}

/* ── Main ── */
async function main() {
  const csvPath = resolve(__dirname, "../ai/seo-autopilot/Saved Keywords Stats 2026-04-04 at 11_53_50.csv");
  console.log("📄 Reading CSV from:", csvPath);

  const csvRows = parseCSV(csvPath);
  console.log(`📊 Parsed ${csvRows.length} keywords from CSV\n`);

  // ── Step 1: Create / upsert keyword clusters ──
  const clusterNames = new Set<string>();
  const keywordsToSeed: {
    keyword: string;
    tier: "tier1" | "tier2" | "tier3";
    volume: string;
    competition: string;
    intent: "commercial" | "transactional" | "informational" | "navigational";
    targetPage: string;
    clusterName: string;
  }[] = [];

  for (const row of csvRows) {
    const targetPage = mapToPage(row.keyword);
    const tier = assignTier(row.volume, row.competition);
    const intent = assignIntent(row.keyword);
    const clusterName = clusterForPage(targetPage);
    clusterNames.add(clusterName);

    keywordsToSeed.push({
      keyword: row.keyword,
      tier,
      volume: row.volume.toString(),
      competition: row.competition.toLowerCase(),
      intent,
      targetPage,
      clusterName,
    });
  }

  console.log(`🗂️  Creating/updating ${clusterNames.size} keyword clusters...`);

  // Cluster → pillar page mapping
  const clusterPillars: Record<string, string> = {
    "Endpoint Security": "/endpoint-security-new-jersey",
    "Help Desk & Service Desk": "/help-desk-services-new-jersey",
    "IT Outsourcing": "/outsourced-it-support-new-jersey",
    "Managed Service Providers": "/managed-service-provider-new-jersey",
    "Construction IT": "/it-support-construction-companies-nj",
    "HIPAA & Healthcare IT": "/hipaa-compliant-it-support-nj",
    "Ransomware Protection": "/ransomware-response-new-jersey",
    "Emergency IT Support": "/emergency-it-support-new-jersey",
    "Cybersecurity": "/cybersecurity-services-new-jersey",
    "Law Firm IT": "/it-support-law-firms-new-jersey",
    "Cloud Services": "/cloud-services-new-jersey",
    "Backup & Disaster Recovery": "/backup-disaster-recovery-new-jersey",
    "Managed IT Services": "/managed-it-services-new-jersey",
    "IT Support": "/it-support-new-jersey",
  };

  const clusterMap: Record<string, string> = {}; // name → id

  for (const name of Array.from(clusterNames)) {
    const pillarPage = clusterPillars[name] || "/it-support-new-jersey";
    const cluster = await p.keywordCluster.upsert({
      where: { siteId_name: { siteId: SITE_ID, name } },
      update: { pillarPage, status: "active" },
      create: {
        siteId: SITE_ID,
        name,
        pillarPage,
        description: `Keywords related to ${name.toLowerCase()} — sourced from Google Keyword Planner`,
        status: "active",
      },
    });
    clusterMap[name] = cluster.id;
    console.log(`   ✓ ${name} → ${pillarPage}`);
  }

  // ── Step 2: Upsert all keywords (preserves existing v3 keywords) ──
  console.log(`\n🔑 Upserting ${keywordsToSeed.length} keywords...`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const kw of keywordsToSeed) {
    try {
      const existing = await p.trackedKeyword.findUnique({
        where: { siteId_keyword: { siteId: SITE_ID, keyword: kw.keyword } },
      });

      if (existing) {
        await p.trackedKeyword.update({
          where: { id: existing.id },
          data: {
            volume: kw.volume,
            competition: kw.competition,
            targetPage: kw.targetPage,
            clusterId: clusterMap[kw.clusterName],
            isActive: true,
          },
        });
        updated++;
      } else {
        await p.trackedKeyword.create({
          data: {
            siteId: SITE_ID,
            keyword: kw.keyword,
            tier: kw.tier,
            volume: kw.volume,
            competition: kw.competition,
            intent: kw.intent,
            targetPage: kw.targetPage,
            clusterId: clusterMap[kw.clusterName],
            isActive: true,
          },
        });
        created++;
      }
    } catch (err: any) {
      failed++;
      console.error(`   ❌ ${kw.keyword}: ${err.message}`);
    }
  }

  console.log(`\n✅ Results: ${created} created, ${updated} updated, ${failed} failed`);

  // ── Step 3: Stats ──
  const total = await p.trackedKeyword.count({ where: { siteId: SITE_ID, isActive: true } });
  const clusterCount = await p.keywordCluster.count({ where: { siteId: SITE_ID } });

  console.log(`\n📈 Database totals:`);
  console.log(`   Active keywords: ${total}`);
  console.log(`   Clusters: ${clusterCount}`);

  // Tier breakdown
  const t1 = keywordsToSeed.filter((k) => k.tier === "tier1").length;
  const t2 = keywordsToSeed.filter((k) => k.tier === "tier2").length;
  const t3 = keywordsToSeed.filter((k) => k.tier === "tier3").length;
  console.log(`\n📊 Tier breakdown (CSV keywords):`);
  console.log(`   Tier 1 (≥1000/mo): ${t1}`);
  console.log(`   Tier 2 (50–999/mo): ${t2}`);
  console.log(`   Tier 3 (<50/mo): ${t3}`);

  // Cluster sizes
  console.log(`\n🗂️  Keywords per cluster:`);
  const clusterCounts: Record<string, number> = {};
  keywordsToSeed.forEach((k) => {
    clusterCounts[k.clusterName] = (clusterCounts[k.clusterName] || 0) + 1;
  });
  Object.entries(clusterCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => console.log(`   ${count.toString().padStart(3)} → ${name}`));

  // Top 20 highest-volume keywords
  console.log(`\n🔥 Top 20 by volume:`);
  [...keywordsToSeed]
    .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
    .slice(0, 20)
    .forEach((k) => console.log(`   ${k.volume.padStart(8)}/mo → ${k.keyword} → ${k.targetPage}`));

  await p.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
