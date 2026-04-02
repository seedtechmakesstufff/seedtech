/**
 * KEYWORD STRATEGY v3 PATCH — Additions from AI Full Audit
 *
 * The AI Keyword Research agent ran a full audit against the 92 v3 keywords
 * and GSC data. Key finding: 94% of organic clicks are brand queries
 * ("seed tech" variations) — almost zero service keyword traffic yet.
 *
 * This patch:
 *  1. Adds ~18 high-value keywords the AI identified that v3 missed
 *  2. Re-tiers 3 keywords the AI correctly flagged as under-prioritized
 *  3. Removes 2 keywords that conflict with positioning
 *  4. Updates 1 target page assignment
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

async function main() {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. ADD NEW KEYWORDS (from AI audit suggestions, filtered for quality)
  // ─────────────────────────────────────────────────────────────────────────

  const newKeywords = [
    // "Near me" queries — we completely missed these, they're massive
    { keyword: "IT support near me", tier: "tier1", intent: "transactional", targetPage: "/services/managed-it", volume: "high", competition: "medium" },
    { keyword: "managed IT services near me", tier: "tier1", intent: "transactional", targetPage: "/services/managed-it", volume: "high", competition: "medium" },

    // Emergency/crisis — high conversion, low competition
    { keyword: "server down emergency IT support NJ", tier: "tier1", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },

    // Problem-aware searches that lead to services
    { keyword: "website not showing up on Google", tier: "tier2", intent: "commercial", targetPage: "/services/seo-autopilot", volume: "medium", competition: "low" },
    { keyword: "IT company that actually answers the phone", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },
    { keyword: "Office 365 support small business NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "medium", competition: "medium" },

    // Competitor displacement
    { keyword: "replace Geek Squad for business", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },

    // Late-stage evaluation
    { keyword: "NJ web design company reviews", tier: "tier2", intent: "commercial", targetPage: "/reviews", volume: "medium", competition: "medium" },

    // Local geo expansion — specific business hubs
    { keyword: "IT support Warren County NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
    { keyword: "Parsippany IT support company", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
    { keyword: "Morristown managed IT services", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "medium" },

    // Trending / emerging
    { keyword: "Microsoft Copilot setup small business", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
    { keyword: "cybersecurity insurance audit requirements", tier: "tier2", intent: "commercial", targetPage: "/services/cybersecurity", volume: "medium", competition: "low" },
    { keyword: "AI tools for small business IT", tier: "tier3", intent: "informational", targetPage: "/blog/ai-tools-business-productivity", volume: "medium", competition: "medium" },
    { keyword: "hybrid work IT setup for small business", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "medium", competition: "medium" },

    // Brand protection
    { keyword: "SeedTech LLC New Jersey", tier: "tier1", intent: "navigational", targetPage: "/", volume: "low", competition: "low" },

    // Blog content gaps — crisis/pain-point
    { keyword: "signs your IT company is overcharging you", tier: "tier3", intent: "informational", targetPage: "/blog/signs-your-it-company-is-overcharging", volume: "medium", competition: "low" },
    { keyword: "what to do when your website gets hacked", tier: "tier3", intent: "informational", targetPage: "/blog/website-hacked-response-plan", volume: "medium", competition: "medium" },
  ];

  console.log(`\n📥 Adding ${newKeywords.length} new keywords from AI audit...\n`);

  const addResults = await Promise.allSettled(
    newKeywords.map((kw) =>
      p.trackedKeyword.upsert({
        where: { siteId_keyword: { siteId: SITE_ID, keyword: kw.keyword } },
        update: { tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
        create: { siteId: SITE_ID, keyword: kw.keyword, tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
      })
    )
  );

  const addedOk = addResults.filter((r) => r.status === "fulfilled").length;
  const addedFail = addResults.filter((r) => r.status === "rejected");
  console.log(`   ✅ Added: ${addedOk}/${newKeywords.length}`);
  if (addedFail.length > 0) {
    addedFail.forEach((f) => console.log(`   ❌ Failed: ${(f as PromiseRejectedResult).reason?.message}`));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. RE-TIER KEYWORDS (AI correctly identified these as under-prioritized)
  // ─────────────────────────────────────────────────────────────────────────

  const retiers = [
    // "free IT assessment" has strong conversion intent — should be tier1
    { keyword: "free IT assessment New Jersey", newTier: "tier1" },
    // These are core head terms, not secondary
    { keyword: "IT support for small business NJ", newTier: "tier1" },
    { keyword: "managed service provider New Jersey", newTier: "tier1" },
  ];

  console.log(`\n🔄 Re-tiering ${retiers.length} keywords...\n`);

  for (const rt of retiers) {
    try {
      const updated = await p.trackedKeyword.updateMany({
        where: { siteId: SITE_ID, keyword: rt.keyword },
        data: { tier: rt.newTier as any },
      });
      console.log(`   ${updated.count > 0 ? "✅" : "⚠️"} "${rt.keyword}" → ${rt.newTier} (${updated.count} updated)`);
    } catch (err: any) {
      console.log(`   ❌ "${rt.keyword}": ${err.message}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. REMOVE LOW-VALUE KEYWORDS (AI flagged, agree with rationale)
  // ─────────────────────────────────────────────────────────────────────────

  const toRemove = [
    // Too technical for the audience, conflicts with service positioning
    "SEO for AI overviews and ChatGPT",
    // Self-service angle conflicts with full-service positioning
    "can I update my website myself after launch",
  ];

  console.log(`\n🗑️  Removing ${toRemove.length} low-value keywords...\n`);

  for (const kw of toRemove) {
    try {
      const deleted = await p.trackedKeyword.deleteMany({
        where: { siteId: SITE_ID, keyword: kw },
      });
      console.log(`   ${deleted.count > 0 ? "✅" : "⚠️"} "${kw}" (${deleted.count} removed)`);
    } catch (err: any) {
      console.log(`   ❌ "${kw}": ${err.message}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FIX TARGET PAGE ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────

  console.log(`\n🔧 Fixing target page assignments...\n`);

  try {
    const fixed = await p.trackedKeyword.updateMany({
      where: { siteId: SITE_ID, keyword: "unlimited help desk IT support" },
      data: { targetPage: "/services/managed-it/plans" },
    });
    console.log(`   ${fixed.count > 0 ? "✅" : "⚠️"} "unlimited help desk IT support" → /services/managed-it/plans (${fixed.count} updated)`);
  } catch (err: any) {
    console.log(`   ❌ Target page fix: ${err.message}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FINAL COUNT
  // ─────────────────────────────────────────────────────────────────────────

  const finalCount = await p.trackedKeyword.count({ where: { siteId: SITE_ID } });
  const byTier = await p.trackedKeyword.groupBy({
    by: ["tier"],
    where: { siteId: SITE_ID },
    _count: { tier: true },
  });
  const byIntent = await p.trackedKeyword.groupBy({
    by: ["intent"],
    where: { siteId: SITE_ID },
    _count: { intent: true },
  });

  console.log(`\n════════════════════════════════════════════════`);
  console.log(`📊 FINAL KEYWORD INVENTORY: ${finalCount} keywords`);
  console.log(`════════════════════════════════════════════════`);
  console.log(`\n📊 By Tier:`);
  byTier.forEach((t) => console.log(`   ${t.tier}: ${t._count.tier}`));
  console.log(`\n🎯 By Intent:`);
  byIntent.forEach((i) => console.log(`   ${i.intent}: ${i._count.intent}`));

  // Count blog articles needed
  const blogKeywords = await p.trackedKeyword.findMany({
    where: { siteId: SITE_ID, targetPage: { startsWith: "/blog/" } },
    select: { targetPage: true },
  });
  const blogArticles = Array.from(new Set(blogKeywords.map((k) => k.targetPage)));
  console.log(`\n📝 Blog articles to write: ${blogArticles.length}`);
  blogArticles.forEach((b) => console.log(`   ${b}`));

  console.log("");
  await p.$disconnect();
}

main().catch(console.error);
