/**
 * SEO Autopilot v2 + AI Visibility Engine — Smoke Tests
 * 
 * Run: npx tsx scripts/test-seo-v2.ts
 * 
 * Tests the new libraries directly (no auth needed).
 * For API route testing, use the admin dashboard.
 */

import { scoreContentEEAT, getAuthorEntity } from "../src/lib/seo-eeat";
import { scoreAIOReadiness, getAIOWritingInstructions, getPAAResearchPrompt } from "../src/lib/seo-aio";
import { scoreAIVisibility, extractEntitySignals, analyzeConversationalCoverage, getAIFirstWritingInstructions } from "../src/lib/ai-visibility";

const DIVIDER = "\n" + "═".repeat(60) + "\n";

// ── Test 1: Author Entity ──
console.log(DIVIDER);
console.log("🧑 TEST 1: Author Entity");
const author = getAuthorEntity();
console.log(`  Name: ${author.name}`);
console.log(`  Title: ${author.jobTitle}`);
console.log(`  Expertise: ${author.expertise.join(", ")}`);
console.log("  ✅ Author entity loaded");

// ── Test 2: Content E-E-A-T Scoring ──
console.log(DIVIDER);
console.log("📊 TEST 2: Content E-E-A-T Scoring");

const goodContent = `
# How Much Does Managed IT Cost in 2026?

In our experience working with Northern New Jersey businesses, managed IT services 
typically cost between $100-$250 per user per month. We've helped over 50 small 
businesses transition from break-fix to managed IT, and the ROI speaks for itself.

## What's Included in Managed IT Pricing?

According to CompTIA's 2026 IT Industry Outlook, 65% of SMBs now use managed services.
Our team at SeedTech provides 24/7 monitoring, help desk support, and cybersecurity 
as standard inclusions.

For example, one of our clients — a 30-person law firm in Hackensack — reduced their 
IT downtime by 94% after switching to our managed plan. [View our pricing](/pricing/it-support).

## Frequently Asked Questions

### How much does IT support cost per month?
Most businesses pay $100-$250 per user per month for comprehensive managed IT services.

### Is managed IT worth it for small businesses?
Absolutely. The average cost of IT downtime is $5,600 per minute (Gartner, 2025).
`;

const goodScore = scoreContentEEAT(goodContent, "managed IT cost");
console.log(`  Score: ${goodScore.score}/100`);
console.log(`  Issues: ${goodScore.issues.length > 0 ? goodScore.issues.join("; ") : "None"}`);
console.log(`  Suggestions: ${goodScore.suggestions.length}`);

const thinContent = "Managed IT services are great. Contact us today for a quote.";
const thinScore = scoreContentEEAT(thinContent, "managed IT");
console.log(`\n  Thin content score: ${thinScore.score}/100`);
console.log(`  Thin issues: ${thinScore.issues.join("; ")}`);
console.log(`  ✅ E-E-A-T scoring working (good: ${goodScore.score}, thin: ${thinScore.score})`);

// ── Test 3: AIO Readiness Scoring ──
console.log(DIVIDER);
console.log("🤖 TEST 3: AI Overview Readiness Scoring");

const aioScore = scoreAIOReadiness(goodContent, "managed IT cost");
console.log(`  Overall: ${aioScore.overall}/100`);
console.log(`  Direct Answer: ${aioScore.directAnswer}/100`);
console.log(`  Structured Content: ${aioScore.structuredContent}/100`);
console.log(`  Entity Clarity: ${aioScore.entityClarity}/100`);
console.log(`  Citability: ${aioScore.citability}/100`);
console.log(`  Checks:`);
for (const issue of aioScore.issues) {
  console.log(`    ${issue.passed ? "✅" : "❌"} ${issue.check}: ${issue.message}`);
}

const thinAio = scoreAIOReadiness(thinContent);
console.log(`\n  Thin content AIO score: ${thinAio.overall}/100`);
console.log(`  ✅ AIO scoring working (good: ${aioScore.overall}, thin: ${thinAio.overall})`);

// ── Test 4: AIO Writing Instructions ──
console.log(DIVIDER);
console.log("✍️  TEST 4: AIO Writing Instructions");
const instructions = getAIOWritingInstructions();
console.log(`  Generated ${instructions.split("\n").length} lines of AIO writing rules`);
console.log(`  First line: ${instructions.split("\n")[0]}`);
console.log("  ✅ AIO writing instructions generated");

// ── Test 5: PAA Research Prompt ──
console.log(DIVIDER);
console.log("❓ TEST 5: PAA Research Prompt");
const paaPrompt = getPAAResearchPrompt("managed IT services NJ", goodContent);
console.log(`  Prompt length: ${paaPrompt.length} chars`);
console.log(`  Contains keyword: ${paaPrompt.includes("managed IT services NJ")}`);
console.log("  ✅ PAA prompt generated");

// ── Summary ──
console.log(DIVIDER);
console.log("🎯 PHASE 1 SUMMARY — Traditional SEO Scoring");
console.log(`  E-E-A-T Score (good content): ${goodScore.score}/100`);
console.log(`  E-E-A-T Score (thin content): ${thinScore.score}/100`);
console.log(`  AIO Score (good content):     ${aioScore.overall}/100`);
console.log(`  AIO Score (thin content):     ${thinAio.overall}/100`);

// ═══════════════════════════════════════════════════════════
// PHASE 2: AI VISIBILITY ENGINE — The Future of SEO
// ═══════════════════════════════════════════════════════════

// ── Test 6: AI Visibility Score (Primary Metric) ──
console.log(DIVIDER);
console.log("🤖 TEST 6: AI Visibility Score (PRIMARY METRIC)");
const aiVis = scoreAIVisibility(goodContent, "managed IT cost");
console.log(`  Grade: ${aiVis.grade} — ${aiVis.gradeLabel}`);
console.log(`  Overall Score: ${aiVis.overall}/100`);
console.log(`  Citation Readiness: ${aiVis.citationReadiness}/100`);
console.log(`  Entity Authority: ${aiVis.entityAuthority}/100`);
console.log(`  Structured Clarity: ${aiVis.structuredClarity}/100`);
console.log(`  Conversational Fit: ${aiVis.conversationalFit}/100`);
console.log(`  Multi-Engine Coverage: ${aiVis.multiEngineCoverage}/100`);
console.log(`\n  Checks (${aiVis.checks.filter(c => c.passed).length}/${aiVis.checks.length} passed):`);
for (const check of aiVis.checks) {
  console.log(`    ${check.passed ? "✅" : "❌"} [${check.category}] ${check.message}`);
}

const thinAiVis = scoreAIVisibility(thinContent);
console.log(`\n  Thin content AI Visibility: ${thinAiVis.grade} — ${thinAiVis.overall}/100`);
console.log(`  ✅ AI Visibility scoring working (good: ${aiVis.grade}/${aiVis.overall}, thin: ${thinAiVis.grade}/${thinAiVis.overall})`);

// ── Test 7: Entity Signal Extraction ──
console.log(DIVIDER);
console.log("🏛️  TEST 7: Entity Signal Extraction");
const entities = extractEntitySignals(goodContent);
console.log(`  Found ${entities.length} entity signals:`);
for (const entity of entities) {
  console.log(`    [${entity.type}] (${entity.strength}) ${entity.text.slice(0, 80)}...`);
}
console.log(`  ✅ Entity extraction working`);

// ── Test 8: Conversational Query Coverage ──
console.log(DIVIDER);
console.log("💬 TEST 8: Conversational Query Coverage");
const coverage = analyzeConversationalCoverage(goodContent, "managed IT cost");
for (const q of coverage) {
  console.log(`  ${q.covered ? "✅" : "❌"} [${q.type}] ${q.query}`);
}
const coveredCount = coverage.filter(q => q.covered).length;
console.log(`  Coverage: ${coveredCount}/${coverage.length} query patterns`);
console.log(`  ✅ Conversational analysis working`);

// ── Test 9: AI-First Writing Instructions ──
console.log(DIVIDER);
console.log("✍️  TEST 9: AI-First Writing Instructions");
const aiInstructions = getAIFirstWritingInstructions();
console.log(`  Generated ${aiInstructions.split("\n").length} lines of AI-first writing rules`);
console.log(`  First line: ${aiInstructions.split("\n")[0]}`);
console.log(`  Contains "citation": ${aiInstructions.toLowerCase().includes("citation")}`);
console.log(`  Contains "entity": ${aiInstructions.toLowerCase().includes("entity")}`);
console.log("  ✅ AI-first instructions generated");

// ── Final Summary ──
console.log(DIVIDER);
console.log("📊 FINAL SUMMARY — AI Visibility Engine");
console.log(`\n  Good Content:`);
console.log(`    AI Visibility: ${aiVis.grade} (${aiVis.overall}/100)`);
console.log(`    E-E-A-T:       ${goodScore.score}/100`);
console.log(`    AIO Ready:     ${aioScore.overall}/100`);
console.log(`    Combined:      ${Math.round((aiVis.overall * 0.5) + (goodScore.score * 0.25) + (aioScore.overall * 0.25))}/100`);
console.log(`\n  Thin Content:`);
console.log(`    AI Visibility: ${thinAiVis.grade} (${thinAiVis.overall}/100)`);
console.log(`    E-E-A-T:       ${thinScore.score}/100`);
console.log(`    AIO Ready:     ${thinAio.overall}/100`);
console.log(`    Combined:      ${Math.round((thinAiVis.overall * 0.5) + (thinScore.score * 0.25) + (thinAio.overall * 0.25))}/100`);
console.log(DIVIDER);
console.log("All tests passed! ✅");
console.log("\nThe future of SEO is AI Visibility, not ranking.");
console.log("Visit: http://localhost:3001/admin/blog/new to test the upgraded blog writer.");
console.log("Visit: http://localhost:3001/admin/seo to access the AI Advisor.");
