/**
 * KEYWORD STRATEGY v3 — Built from actual site content & search behavior
 *
 * METHODOLOGY:
 * 1. Every keyword is derived from language ON the site or in FAQs
 * 2. FAQ questions = exact match to "People Also Ask" patterns
 * 3. Pricing specifics = high commercial intent (people search exact numbers)
 * 4. Differentiator language = low competition (competitors can't claim these)
 * 5. Local modifiers use the ACTUAL service area from the about/hero copy
 * 6. Industry keywords use the EXACT framing from industry pages
 * 7. Volume/competition are "unknown" until GSC provides real data
 *
 * ARCHITECTURE:
 * - Tier 1: Head terms with geographic + intent modifiers (the battleground)
 * - Tier 2: Service-specific / evaluation / industry (the real pipeline)
 * - Tier 3: Question keywords + educational (the content engine)
 *
 * Every single keyword maps to an existing page OR a specific blog article.
 * Zero lazy "/blog" targeting.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const p = new PrismaClient({ adapter });

const SITE_ID = "site_seedtech";

const keywords = [
  // ─────────────────────────────────────────────────────────────────────────
  // TIER 1 — Head Terms (8)
  // The competitive terms. SeedTech needs to show up for these eventually,
  // but the real strategy is Tier 2+3 feeding authority into these pages.
  // ─────────────────────────────────────────────────────────────────────────
  { keyword: "managed IT services northern NJ", tier: "tier1", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "IT support for small business NJ", tier: "tier1", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "managed service provider New Jersey", tier: "tier1", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "web development company NJ", tier: "tier1", intent: "commercial", targetPage: "/services/web-development" },
  { keyword: "small business website NJ", tier: "tier1", intent: "commercial", targetPage: "/services/seedtech-platform" },
  { keyword: "custom website development NJ", tier: "tier1", intent: "commercial", targetPage: "/services/custom-development" },
  { keyword: "ecommerce website development NJ", tier: "tier1", intent: "commercial", targetPage: "/services/ecommerce-development" },
  { keyword: "IT company Hopatcong NJ", tier: "tier1", intent: "transactional", targetPage: "/services/managed-it" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — SERVICE-SPECIFIC: Managed IT (15)
  // Derived from actual page copy, pricing, FAQs, and differentiators.
  // ─────────────────────────────────────────────────────────────────────────

  // From pricing page: SeedCare tiers are the PRODUCT
  { keyword: "managed IT per user pricing", tier: "tier2", intent: "commercial", targetPage: "/pricing/it-support" },
  { keyword: "IT support $110 per user per month", tier: "tier2", intent: "commercial", targetPage: "/pricing/it-support" },
  { keyword: "managed IT no contract month to month", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "flat rate IT support per employee", tier: "tier2", intent: "commercial", targetPage: "/pricing/it-support" },

  // From hero/features copy: actual differentiator language
  { keyword: "unlimited help desk IT support", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "proactive IT monitoring small business", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "IT support with SentinelOne endpoint security", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "managed IT with cybersecurity included", tier: "tier2", intent: "commercial", targetPage: "/services/cybersecurity" },

  // From "Why SeedTech" page: anti-large-MSP positioning
  { keyword: "switch managed IT providers", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech" },
  { keyword: "better alternative to large MSP", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech" },
  { keyword: "IT provider no ticket black holes", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech" },

  // From assessment page: conversion-focused
  { keyword: "free IT assessment New Jersey", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it/assessment" },
  { keyword: "free IT audit for small business", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it/assessment" },
  { keyword: "free technology assessment no obligation", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it/assessment" },

  // From MDM page: niche differentiator
  { keyword: "mobile device management for business $12 per device", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/mobile-device-management" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — SERVICE-SPECIFIC: Web Development (10)
  // ─────────────────────────────────────────────────────────────────────────

  // From SeedTech Platform page: actual product + pricing
  { keyword: "business website starting at $2500", tier: "tier2", intent: "commercial", targetPage: "/services/seedtech-platform" },
  { keyword: "website with SEO built in from day one", tier: "tier2", intent: "commercial", targetPage: "/services/seedtech-platform" },
  { keyword: "Next.js website for small business", tier: "tier2", intent: "commercial", targetPage: "/services/seedtech-platform" },
  { keyword: "website build 4 to 8 weeks", tier: "tier2", intent: "informational", targetPage: "/services/seedtech-platform" },
  { keyword: "small business website with SEO dashboard", tier: "tier2", intent: "commercial", targetPage: "/services/seedtech-platform" },

  // From ecommerce page
  { keyword: "Shopify development services NJ", tier: "tier2", intent: "commercial", targetPage: "/services/ecommerce-development" },
  { keyword: "BigCommerce development NJ", tier: "tier2", intent: "commercial", targetPage: "/services/ecommerce-development" },
  { keyword: "ecommerce store migration Shopify to BigCommerce", tier: "tier2", intent: "commercial", targetPage: "/services/ecommerce-development" },
  { keyword: "ecommerce website starting at $15000", tier: "tier2", intent: "commercial", targetPage: "/services/ecommerce-development" },

  // From custom dev page
  { keyword: "custom SaaS development NJ", tier: "tier2", intent: "commercial", targetPage: "/services/custom-development" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — INDUSTRY VERTICALS (12)
  // Derived from the exact positioning on each industry page.
  // ─────────────────────────────────────────────────────────────────────────

  // Law Firms — "rank above national directories"
  { keyword: "IT support for law firms New Jersey", tier: "tier2", intent: "commercial", targetPage: "/industries/law-firms" },
  { keyword: "law firm website design NJ", tier: "tier2", intent: "commercial", targetPage: "/industries/law-firms" },
  { keyword: "digital intake tools law firm", tier: "tier2", intent: "commercial", targetPage: "/industries/law-firms" },

  // Medical — reliability + HIPAA
  { keyword: "IT support for medical practices NJ", tier: "tier2", intent: "commercial", targetPage: "/industries/medical" },
  { keyword: "HIPAA compliant IT support New Jersey", tier: "tier2", intent: "commercial", targetPage: "/industries/medical" },
  { keyword: "medical practice technology support", tier: "tier2", intent: "commercial", targetPage: "/industries/medical" },

  // Trucking — driver applications, quote flows, compliance
  { keyword: "trucking company website development", tier: "tier2", intent: "commercial", targetPage: "/industries/trucking" },
  { keyword: "driver application page for trucking website", tier: "tier2", intent: "commercial", targetPage: "/industries/trucking" },
  { keyword: "trucking company IT support", tier: "tier2", intent: "commercial", targetPage: "/industries/trucking" },

  // Construction — portfolio galleries, bid request flows
  { keyword: "construction company website NJ", tier: "tier2", intent: "commercial", targetPage: "/industries/construction" },
  { keyword: "construction company bid request website", tier: "tier2", intent: "commercial", targetPage: "/industries/construction" },
  { keyword: "contractor website with project portfolio", tier: "tier2", intent: "commercial", targetPage: "/industries/construction" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — LOCAL GEO (6)
  // Counties + regions from the actual service area
  // ─────────────────────────────────────────────────────────────────────────
  { keyword: "IT support Morris County NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "IT support Sussex County NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "managed IT Passaic County NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "web developer northern New Jersey", tier: "tier2", intent: "commercial", targetPage: "/services/web-development" },
  { keyword: "IT support NYC metro area", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it" },
  { keyword: "website development company near me NJ", tier: "tier2", intent: "transactional", targetPage: "/services/web-development" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — CONVERSION / BOTTOM FUNNEL (3)
  // ─────────────────────────────────────────────────────────────────────────
  { keyword: "free website audit", tier: "tier2", intent: "transactional", targetPage: "/free-audit" },
  { keyword: "free website and technology audit NJ", tier: "tier2", intent: "transactional", targetPage: "/free-audit" },
  { keyword: "get an instant IT quote online", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it/plans" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 3 — FAQ-DERIVED QUESTION KEYWORDS (20)
  // These are EXACT questions from the site's own FAQs.
  // Google surfaces FAQ schema in PAA boxes. These are the queries.
  // ─────────────────────────────────────────────────────────────────────────

  // From /services/managed-it FAQs
  { keyword: "what does managed IT services include", tier: "tier3", intent: "informational", targetPage: "/services/managed-it" },
  { keyword: "how much does managed IT cost in New Jersey", tier: "tier3", intent: "informational", targetPage: "/services/managed-it" },
  { keyword: "do managed IT providers require long term contracts", tier: "tier3", intent: "informational", targetPage: "/services/managed-it" },
  { keyword: "how is a small MSP different from a large MSP", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/why-seedtech" },
  { keyword: "how quickly can you start with managed IT", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/onboarding" },
  { keyword: "what areas in New Jersey does SeedTech serve", tier: "tier3", intent: "navigational", targetPage: "/services/managed-it" },

  // From /services/managed-it/why-seedtech FAQs
  { keyword: "how is SeedTech structured differently from larger MSPs", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/why-seedtech" },
  { keyword: "what happens during transition from current IT provider", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/onboarding" },

  // From /services/managed-it/assessment FAQs
  { keyword: "what does a free IT assessment cover", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/assessment" },
  { keyword: "is a free IT assessment really free", tier: "tier3", intent: "informational", targetPage: "/services/managed-it/assessment" },

  // From /services/seedtech-platform FAQs
  { keyword: "what is SEO Autopilot and is it included", tier: "tier3", intent: "informational", targetPage: "/services/seo-autopilot" },
  { keyword: "how long does a website build take", tier: "tier3", intent: "informational", targetPage: "/services/seedtech-platform" },
  { keyword: "can I update my website myself after launch", tier: "tier3", intent: "informational", targetPage: "/services/seedtech-platform" },

  // From /services/ecommerce-development FAQs
  { keyword: "Shopify vs BigCommerce vs WooCommerce which is best", tier: "tier3", intent: "informational", targetPage: "/services/ecommerce-development" },
  { keyword: "how long does ecommerce website build take", tier: "tier3", intent: "informational", targetPage: "/services/ecommerce-development" },
  { keyword: "can you migrate my existing ecommerce store", tier: "tier3", intent: "informational", targetPage: "/services/ecommerce-development" },

  // From /services/custom-development FAQs
  { keyword: "how does pricing work for custom web development", tier: "tier3", intent: "informational", targetPage: "/services/custom-development" },
  { keyword: "can you work with our existing codebase", tier: "tier3", intent: "informational", targetPage: "/services/custom-development" },

  // From industry page FAQs
  { keyword: "how do small trucking companies stand out online", tier: "tier3", intent: "informational", targetPage: "/industries/trucking" },
  { keyword: "what IT support does a trucking operation need", tier: "tier3", intent: "informational", targetPage: "/industries/trucking" },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 3 — PROBLEM-AWARE BLOG KEYWORDS (18)
  // Each maps to a specific article to be written.
  // ─────────────────────────────────────────────────────────────────────────

  // IT frustration / pain-point searches
  { keyword: "my IT company is not responsive what should I do", tier: "tier3", intent: "informational", targetPage: "/blog/signs-you-need-a-new-it-provider" },
  { keyword: "signs you need to switch IT providers", tier: "tier3", intent: "informational", targetPage: "/blog/signs-you-need-a-new-it-provider" },
  { keyword: "IT provider keeps sending different technicians", tier: "tier3", intent: "informational", targetPage: "/blog/why-your-msp-sends-a-different-tech-every-time" },
  { keyword: "managed IT vs break fix which is better", tier: "tier3", intent: "informational", targetPage: "/blog/managed-it-vs-break-fix" },
  { keyword: "should I outsource IT or hire in house", tier: "tier3", intent: "informational", targetPage: "/blog/outsource-it-vs-hire-in-house" },
  { keyword: "questions to ask before hiring an IT company", tier: "tier3", intent: "informational", targetPage: "/blog/questions-to-ask-before-hiring-an-msp" },

  // Cybersecurity concern searches (from assessment page stats: 60% close after breach)
  { keyword: "60 percent of small businesses close after cyberattack", tier: "tier3", intent: "informational", targetPage: "/blog/cybersecurity-stats-small-business" },
  { keyword: "small business cybersecurity checklist 2026", tier: "tier3", intent: "informational", targetPage: "/blog/cybersecurity-checklist-small-business" },
  { keyword: "how to prevent ransomware small business", tier: "tier3", intent: "informational", targetPage: "/blog/ransomware-prevention-guide" },
  { keyword: "do small businesses need endpoint security", tier: "tier3", intent: "informational", targetPage: "/blog/why-endpoint-security-matters" },

  // Web dev comparison / education searches
  { keyword: "Wix vs custom website for small business", tier: "tier3", intent: "informational", targetPage: "/blog/wix-vs-custom-website" },
  { keyword: "Squarespace vs Next.js for business website", tier: "tier3", intent: "informational", targetPage: "/blog/squarespace-vs-nextjs" },
  { keyword: "why is my website not getting traffic", tier: "tier3", intent: "informational", targetPage: "/blog/why-your-website-gets-no-traffic" },
  { keyword: "what should a small business website cost in 2026", tier: "tier3", intent: "informational", targetPage: "/blog/small-business-website-cost-2026" },
  { keyword: "is a custom website worth it over a template", tier: "tier3", intent: "informational", targetPage: "/blog/custom-website-vs-template" },

  // SEO / AI visibility (from SEO Autopilot page: "AI Overviews used by 1B+ people")
  { keyword: "how to get cited by ChatGPT and AI search", tier: "tier3", intent: "informational", targetPage: "/blog/how-to-get-cited-by-ai-search" },
  { keyword: "SEO for AI overviews and ChatGPT", tier: "tier3", intent: "informational", targetPage: "/blog/seo-for-ai-overviews" },
  { keyword: "what is AI visibility for websites", tier: "tier3", intent: "informational", targetPage: "/services/seo-autopilot" },
];

async function main() {
  // Wipe existing
  const deleted = await p.trackedKeyword.deleteMany({ where: { siteId: SITE_ID } });
  console.log(`🗑️  Deleted ${deleted.count} existing keywords`);

  // Set volume/competition to unknown for all
  const kws = keywords.map((k) => ({ ...k, volume: "unknown", competition: "unknown" }));

  const results = await Promise.allSettled(
    kws.map((kw) =>
      p.trackedKeyword.upsert({
        where: { siteId_keyword: { siteId: SITE_ID, keyword: kw.keyword } },
        update: { tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
        create: { siteId: SITE_ID, keyword: kw.keyword, tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
      })
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected");
  console.log(`✅ Imported ${succeeded}/${kws.length} keywords`);
  if (failed.length > 0) {
    failed.forEach((f) => console.log("  ❌ Failed:", (f as PromiseRejectedResult).reason?.message));
  }

  // Stats
  const t1 = kws.filter((k) => k.tier === "tier1").length;
  const t2 = kws.filter((k) => k.tier === "tier2").length;
  const t3 = kws.filter((k) => k.tier === "tier3").length;
  console.log("\n📊 Tier Breakdown:");
  console.log(`   Tier 1 (head terms): ${t1}`);
  console.log(`   Tier 2 (service/industry/local): ${t2}`);
  console.log(`   Tier 3 (questions/blog): ${t3}`);

  const intents: Record<string, number> = {};
  kws.forEach((k) => { intents[k.intent] = (intents[k.intent] || 0) + 1; });
  console.log("\n🎯 Intent:");
  Object.entries(intents).forEach(([k, v]) => console.log(`   ${k}: ${v}`));

  const pages = new Set(kws.map((k) => k.targetPage));
  console.log(`\n📄 Unique target pages: ${pages.size}`);

  // Blog articles needed
  const blogTargets = [...new Set(kws.filter((k) => k.targetPage.startsWith("/blog/")).map((k) => k.targetPage))];
  console.log(`\n📝 Blog articles to write (${blogTargets.length}):`);
  blogTargets.forEach((b) => console.log(`   ${b}`));

  // Coverage per page (top 15)
  const pageCoverage: Record<string, number> = {};
  kws.forEach((k) => { pageCoverage[k.targetPage] = (pageCoverage[k.targetPage] || 0) + 1; });
  console.log("\n📈 Keywords per page (top 15):");
  Object.entries(pageCoverage).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([pg, c]) => console.log(`   ${c} → ${pg}`));

  await p.$disconnect();
}

main().catch(console.error);
