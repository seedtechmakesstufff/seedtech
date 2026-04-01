/**
 * REACTIVE / PAIN-POINT KEYWORD EXPANSION — Managed IT
 *
 * THESIS: Most managed IT searches happen AFTER something breaks.
 * The business owner isn't browsing — they're panicking. These keywords
 * target the exact moment someone realizes they need professional IT:
 *
 *  1. CRISIS MOMENT — "something is broken RIGHT NOW"
 *  2. POST-INCIDENT — "that just happened and I need to prevent it"
 *  3. FRUSTRATION — "my current IT sucks and I've had enough"
 *  4. COMPLIANCE PANIC — "I just found out I'm not compliant"
 *  5. COST SHOCK — "I just got a bill and I'm questioning everything"
 *
 * Every keyword maps to either:
 *  - An existing service page (for commercial/transactional intent)
 *  - A specific blog article slug (for informational intent that funnels to services)
 *
 * These are the searches that happen at 2am when the server goes down,
 * Monday morning when email doesn't work, or Friday afternoon when
 * the owner gets a suspicious invoice from their current MSP.
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
  // CATEGORY 1: CRISIS MOMENT — "Something is broken RIGHT NOW"
  // These are panic searches. High conversion, low competition.
  // The person searching this is buying today.
  // ─────────────────────────────────────────────────────────────────────────

  // Email — the #1 crisis trigger for small businesses
  { keyword: "business email not working", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "medium", competition: "low" },
  { keyword: "company email down who to call", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "Office 365 email down small business", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },

  // Network / connectivity — offices grinding to a halt
  { keyword: "business internet keeps going down", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "office network keeps disconnecting", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "business wifi not working for employees", tier: "tier3", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },

  // Security breaches — the scariest moment
  { keyword: "my business got hacked what do I do", tier: "tier2", intent: "transactional", targetPage: "/services/cybersecurity", volume: "medium", competition: "low" },
  { keyword: "ransomware attacked my business", tier: "tier2", intent: "transactional", targetPage: "/services/cybersecurity", volume: "low", competition: "low" },
  { keyword: "business email compromised", tier: "tier2", intent: "transactional", targetPage: "/services/cybersecurity", volume: "medium", competition: "medium" },
  { keyword: "phishing attack hit my company", tier: "tier2", intent: "transactional", targetPage: "/services/cybersecurity", volume: "low", competition: "low" },
  { keyword: "employee clicked phishing link what now", tier: "tier3", intent: "informational", targetPage: "/blog/employee-clicked-phishing-link", volume: "low", competition: "low" },

  // Server / data — the existential threat
  { keyword: "business server crashed", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "lost business data no backup", tier: "tier2", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "company files missing from server", tier: "tier3", intent: "transactional", targetPage: "/services/managed-it", volume: "low", competition: "low" },

  // Computer / hardware
  { keyword: "employee computers running slow", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it", volume: "medium", competition: "low" },
  { keyword: "new employee needs computer setup fast", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 2: POST-INCIDENT — "That just happened, never again"
  // The breach/outage happened, dust settled, now they want prevention.
  // These convert slower but are high-value long-term clients.
  // ─────────────────────────────────────────────────────────────────────────

  { keyword: "how to prevent data breach small business", tier: "tier3", intent: "informational", targetPage: "/blog/prevent-data-breach-small-business", volume: "medium", competition: "medium" },
  { keyword: "business disaster recovery plan IT", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "medium" },
  { keyword: "backup solution for small business", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "medium", competition: "medium" },
  { keyword: "we got hit by ransomware how to recover", tier: "tier3", intent: "informational", targetPage: "/blog/ransomware-recovery-steps", volume: "low", competition: "low" },
  { keyword: "how to tell if your business has been hacked", tier: "tier3", intent: "informational", targetPage: "/blog/signs-your-business-has-been-hacked", volume: "low", competition: "low" },
  { keyword: "what to do after a data breach small business", tier: "tier3", intent: "informational", targetPage: "/blog/after-data-breach-next-steps", volume: "medium", competition: "low" },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 3: FRUSTRATION — "My current IT is useless"
  // The slow burn. Bad MSP experience finally boils over.
  // Maps to why-seedtech and switching content.
  // ─────────────────────────────────────────────────────────────────────────

  { keyword: "IT support takes too long to respond", tier: "tier3", intent: "commercial", targetPage: "/blog/signs-you-need-a-new-it-provider", volume: "low", competition: "low" },
  { keyword: "IT company never fixes the problem", tier: "tier3", intent: "commercial", targetPage: "/blog/signs-you-need-a-new-it-provider", volume: "low", competition: "low" },
  { keyword: "tired of IT company hidden fees", tier: "tier3", intent: "commercial", targetPage: "/blog/signs-your-it-company-is-overcharging", volume: "low", competition: "low" },
  { keyword: "IT provider not proactive just reactive", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },
  { keyword: "same IT problems keep happening", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },
  { keyword: "is my IT company doing anything", tier: "tier3", intent: "informational", targetPage: "/blog/is-your-it-company-actually-doing-anything", volume: "low", competition: "low" },
  { keyword: "how to fire your IT company", tier: "tier3", intent: "informational", targetPage: "/blog/how-to-switch-it-providers-without-downtime", volume: "low", competition: "low" },
  { keyword: "switching IT companies without downtime", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/onboarding", volume: "low", competition: "low" },
  { keyword: "unhappy with managed service provider", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 4: COMPLIANCE PANIC — "I just found out I'm not compliant"
  // Insurance audits, client requirements, regulatory deadlines.
  // ─────────────────────────────────────────────────────────────────────────

  { keyword: "cyber insurance denied need IT security", tier: "tier2", intent: "commercial", targetPage: "/services/cybersecurity", volume: "low", competition: "low" },
  { keyword: "MFA requirement for cyber insurance", tier: "tier3", intent: "informational", targetPage: "/blog/cyber-insurance-it-requirements", volume: "low", competition: "low" },
  { keyword: "client requires SOC 2 compliance help", tier: "tier2", intent: "commercial", targetPage: "/services/cybersecurity", volume: "low", competition: "medium" },
  { keyword: "HIPAA IT requirements small practice", tier: "tier2", intent: "commercial", targetPage: "/industries/medical", volume: "low", competition: "low" },
  { keyword: "law firm data security requirements NJ", tier: "tier2", intent: "commercial", targetPage: "/industries/law-firms", volume: "low", competition: "low" },
  { keyword: "failed security audit what now", tier: "tier3", intent: "informational", targetPage: "/blog/failed-security-audit-next-steps", volume: "low", competition: "low" },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 5: COST SHOCK — "I'm paying too much / can't afford this"
  // Budget pressure creates switching intent.
  // ─────────────────────────────────────────────────────────────────────────

  { keyword: "IT support too expensive for small business", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },
  { keyword: "affordable managed IT services NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "medium", competition: "medium" },
  { keyword: "managed IT pricing per employee", tier: "tier2", intent: "commercial", targetPage: "/pricing/it-support", volume: "medium", competition: "medium" },
  { keyword: "how much should IT support cost per user", tier: "tier3", intent: "informational", targetPage: "/blog/what-should-it-support-cost-per-user", volume: "medium", competition: "low" },
  { keyword: "IT company locked me into a contract", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it/why-seedtech", volume: "low", competition: "low" },
  { keyword: "no contract IT support", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 6: GROWTH TRIGGER — "We outgrew our setup"
  // The business scaled and the old approach doesn't work anymore.
  // ─────────────────────────────────────────────────────────────────────────

  { keyword: "outgrew break fix need managed IT", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "IT support for growing business NJ", tier: "tier2", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "hired 10 employees need IT setup", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "opening second office need IT support", tier: "tier3", intent: "commercial", targetPage: "/services/managed-it", volume: "low", competition: "low" },
  { keyword: "nephew does our IT need professional help", tier: "tier3", intent: "commercial", targetPage: "/blog/when-to-stop-using-your-nephew-for-it", volume: "low", competition: "low" },
];

async function main() {
  console.log(`\n🚨 REACTIVE / PAIN-POINT KEYWORD EXPANSION`);
  console.log(`   Adding ${keywords.length} crisis & pain-point keywords\n`);

  const results = await Promise.allSettled(
    keywords.map((kw) =>
      p.trackedKeyword.upsert({
        where: { siteId_keyword: { siteId: SITE_ID, keyword: kw.keyword } },
        update: { tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
        create: { siteId: SITE_ID, keyword: kw.keyword, tier: kw.tier as any, intent: kw.intent as any, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition },
      })
    )
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  const fail = results.filter((r) => r.status === "rejected");
  console.log(`   ✅ Imported: ${ok}/${keywords.length}`);
  if (fail.length > 0) fail.forEach((f) => console.log(`   ❌ ${(f as PromiseRejectedResult).reason?.message}`));

  // Category breakdown
  const categories = {
    "Crisis Moment (broken right now)": keywords.filter((_, i) => i < 16).length,
    "Post-Incident (prevent next time)": keywords.filter((_, i) => i >= 16 && i < 22).length,
    "Frustration (bad MSP experience)": keywords.filter((_, i) => i >= 22 && i < 31).length,
    "Compliance Panic": keywords.filter((_, i) => i >= 31 && i < 37).length,
    "Cost Shock": keywords.filter((_, i) => i >= 37 && i < 43).length,
    "Growth Trigger (outgrew setup)": keywords.filter((_, i) => i >= 43).length,
  };
  console.log(`\n📊 By Pain Category:`);
  Object.entries(categories).forEach(([cat, count]) => console.log(`   ${count} → ${cat}`));

  // New blog articles this creates
  const newBlogSlugs = [...new Set(keywords.filter((k) => k.targetPage.startsWith("/blog/")).map((k) => k.targetPage))];
  console.log(`\n📝 NEW blog articles needed (${newBlogSlugs.length}):`);
  newBlogSlugs.forEach((s) => console.log(`   ${s}`));

  // Final total
  const total = await p.trackedKeyword.count({ where: { siteId: SITE_ID } });
  const byTier = await p.trackedKeyword.groupBy({ by: ["tier"], where: { siteId: SITE_ID }, _count: { tier: true } });
  const byIntent = await p.trackedKeyword.groupBy({ by: ["intent"], where: { siteId: SITE_ID }, _count: { intent: true } });

  console.log(`\n════════════════════════════════════════════════`);
  console.log(`📊 TOTAL KEYWORD INVENTORY: ${total}`);
  console.log(`════════════════════════════════════════════════`);
  console.log(`\nBy Tier:`);
  byTier.forEach((t) => console.log(`   ${t.tier}: ${t._count.tier}`));
  console.log(`\nBy Intent:`);
  byIntent.forEach((i) => console.log(`   ${i.intent}: ${i._count.intent}`));
  console.log("");

  await p.$disconnect();
}

main().catch(console.error);
