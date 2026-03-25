/* ── AI Visibility Engine ──
 *
 * The future of SEO isn't ranking — it's being CITED by AI.
 *
 * Traditional search ranking is declining in relevance as AI-driven results
 * (Google AI Overviews, ChatGPT, Perplexity, Gemini, Copilot) now answer
 * ~65% of queries without a click. The winning strategy is:
 *
 *   1. Be the definitive source AI systems cite
 *   2. Build entity authority that LLMs recognize
 *   3. Structure content for machine comprehension
 *   4. Optimize for conversational queries, not just keywords
 *   5. Make your brand unforgettable to AI training pipelines
 *
 * This module replaces the "rank higher" paradigm with "get cited by AI".
 * It scores content, pages, and entire sites for AI visibility across
 * multiple AI platforms — not just Google.
 *
 * Used by: Blog Writer, Content Scorer, AI Advisor, Cron Pipeline
 */

import type { SiteScoringConfig } from "@/lib/site-scoring-config";
import { buildFreshnessRegex } from "@/lib/site-scoring-config";

/* ── Types ── */

export interface AIVisibilityScore {
  overall: number; // 0-100 — the single number that matters
  citationReadiness: number; // Will AI quote this content?
  entityAuthority: number; // Does this establish brand as a known entity?
  structuredClarity: number; // Can machines parse this easily?
  conversationalFit: number; // Does this answer how people actually ask AI?
  multiEngineCoverage: number; // Optimized for Google AIO + ChatGPT + Perplexity + Gemini?
  checks: AIVisibilityCheck[];
  grade: "A" | "B" | "C" | "D" | "F"; // Letter grade for quick visual
  gradeLabel: string; // e.g. "AI-Ready", "Needs Work", "Not Visible"
}

export interface AIVisibilityCheck {
  category: "citation" | "entity" | "structure" | "conversational" | "multi-engine";
  check: string;
  passed: boolean;
  weight: number; // How much this matters (1-10)
  message: string;
  fix?: string;
}

export interface EntitySignal {
  type: "definition" | "claim" | "credential" | "attribution" | "relationship";
  text: string;
  strength: "strong" | "medium" | "weak";
}

export interface ConversationalQuery {
  query: string;
  type: "how" | "what" | "why" | "when" | "which" | "comparison" | "recommendation";
  covered: boolean; // Does the content address this query pattern?
}

/* ── Main Scoring Function ── */

/**
 * Score content for AI Visibility — the likelihood that AI systems
 * (Google AIO, ChatGPT, Perplexity, Gemini) will cite this content.
 *
 * This is the PRIMARY metric for content quality in 2026+.
 */
export function scoreAIVisibility(
  markdown: string,
  targetKeyword?: string,
  brandName: string = "SeedTech",
  siteConfig?: SiteScoringConfig
): AIVisibilityScore {
  const checks: AIVisibilityCheck[] = [];

  // Use siteConfig brandName if available, otherwise fall back to parameter
  const effectiveBrand = siteConfig?.brandName || brandName;

  // ═══════════════════════════════════════
  // 1. CITATION READINESS — Will AI quote you?
  // ═══════════════════════════════════════

  // 1a. Citeable opening block (direct answer in first 60 words)
  const paragraphs = markdown.split(/\n\n/).filter((p) => p.trim() && !p.startsWith("#"));
  const firstParagraph = paragraphs[0] || "";
  const firstWords = firstParagraph.split(/\s+/).length;
  const hasCiteableOpening = firstWords >= 15 && firstWords <= 80;
  const openingHasKeyword = targetKeyword
    ? firstParagraph.toLowerCase().includes(targetKeyword.toLowerCase())
    : true;

  checks.push({
    category: "citation",
    check: "citeable-opening",
    passed: hasCiteableOpening && openingHasKeyword,
    weight: 9,
    message: hasCiteableOpening && openingHasKeyword
      ? `Opening paragraph (${firstWords} words) is citeable with keyword present`
      : `Opening paragraph is ${firstWords} words${!openingHasKeyword ? ", missing keyword" : ""} — AI needs a 15-60 word quotable answer upfront`,
    fix: hasCiteableOpening && openingHasKeyword
      ? undefined
      : `Start with a direct, quotable answer that includes your target keyword. Keep it 20-60 words.`,
  });

  // 1b. Citeable blocks (short, dense, fact-rich paragraphs)
  const citeableParagraphs = paragraphs.filter((p) => {
    const words = p.split(/\s+/).length;
    return words >= 15 && words <= 80;
  });
  const citeableRatio = paragraphs.length > 0 ? citeableParagraphs.length / paragraphs.length : 0;
  checks.push({
    category: "citation",
    check: "citeable-density",
    passed: citeableRatio >= 0.5,
    weight: 7,
    message: citeableRatio >= 0.5
      ? `${Math.round(citeableRatio * 100)}% of paragraphs are citeable length (15-80 words)`
      : `Only ${Math.round(citeableRatio * 100)}% of paragraphs are citeable — AI systems extract short, complete thoughts`,
    fix: citeableRatio >= 0.5
      ? undefined
      : "Break long paragraphs into 2-4 sentence blocks. Each should express one complete, quotable idea.",
  });

  // 1c. Contains data/statistics (AI loves citing specific numbers)
  const dataPoints = (markdown.match(/\d+%|\$[\d,]+|\d+ (percent|million|billion|thousand|hours|days|minutes)/gi) || []).length;
  checks.push({
    category: "citation",
    check: "data-richness",
    passed: dataPoints >= 3,
    weight: 8,
    message: dataPoints >= 3
      ? `${dataPoints} data points found — AI prefers content with specific numbers and statistics`
      : `Only ${dataPoints} data point(s) — AI systems strongly prefer citing content with specific numbers`,
    fix: dataPoints >= 3
      ? undefined
      : "Add specific numbers: costs, percentages, timeframes, statistics. E.g., '87% of businesses that experience a breach without an incident response plan fail within 12 months.'",
  });

  // 1d. Comparison tables (most-cited format across all AI platforms)
  const tableCount = (markdown.match(/\|.*\|.*\|/gm) || []).filter((line) => !line.match(/^[\s|:-]+$/)).length;
  const hasTables = tableCount >= 4; // At least header + separator + 2 data rows
  checks.push({
    category: "citation",
    check: "comparison-tables",
    passed: hasTables,
    weight: 8,
    message: hasTables
      ? "Comparison table found — tables are the #1 most-cited content format in AI answers"
      : "No comparison tables — AI platforms cite tables more than any other content format",
    fix: hasTables
      ? undefined
      : "Add a comparison table. Examples: 'Break-Fix vs Managed IT', 'Pricing Tiers', 'Feature Comparison'. Use Markdown table syntax.",
  });

  // ═══════════════════════════════════════
  // 2. ENTITY AUTHORITY — Does AI know who you are?
  // ═══════════════════════════════════════

  // 2a. Brand/entity self-definition
  const brandMentions = (markdown.match(new RegExp(effectiveBrand, "gi")) || []).length;
  const hasBrandDefinition = new RegExp(
    `${effectiveBrand}\\s+(is|provides|offers|specializes|delivers|helps)`, "i"
  ).test(markdown);
  checks.push({
    category: "entity",
    check: "brand-definition",
    passed: hasBrandDefinition && brandMentions >= 2,
    weight: 9,
    message: hasBrandDefinition
      ? `Brand "${effectiveBrand}" is clearly defined as an entity (${brandMentions} mentions)`
      : `No clear entity definition for "${effectiveBrand}" — AI needs to understand WHO is making these claims`,
    fix: hasBrandDefinition
      ? undefined
      : `Add a sentence like '${effectiveBrand} is a ${siteConfig?.description || "company"} serving ${siteConfig?.geographicTerms?.[0] || "your area"}.' This helps AI build your entity graph.`,
  });

  // 2b. Author/expertise attribution
  const hasAuthorSignals = /\b(our team|our experts?|we've|in our experience|we recommend|our (CEO|CTO|engineers?))\b/i.test(markdown);
  const credentialRegex = siteConfig?.credentialRegex || /\b(certified|certification|CompTIA|CISSP|CISM|Microsoft|AWS|years of experience)\b/i;
  const hasCredentials = credentialRegex.test(markdown);
  checks.push({
    category: "entity",
    check: "expertise-signals",
    passed: hasAuthorSignals && hasCredentials,
    weight: 7,
    message: hasAuthorSignals && hasCredentials
      ? "Expert attribution and credentials present — strong entity authority signal"
      : hasAuthorSignals
        ? "First-person expertise present but no credentials mentioned"
        : "No expertise attribution — AI needs to verify the source is qualified to make these claims",
    fix: hasAuthorSignals && hasCredentials
      ? undefined
      : siteConfig?.defaultAuthor?.credentials?.length
        ? `Add credibility signals: '${siteConfig.defaultAuthor.credentials[0]}-certified team' or '${siteConfig.defaultAuthor.experience || "experienced professionals"}'.`
        : "Add credibility signals: mention certifications, years of experience, or qualifications.",
  });

  // 2c. Entity relationships (connecting to known entities)
  const entityRegex = siteConfig?.knownEntityRegex ||
    /\b(Microsoft|Google|Amazon|AWS|Azure|Cisco|NIST|CISA|CompTIA|Apple|Dell|HP|Fortinet|SonicWall|Datto|ConnectWise)\b/gi;
  const knownEntityMentions = (markdown.match(entityRegex) || []).length;
  checks.push({
    category: "entity",
    check: "entity-relationships",
    passed: knownEntityMentions >= 3,
    weight: 6,
    message: knownEntityMentions >= 3
      ? `${knownEntityMentions} references to known entities — strengthens your entity graph`
      : `Only ${knownEntityMentions} known entity reference(s) — connect your content to entities AI already knows`,
    fix: knownEntityMentions >= 3
      ? undefined
      : "Reference well-known entities naturally: technologies (Microsoft 365, Azure), standards (NIST, CIS), vendors you partner with.",
  });

  // 2d. Geographic entity (local authority for service businesses)
  const geoRegex = siteConfig?.geographicRegex ||
    /\b(New Jersey|NJ|Northern New Jersey|Bergen County|Passaic County|Essex County|Morris County)\b/i;
  const hasGeoEntity = geoRegex.test(markdown);
  const geoExample = siteConfig?.geographicTerms?.[0] || "your service area";
  checks.push({
    category: "entity",
    check: "geographic-authority",
    passed: hasGeoEntity,
    weight: 5,
    message: hasGeoEntity
      ? "Geographic entity anchoring present — establishes local authority"
      : "No geographic anchoring — for a service business, AI needs to know WHERE you operate",
    fix: hasGeoEntity
      ? undefined
      : `Mention your service area naturally: 'businesses in ${geoExample}' or reference your local area.`,
  });

  // ═══════════════════════════════════════
  // 3. STRUCTURED CLARITY — Can machines parse this?
  // ═══════════════════════════════════════

  // 3a. Clear heading hierarchy
  const h2Count = (markdown.match(/^## /gm) || []).length;
  const h3Count = (markdown.match(/^### /gm) || []).length;
  const goodHeadingStructure = h2Count >= 3 && h3Count >= 2;
  checks.push({
    category: "structure",
    check: "heading-hierarchy",
    passed: goodHeadingStructure,
    weight: 7,
    message: goodHeadingStructure
      ? `${h2Count} H2 + ${h3Count} H3 headings — clear semantic structure for AI parsing`
      : `${h2Count} H2 + ${h3Count} H3 — AI needs at least 3 H2 + 2 H3 headings to understand content structure`,
    fix: goodHeadingStructure
      ? undefined
      : "Add more section headings. Use ## for main topics and ### for subtopics. Each should be descriptive.",
  });

  // 3b. Definition-style content ("X is Y" patterns)
  const definitionPatterns = [
    /\b\w[\w\s]+\s+(is|are|refers? to|means?|describes?)\s+/i,
    /\bdefined as\b/i,
    /\bknown as\b/i,
    /\ba type of\b/i,
  ];
  const definitionCount = definitionPatterns.filter((r) => r.test(markdown)).length;
  checks.push({
    category: "structure",
    check: "definitions",
    passed: definitionCount >= 2,
    weight: 8,
    message: definitionCount >= 2
      ? `${definitionCount} definition patterns found — AI extracts these for knowledge graphs`
      : "Not enough definition-style content — AI builds knowledge from 'X is Y' style statements",
    fix: definitionCount >= 2
      ? undefined
      : "Add clear definitions: 'Managed IT services are ongoing IT support...', 'A managed service provider (MSP) is...'",
  });

  // 3c. Lists (ordered and unordered — AI loves extracting lists)
  const orderedListItems = (markdown.match(/^\d+\.\s/gm) || []).length;
  const unorderedListItems = (markdown.match(/^[-*]\s/gm) || []).length;
  const hasSubstantialLists = orderedListItems >= 3 || unorderedListItems >= 5;
  checks.push({
    category: "structure",
    check: "list-content",
    passed: hasSubstantialLists,
    weight: 6,
    message: hasSubstantialLists
      ? `${orderedListItems} numbered + ${unorderedListItems} bullet items — AI frequently cites list content`
      : "Insufficient list content — AI platforms extract and cite bulleted/numbered lists",
    fix: hasSubstantialLists
      ? undefined
      : "Add numbered steps for processes and bullet lists for features/benefits. Lists are extracted directly into AI answers.",
  });

  // 3d. FAQ section (explicit Q&A block)
  const hasFAQ = /#{2,3}\s*(FAQ|Frequently Asked|Common Questions)/i.test(markdown);
  const questionHeadings = (markdown.match(/^#{2,3}\s+.*\?$/gm) || []).length;
  checks.push({
    category: "structure",
    check: "faq-block",
    passed: hasFAQ && questionHeadings >= 3,
    weight: 8,
    message: hasFAQ && questionHeadings >= 3
      ? `FAQ section with ${questionHeadings} question headings — prime AI citation target`
      : hasFAQ
        ? "FAQ section found but needs more question-format headings"
        : "No FAQ section — adding one dramatically improves AI citation across ALL platforms",
    fix: hasFAQ && questionHeadings >= 3
      ? undefined
      : "Add a '## Frequently Asked Questions' section with 3-5 questions as ### headings, each followed by a 2-3 sentence answer.",
  });

  // ═══════════════════════════════════════
  // 4. CONVERSATIONAL FIT — Does this match how people ask AI?
  // ═══════════════════════════════════════

  // 4a. Question-format headings (matching natural language queries)
  checks.push({
    category: "conversational",
    check: "question-headings",
    passed: questionHeadings >= 3,
    weight: 8,
    message: questionHeadings >= 3
      ? `${questionHeadings} question-format headings — matches natural AI query patterns`
      : `Only ${questionHeadings} question heading(s) — people ask AI in question form, your headings should match`,
    fix: questionHeadings >= 3
      ? undefined
      : "Rephrase headings as questions: '## How much does managed IT cost?' instead of '## Pricing'. Match how people ask ChatGPT/Perplexity.",
  });

  // 4b. Conversational triggers (covering how/what/why/when query patterns)
  const queryPatterns = {
    how: /\bhow\s+(to|much|long|often|do|does|can|should)\b/i,
    what: /\bwhat\s+(is|are|does|should|happens)\b/i,
    why: /\bwhy\s+(do|does|is|are|should|would)\b/i,
    when: /\bwhen\s+(to|should|do|does|is|will)\b/i,
    comparison: /\b(vs\.?|versus|compared to|difference between|better than)\b/i,
    recommendation: /\b(best|top|recommended|we recommend|you should|consider)\b/i,
  };
  const coveredPatterns = Object.entries(queryPatterns).filter(([, regex]) => regex.test(markdown));
  checks.push({
    category: "conversational",
    check: "query-coverage",
    passed: coveredPatterns.length >= 4,
    weight: 7,
    message: coveredPatterns.length >= 4
      ? `Covers ${coveredPatterns.length}/6 conversational query patterns (${coveredPatterns.map(([k]) => k).join(", ")})`
      : `Only covers ${coveredPatterns.length}/6 query patterns — AI answers how, what, why, when, comparison, and recommendation queries`,
    fix: coveredPatterns.length >= 4
      ? undefined
      : `Missing query patterns: ${Object.keys(queryPatterns).filter((k) => !coveredPatterns.some(([ck]) => ck === k)).join(", ")}. Add sections that address these question types.`,
  });

  // 4c. Direct response patterns (content that reads like an AI answer)
  const directResponsePatterns = [
    /\bthe (short|quick|simple) answer is\b/i,
    /\bin (short|brief|summary)\b/i,
    /\bhere('s| is) (what|how|why)\b/i,
    /\bthe (bottom line|key takeaway)\b/i,
    /\btypically,?\s/i,
    /\bgenerally,?\s/i,
    /\bmost (businesses|companies|organizations)\b/i,
  ];
  const directResponseCount = directResponsePatterns.filter((r) => r.test(markdown)).length;
  checks.push({
    category: "conversational",
    check: "response-patterns",
    passed: directResponseCount >= 3,
    weight: 6,
    message: directResponseCount >= 3
      ? `${directResponseCount} direct response patterns — content reads like how AI would answer`
      : "Content doesn't match AI response patterns — write how an AI assistant would explain this topic",
    fix: directResponseCount >= 3
      ? undefined
      : "Add summary phrases: 'The short answer is...', 'Here's what most businesses need to know...', 'Typically,...'. Write as if YOU are the AI answering the question.",
  });

  // ═══════════════════════════════════════
  // 5. MULTI-ENGINE COVERAGE — Optimized for all AI platforms?
  // ═══════════════════════════════════════

  // 5a. Structured data readiness (schema potential)
  const hasSchemaHints = /\b(FAQ|HowTo|Article|Person|Organization|LocalBusiness)\b/.test(markdown) ||
    hasFAQ || orderedListItems >= 3;
  checks.push({
    category: "multi-engine",
    check: "schema-ready",
    passed: hasSchemaHints,
    weight: 6,
    message: hasSchemaHints
      ? "Content has schema-ready structure (FAQ/HowTo/Article patterns detected)"
      : "Content lacks schema-ready patterns — structured data helps Google AIO and Bing Copilot",
    fix: hasSchemaHints
      ? undefined
      : "Add FAQ section (generates FAQPage schema), numbered steps (generates HowTo schema), or clear article structure.",
  });

  // 5b. Source attribution (AI platforms prefer content that cites sources)
  const externalLinks = (markdown.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;
  const hasSourceAttribution = externalLinks >= 2;
  checks.push({
    category: "multi-engine",
    check: "source-citations",
    passed: hasSourceAttribution,
    weight: 7,
    message: hasSourceAttribution
      ? `${externalLinks} external source citations — builds trust across all AI platforms`
      : "Insufficient source citations — Perplexity especially weights content that cites authoritative sources",
    fix: hasSourceAttribution
      ? undefined
      : "Cite authoritative sources: NIST guidelines, vendor documentation, industry reports. Use [Source Name](URL) format.",
  });

  // 5c. Content freshness signals
  const freshnessRegex = buildFreshnessRegex();
  const hasFreshnessSignals = freshnessRegex.test(markdown) ||
    /\b(latest|updated|current|recent|new)\b/i.test(markdown);
  const currentYear = new Date().getFullYear();
  checks.push({
    category: "multi-engine",
    check: "freshness-signals",
    passed: hasFreshnessSignals,
    weight: 5,
    message: hasFreshnessSignals
      ? "Content freshness signals detected — AI platforms prefer recent, up-to-date content"
      : "No freshness signals — include current year references and 'updated' language",
    fix: hasFreshnessSignals
      ? undefined
      : `Add current year references: 'In ${currentYear}, ...' or 'Updated for ${currentYear}'. AI platforms strongly prefer fresh content.`,
  });

  // 5d. Perplexity-style answer structure (source + claim + evidence)
  const hasEvidencePattern = /\b(according to|research shows|studies indicate|data from|report by)\b/i.test(markdown);
  const hasClaimEvidence = hasEvidencePattern && dataPoints >= 2;
  checks.push({
    category: "multi-engine",
    check: "evidence-based",
    passed: hasClaimEvidence,
    weight: 7,
    message: hasClaimEvidence
      ? "Evidence-based writing detected — Perplexity and Gemini prioritize claim+evidence content"
      : "Content lacks claim+evidence structure — AI search engines prefer 'According to X, Y is Z' patterns",
    fix: hasClaimEvidence
      ? undefined
      : "Add evidence patterns: 'According to NIST, 60% of SMBs...' or 'Research from IBM shows the average breach costs $4.45M.' Cite then claim.",
  });

  // ═══════════════════════════════════════
  // SCORING
  // ═══════════════════════════════════════

  const categoryScores: Record<string, { total: number; maxTotal: number }> = {
    citation: { total: 0, maxTotal: 0 },
    entity: { total: 0, maxTotal: 0 },
    structure: { total: 0, maxTotal: 0 },
    conversational: { total: 0, maxTotal: 0 },
    "multi-engine": { total: 0, maxTotal: 0 },
  };

  for (const check of checks) {
    const cat = categoryScores[check.category];
    cat.maxTotal += check.weight * 10;
    cat.total += check.passed ? check.weight * 10 : 0;
  }

  const normalize = (cat: string) => {
    const c = categoryScores[cat];
    return c.maxTotal > 0 ? Math.round((c.total / c.maxTotal) * 100) : 0;
  };

  const citationReadiness = normalize("citation");
  const entityAuthority = normalize("entity");
  const structuredClarity = normalize("structure");
  const conversationalFit = normalize("conversational");
  const multiEngineCoverage = normalize("multi-engine");

  // Weighted overall: Citation 30%, Entity 20%, Structure 20%, Conversational 15%, Multi-engine 15%
  const overall = Math.round(
    citationReadiness * 0.30 +
    entityAuthority * 0.20 +
    structuredClarity * 0.20 +
    conversationalFit * 0.15 +
    multiEngineCoverage * 0.15
  );

  // Letter grade
  const grade: AIVisibilityScore["grade"] =
    overall >= 80 ? "A" : overall >= 65 ? "B" : overall >= 50 ? "C" : overall >= 35 ? "D" : "F";

  const gradeLabels: Record<AIVisibilityScore["grade"], string> = {
    A: "AI-Ready — High citation potential",
    B: "Good — Some optimization needed",
    C: "Average — Significant gaps in AI visibility",
    D: "Below Average — Major rework needed",
    F: "Not AI-Visible — Complete restructure required",
  };

  return {
    overall,
    citationReadiness,
    entityAuthority,
    structuredClarity,
    conversationalFit,
    multiEngineCoverage,
    checks,
    grade,
    gradeLabel: gradeLabels[grade],
  };
}

/* ── Entity Extraction ── */

/**
 * Extract entity signals from content — useful for understanding
 * how well content builds brand entity authority.
 */
export function extractEntitySignals(markdown: string, brandName: string = "SeedTech", siteConfig?: SiteScoringConfig): EntitySignal[] {
  const signals: EntitySignal[] = [];
  const effectiveBrand = siteConfig?.brandName || brandName;

  // Brand definitions
  const brandDefMatch = markdown.match(new RegExp(`${effectiveBrand}\\s+(is|provides|offers|specializes in|delivers)\\s+[^.]+\\.`, "gi"));
  if (brandDefMatch) {
    for (const match of brandDefMatch) {
      signals.push({ type: "definition", text: match.trim(), strength: "strong" });
    }
  }

  // Claims with evidence
  const claimPatterns = markdown.match(/(?:we've|we have|our team has?)\s+[^.]+\./gi) || [];
  for (const claim of claimPatterns.slice(0, 5)) {
    const hasEvidence = /\d+%|\d+ (clients?|businesses|companies|years?)/.test(claim);
    signals.push({
      type: "claim",
      text: claim.trim(),
      strength: hasEvidence ? "strong" : "medium",
    });
  }

  // Credential mentions
  const credRegex = siteConfig?.credentialRegex || /\b(CompTIA|CISSP|CISM|certified|certification|licensed|accredited)/i;
  const credentialMatches = markdown.match(new RegExp(credRegex.source + "[^.]*\\.", "gi")) || [];
  for (const cred of credentialMatches.slice(0, 3)) {
    signals.push({ type: "credential", text: cred.trim(), strength: "strong" });
  }

  // Attribution (who's saying this)
  const attributionMatches = markdown.match(/\b(our (CEO|CTO|founder|team|engineers?)|according to|as .+ explains?)\b[^.]*\./gi) || [];
  for (const attr of attributionMatches.slice(0, 3)) {
    signals.push({ type: "attribution", text: attr.trim(), strength: "medium" });
  }

  // Relationships to known entities
  const relEntityRegex = siteConfig?.knownEntityRegex
    ? new RegExp(siteConfig.knownEntityRegex.source + "\\s+(partner|certified|solution|platform|framework|guidelines)[^.]*\\.", "gi")
    : /\b(Microsoft|Google|AWS|Azure|Cisco|NIST|CompTIA)\s+(partner|certified|solution|platform|framework|guidelines)[^.]*\./gi;
  const relationshipMatches = markdown.match(relEntityRegex) || [];
  for (const rel of relationshipMatches.slice(0, 3)) {
    signals.push({ type: "relationship", text: rel.trim(), strength: "strong" });
  }

  return signals;
}

/* ── Conversational Query Analysis ── */

/**
 * Analyze what conversational queries this content could answer.
 * Returns which query types are covered and which are missing.
 */
export function analyzeConversationalCoverage(
  markdown: string,
  targetKeyword?: string
): ConversationalQuery[] {
  const queries: ConversationalQuery[] = [];
  const kw = targetKeyword || "this topic";

  const queryTemplates: { query: string; type: ConversationalQuery["type"]; pattern: RegExp }[] = [
    { query: `How much does ${kw} cost?`, type: "how", pattern: /\b(cost|price|pricing|invest|budget|\$)\b/i },
    { query: `What is ${kw}?`, type: "what", pattern: /\b(is a|refers to|means|defined as)\b/i },
    { query: `Why do I need ${kw}?`, type: "why", pattern: /\b(because|reason|benefit|advantage|need|important)\b/i },
    { query: `When should I get ${kw}?`, type: "when", pattern: /\b(when|time to|sign|indicator|ready for)\b/i },
    { query: `Which ${kw} is best?`, type: "which", pattern: /\b(best|top|recommended|ideal|right choice)\b/i },
    { query: `${kw} vs alternative?`, type: "comparison", pattern: /\b(vs|versus|compared|difference|better)\b/i },
    { query: `Do you recommend ${kw}?`, type: "recommendation", pattern: /\b(recommend|suggest|advise|we recommend|our recommendation)\b/i },
  ];

  for (const template of queryTemplates) {
    queries.push({
      query: template.query,
      type: template.type,
      covered: template.pattern.test(markdown),
    });
  }

  return queries;
}

/* ── AI-First Writing Instructions ── */

/**
 * Generate writing instructions optimized for AI citation.
 * This replaces the old "SEO writing" instructions with AI-first thinking.
 * When siteConfig is provided, examples are customized to the site's industry.
 */
export function getAIFirstWritingInstructions(siteConfig?: SiteScoringConfig): string {
  const brand = siteConfig?.brandName || "Your Brand";
  const geoExample = siteConfig?.geographicTerms?.[0] || "your service area";
  const currentYear = new Date().getFullYear();

  return `
## AI Visibility Optimization Instructions (CRITICAL — ${currentYear}+ Strategy)

Traditional SEO ranking is becoming less relevant. ~65% of searches now result in AI-generated answers.
Your content needs to be CITED BY AI SYSTEMS, not just rank in Google's blue links.

### Core Principle: Write to be the SOURCE that AI quotes.

### The AI-Readable Document Structure

AI systems parse content in a predictable way. They look for:

1. **Direct answer in the opening** — The first paragraph is what gets quoted. 20-60 words, includes a specific fact, directly answers the query.

2. **Entity definition early** — Within the first 3 paragraphs, define the brand: "${brand} is a ${siteConfig?.description || "company"} serving ${geoExample}." This builds entity recognition in AI knowledge graphs.

3. **Question-format headings** — AI systems match user queries to headings. Every H2 heading should be a natural question ending in "?".

4. **Comparison tables** — This is the #1 most-cited content format across Google AIO, ChatGPT, Perplexity, and Gemini. Always include at least one.

5. **Definition blocks** — "X is Y" sentences get extracted into AI knowledge graphs. Include at least 2 clear definitions.

6. **Claim + evidence pairs** — AI platforms (especially Perplexity) cite content with source attribution.

7. **Numbered step lists** — Processes and how-to steps get cited verbatim by AI assistants.

8. **FAQ section** — Must be present. Format: "## Frequently Asked Questions" with "### Question?" sub-headings. Each answer: 2-3 sentences, self-contained, includes a fact.

9. **Short paragraphs** — 20-80 words each. Each paragraph should express one complete, quotable idea.

10. **Known entity references** — Reference ${siteConfig?.knownEntities?.slice(0, 4).join(", ") || "industry authorities"}, etc. This connects your content to entities AI already knows.

11. **Geographic anchoring** — "${geoExample}" — wins local AI queries.

12. **Freshness signals** — Include current year (${currentYear}) and "updated" language. AI strongly prefers recent content.

### What Makes Content AI-Citable vs Just SEO-Optimized

| AI-Citable Content | Traditional SEO Content |
|---|---|
| Direct answer in first paragraph | Keyword in first paragraph |
| Question-format headings | Keyword-stuffed headings |
| Comparison tables with data | Walls of text |
| Evidence-based claims with sources | Vague unsupported claims |
| FAQ with specific answers | Generic FAQ for schema |
| Entity definition ("${brand} is a...") | Brand mention |
| 20-60 word citeable blocks | Long paragraphs |
`.trim();
}

/**
 * Build AI Visibility context for the AI Advisor.
 * This replaces the ranking-focused advisor context.
 */
export function getAIVisibilityAdvisorContext(_siteConfig?: SiteScoringConfig): string {
  const currentYear = new Date().getFullYear();
  return `
## ${currentYear}+ AI Visibility Strategy

Traditional SEO ranking is declining. The new game is AI VISIBILITY — being cited by AI systems.

### The New Metrics That Matter
1. **AI Visibility Score** — Would ChatGPT/Perplexity/Gemini/Google AIO cite this content?
2. **Citation Readiness** — Is content structured in citeable blocks (20-60 words, fact-rich)?
3. **Entity Authority** — Does AI recognize this brand as a trusted source on this topic?
4. **Conversational Coverage** — Does content answer how, what, why, when, comparison, and recommendation queries?
5. **Multi-Engine Coverage** — Optimized for ALL AI platforms, not just Google?

### What Traditional Metrics Still Matter
- **E-E-A-T signals** — More important than ever, as AI systems use these to decide citation trustworthiness
- **Topical authority** — Comprehensive topic coverage > individual keyword targeting
- **Content freshness** — AI platforms heavily weight recency
- **Structured data** — FAQPage, HowTo, Organization schema still help Google AIO and Bing Copilot

### What's Declining in Relevance
- Individual keyword position tracking (ranking #1 doesn't matter if AI answers the query)
- Click-through rate optimization (zero-click searches dominate)
- Traditional backlink counting (entity authority > link authority for AI)
- Keyword density metrics (natural language and entity clarity matter more)

### Priority Actions for AI Visibility
1. Audit all content for AI citation readiness using the AI Visibility Score
2. Restructure top pages with citeable blocks, comparison tables, FAQ sections
3. Build entity authority through consistent brand definitions and credential signals
4. Create definitive "answer source" content for each service area
5. Add FAQ schema, HowTo schema, and Speakable markup to all content pages
6. Monitor AI citation patterns (brand mentions in ChatGPT, Perplexity responses)

When analyzing data, lead with AI Visibility recommendations over traditional ranking advice.
`.trim();
}
