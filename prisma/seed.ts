/**
 * Seed script — creates the default SeedTech admin user + business profile.
 *
 * Run: npx tsx prisma/seed.ts
 *
 * Safe to re-run — uses upserts and deterministic IDs.
 */

import "dotenv/config";
import path from "path";
import { config } from "dotenv";

// Load .env.local overrides (where ADMIN_EMAILS lives)
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const TENANT_ID = "tenant_seedtech";
const SITE_ID = "site_seedtech";

async function main() {
  console.log("🌱 Seeding multi-tenant data...\n");

  // 1. Ensure tenant exists
  const tenant = await prisma.tenant.upsert({
    where: { id: TENANT_ID },
    create: {
      id: TENANT_ID,
      name: "SeedTech LLC",
      slug: "seedtech",
    },
    update: {},
  });
  console.log(`✅ Tenant: ${tenant.name} (${tenant.id})`);

  // 2. Ensure site exists
  const site = await prisma.site.upsert({
    where: { id: SITE_ID },
    create: {
      id: SITE_ID,
      tenantId: TENANT_ID,
      name: "SeedTech",
      slug: "seedtech",
      domain: "seedtechllc.com",
      siteUrl: "https://seedtechllc.com",
    },
    update: {},
  });
  console.log(`✅ Site: ${site.name} (${site.id})`);

  // 3. Create admin user(s) from ADMIN_EMAILS env
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  for (const email of adminEmails) {
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        passwordHash,
        name: email.split("@")[0],
      },
      update: {}, // don't overwrite existing password
    });

    // Create membership
    await prisma.membership.upsert({
      where: { userId_tenantId: { userId: user.id, tenantId: TENANT_ID } },
      create: {
        userId: user.id,
        tenantId: TENANT_ID,
        role: "owner",
      },
      update: {},
    });

    console.log(`✅ User: ${email} → owner of ${tenant.name}`);
  }

  // 4. Create business profile
  const profile = await prisma.businessProfile.upsert({
    where: { siteId: SITE_ID },
    create: {
      siteId: SITE_ID,
      companyName: "SeedTech",
      tagline: "Managed IT services and web development for growing businesses",
      location: "Hopatcong, NJ (Northern New Jersey)",
      domain: "seedtechllc.com",
      primaryService:
        "Managed IT support — per-user pricing, no contracts, unlimited remote help desk",
      secondaryServices: [
        "Web development (Next.js, React, custom builds)",
        "Digital marketing & SEO",
        "Cybersecurity & compliance",
        "Cloud migration & management",
      ],
      targetAudience:
        "Small and mid-size businesses in Northern NJ / NYC metro area (10–200 employees)",
      uniqueSellingPoints: [
        "Per-user pricing with no long-term contracts",
        "Same-day onboarding",
        "24/7 monitoring with human support",
        "Local NJ company — not an offshore help desk",
        "Full-stack web development in-house",
      ],
      toneOfVoice:
        "Professional but approachable. Confident without being salesy. Technical when needed, but always explain in plain language.",
      customInstructions:
        "Always link back to /services/managed-it and /pricing/it-support where relevant. Write for Northern New Jersey business owners. Never mention Austin. Include real-world examples and actionable advice. Use Markdown formatting.",
      brandEntities: ["SeedTech", "SeedTech LLC", "seedtechllc.com"],
      serviceCategories: [
        { name: "Managed IT", slug: "managed-it", moneyPage: "/services/managed-it" },
        { name: "Web Development", slug: "web-development", moneyPage: "/services/web-development" },
        { name: "IT Support", slug: "it-support", moneyPage: "/pricing/it-support" },
        { name: "Cybersecurity", slug: "cybersecurity", moneyPage: "/services/cybersecurity" },
      ],
      internalLinkTargets: [
        { path: "/services/managed-it", label: "Managed IT Services", keywords: ["managed it", "it support", "msp"] },
        { path: "/pricing/it-support", label: "IT Support Pricing", keywords: ["pricing", "it support cost", "per user"] },
        { path: "/contact", label: "Contact Us", keywords: ["contact", "quote", "get started"] },
      ],
    },
    update: {},
  });
  console.log(`✅ Business Profile: ${profile.companyName}`);

  // 5. Seed core site pages
  const corePages = [
    { path: "/", kind: "home", title: "Home" },
    { path: "/services/managed-it", kind: "service", title: "Managed IT Services" },
    { path: "/services/web-development", kind: "service", title: "Web Development" },
    { path: "/services/cybersecurity", kind: "service", title: "Cybersecurity" },
    { path: "/pricing/it-support", kind: "service", title: "IT Support Pricing" },
    { path: "/contact", kind: "landing", title: "Contact Us" },
    { path: "/about", kind: "landing", title: "About SeedTech" },
    { path: "/blog", kind: "blog", title: "Blog" },
  ];

  for (const page of corePages) {
    await prisma.sitePage.upsert({
      where: { siteId_path: { siteId: SITE_ID, path: page.path } },
      create: {
        siteId: SITE_ID,
        path: page.path,
        kind: page.kind,
        title: page.title,
        source: "manual",
        status: "active",
      },
      update: {},
    });
  }
  console.log(`✅ Site Pages: ${corePages.length} core pages seeded`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
