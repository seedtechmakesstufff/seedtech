/**
 * Seed real MSP competitors: Dataprise + Ntiva
 * Run: npx tsx scripts/seed-competitors.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

const competitors = [
  {
    domain: "dataprise.com",
    name: "Dataprise",
    notes: "Major MSP in DC/Baltimore/Northern VA region. Enterprise-focused managed IT and cybersecurity.",
  },
  {
    domain: "ntiva.com",
    name: "Ntiva",
    notes: "Mid-Atlantic MSP covering DC, VA, NY, NJ. Strong in managed IT for SMBs and mid-market.",
  },
];

async function main() {
  for (const c of competitors) {
    const existing = await prisma.competitorDomain.findUnique({
      where: { siteId_domain: { siteId: SITE_ID, domain: c.domain } },
    });

    if (existing) {
      console.log(`✓ ${c.name} already exists (${c.domain})`);
      continue;
    }

    await prisma.competitorDomain.create({
      data: {
        siteId: SITE_ID,
        domain: c.domain,
        name: c.name,
        notes: c.notes,
        isActive: true,
      },
    });
    console.log(`+ Created ${c.name} (${c.domain})`);
  }

  // Check if HIBU is still there and deactivate it (it's not a real MSP competitor)
  const hibu = await prisma.competitorDomain.findFirst({
    where: { siteId: SITE_ID, domain: { contains: "hibu" } },
  });
  if (hibu && hibu.isActive) {
    await prisma.competitorDomain.update({
      where: { id: hibu.id },
      data: { isActive: false, notes: "Deactivated — not an MSP competitor" },
    });
    console.log(`- Deactivated HIBU (not an MSP competitor)`);
  }

  const all = await prisma.competitorDomain.findMany({
    where: { siteId: SITE_ID },
    orderBy: { isActive: "desc" },
  });
  console.log("\nAll competitors:");
  for (const c of all) {
    console.log(`  ${c.isActive ? "✓" : "✗"} ${c.name} (${c.domain})`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
