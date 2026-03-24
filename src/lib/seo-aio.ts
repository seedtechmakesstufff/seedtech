/* ── AI Overview (AIO) Optimization Engine ──
 * Helps content rank in Google's AI Overviews (formerly SGE).
 *
 * AI Overviews now appear on ~47% of search queries (2026).
 * To be cited, content needs:
 *   1. Concise, direct answers in the first 40-60 words
 *   2. Structured Q&A blocks that match "People Also Ask"
 *   3. Definition-style paragraphs (entity-first writing)
 *   4. Comparison tables and numbered step lists
 *   5. Speakable structured data
 *   6. Strong E-E-A-T signals (handled by seo-eeat.ts)
 *
 * This module:
 *   - Scores existing content for AIO-readiness
 *   - Generates AIO-optimized content blocks via AI
 *   - Provides "People Also Ask" research
 *   - Adds AIO-awareness to the AI advisor context
 */

/* ── Types ── */

export interface AIOScore {
  overall: number; // 0-100
  directAnswer: number;
  structuredContent: number;
  entityClarity: number;
  citability: number;
  issues: AIOIssue[];
}

export interface AIOIssue {
  check: string;
  passed: boolean;
  message: string;
  recommendation?: string;
}

export interface PAAQuestion {
  question: string;
  suggestedAnswer: string;
  source: "ai-generated" | "gsc-derived";
}

/* ── Content AIO Scoring ── */

/**
 * Score a piece of content (Markdown) for AI Overview citation readiness.
 */
export function scoreAIOReadiness(markdown: string, targetKeyword?: string): AIOScore {
  const issues: AIOIssue[] = [];

  // 1. Direct answer in first paragraph
  const firstParagraph = markdown.split(/\n\n/)[0] || "";
  const firstParaWords = firstParagraph.split(/\s+/).length;
  const hasDirectAnswer = firstParaWords >= 15 && firstParaWords <= 80;
  const firstParaHasKeyword = targetKeyword
    ? firstParagraph.toLowerCase().includes(targetKeyword.toLowerCase())
    : true;

  issues.push({
    check: "direct-answer",
    passed: hasDirectAnswer && firstParaHasKeyword,
    message: hasDirectAnswer && firstParaHasKeyword
      ? `First paragraph is ${firstParaWords} words with keyword — good for AIO citation`
      : `First paragraph is ${firstParaWords} words${!firstParaHasKeyword ? " and missing target keyword" : ""} — AIO needs a 20-60 word direct answer`,
    recommendation: hasDirectAnswer && firstParaHasKeyword
      ? undefined
      : "Start with a concise definition or direct answer to the question your target keyword implies. Keep it 20-60 words.",
  });

  // 2. Structured Q&A blocks (## headers phrased as questions)
  const questionHeadings = (markdown.match(/^#{2,3}\s+.*\?$/gm) || []).length;
  const hasQAStructure = questionHeadings >= 2;
  issues.push({
    check: "qa-structure",
    passed: hasQAStructure,
    message: hasQAStructure
      ? `${questionHeadings} question-format headings found — good for PAA and AIO`
      : "No question-format headings — Google AIO prefers content structured as Q&A",
    recommendation: hasQAStructure
      ? undefined
      : "Rephrase some H2/H3 headings as questions (e.g., '## How much does managed IT cost?' instead of '## Pricing')",
  });

  // 3. Numbered lists / step-by-step content
  const orderedLists = (markdown.match(/^\d+\.\s/gm) || []).length;
  const hasSteps = orderedLists >= 3;
  issues.push({
    check: "step-lists",
    passed: hasSteps,
    message: hasSteps
      ? `${orderedLists} numbered steps found — AIO favors step-by-step content`
      : "No numbered step lists — AIO frequently cites step-by-step content",
    recommendation: hasSteps ? undefined : "Add a numbered list for processes, comparisons, or 'how to' sections.",
  });

  // 4. Comparison tables
  const hasTables = /\|.*\|.*\|/m.test(markdown);
  issues.push({
    check: "comparison-tables",
    passed: hasTables,
    message: hasTables
      ? "Comparison table found — AIO frequently cites tabular data"
      : "No comparison tables — tables are among the most-cited content in AI Overviews",
    recommendation: hasTables ? undefined : "Add a comparison table (e.g., 'Break-Fix vs Managed IT', 'Feature comparison', pricing tiers).",
  });

  // 5. Definition-style writing (entity-first)
  const definitionPatterns = [
    /\b\w+\s+(is|are|refers to|means|describes)\s+/i,
    /\bdefined as\b/i,
    /\bin (short|brief|simple terms)\b/i,
  ];
  const hasDefinitions = definitionPatterns.some((r) => r.test(markdown));
  issues.push({
    check: "entity-definitions",
    passed: hasDefinitions,
    message: hasDefinitions
      ? "Definition-style content found — helps Google understand entities"
      : "No clear entity definitions — AIO needs 'X is Y' style content to cite",
    recommendation: hasDefinitions
      ? undefined
      : "Add a clear definition early in the content: 'Managed IT services refers to...' or 'A managed service provider (MSP) is...'",
  });

  // 6. Concise paragraph length (AIO cites short, dense paragraphs)
  const paragraphs = markdown.split(/\n\n/).filter((p) => p.trim() && !p.trim().startsWith("#") && !p.trim().startsWith("|"));
  const avgParaWords = paragraphs.length
    ? paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length
    : 0;
  const hasConciseParagraphs = avgParaWords >= 20 && avgParaWords <= 80;
  issues.push({
    check: "paragraph-density",
    passed: hasConciseParagraphs,
    message: hasConciseParagraphs
      ? `Average paragraph length is ${Math.round(avgParaWords)} words — good density for AIO`
      : `Average paragraph length is ${Math.round(avgParaWords)} words — AIO prefers 20-80 word paragraphs`,
    recommendation: hasConciseParagraphs
      ? undefined
      : avgParaWords > 80
        ? "Break long paragraphs into shorter, more citeable blocks (20-80 words each)."
        : "Expand thin paragraphs with more substantive content.",
  });

  // 7. FAQ section present (explicit Q&A block)
  const hasFAQ = /#{2,3}\s*(FAQ|Frequently Asked|Common Questions)/i.test(markdown);
  issues.push({
    check: "faq-section",
    passed: hasFAQ,
    message: hasFAQ
      ? "FAQ section detected — frequently featured in AI Overviews"
      : "No explicit FAQ section — adding one significantly improves AIO citation chances",
    recommendation: hasFAQ ? undefined : "Add a '## Frequently Asked Questions' section with 3-5 Q&A pairs using question headings.",
  });

  // Calculate scores
  const directAnswer = (hasDirectAnswer && firstParaHasKeyword ? 100 : hasDirectAnswer ? 50 : 20);
  const structuredContent = Math.min(100, (hasQAStructure ? 35 : 0) + (hasSteps ? 35 : 0) + (hasTables ? 30 : 0));
  const entityClarity = (hasDefinitions ? 60 : 20) + (hasConciseParagraphs ? 40 : 10);
  const citability = (hasFAQ ? 40 : 0) + (hasQAStructure ? 30 : 0) + (hasDirectAnswer ? 30 : 10);

  const overall = Math.round(
    directAnswer * 0.3 + structuredContent * 0.25 + entityClarity * 0.2 + citability * 0.25
  );

  return {
    overall: Math.min(100, overall),
    directAnswer,
    structuredContent,
    entityClarity,
    citability,
    issues,
  };
}

/* ── AIO-Optimized Content Generation Helpers ── */

/**
 * Build the AIO-awareness prompt section for the blog writer.
 * This instructs Claude to format content for AI Overview citation.
 */
export function getAIOWritingInstructions(): string {
  return `
## AI Overview Optimization Instructions (CRITICAL for 2026 SEO)

Google's AI Overviews now appear on ~47% of all searches. To be cited:

1. **Direct Answer First**: Start the post with a concise 20-60 word paragraph that directly answers the question implied by the target keyword. This paragraph MUST include the target keyword.

2. **Question-Format Headings**: Use at least 2-3 H2/H3 headings phrased as questions matching "People Also Ask" queries (e.g., "## How much does managed IT cost?" not "## Pricing").

3. **Definition Blocks**: Include at least one clear "X is Y" definition early in the content (e.g., "A managed service provider (MSP) is a company that...").

4. **Comparison Tables**: Include at least one Markdown comparison table where relevant (feature comparisons, pricing tiers, pros/cons).

5. **Numbered Step Lists**: Use ordered lists for any process, comparison, or sequential content.

6. **Concise Paragraphs**: Keep paragraphs between 20-80 words. AIO cites short, dense blocks — not walls of text.

7. **FAQ Section**: End with a "## Frequently Asked Questions" section containing 3-5 Q&A pairs using ### question headings with concise 1-3 sentence answers.

8. **Entity-First Writing**: Define key terms clearly. Google's AI needs to understand entities to cite them.
`.trim();
}

/**
 * Build "People Also Ask" research prompt for a given keyword.
 * The AI advisor uses this to generate PAA-targeting suggestions.
 */
export function getPAAResearchPrompt(keyword: string, existingContent?: string): string {
  return `
Analyze the keyword "${keyword}" and generate 8-10 "People Also Ask" questions that Google would likely show. For each question:
1. The exact question as it would appear in Google's PAA box
2. A concise 2-3 sentence answer optimized for AI Overview citation
3. Whether this question has "Featured Snippet" potential (yes/no)

${existingContent ? `The business already has this content:\n${existingContent.slice(0, 500)}\n\nFocus on questions NOT already answered.` : ""}

Return as JSON array: [{ "question": "...", "answer": "...", "snippetPotential": true/false }]
`.trim();
}

/**
 * Build the AIO awareness context for the AI Advisor.
 * This supplements the advisor's analysis with 2026 SEO realities.
 */
export function getAIOAdvisorContext(): string {
  return `
## 2026 SEO Landscape Awareness

When analyzing SEO data, factor in these critical 2026 realities:

### AI Overviews (AIO)
- AI Overviews appear on ~47% of search queries (up from 7% in early 2025)
- Ranking #1 is no longer sufficient — you need to be CITED in the AI Overview
- AIO preferentially cites: concise definitions, comparison tables, numbered steps, FAQ content
- Pages with Speakable structured data are 3x more likely to be cited
- AIO citation requires: clear entity definitions, question-format headings, short dense paragraphs

### E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- Google's March 2025 update significantly increased E-E-A-T weighting
- Author attribution (Person schema + visible bylines) is now critical for content pages
- First-person experience language ("we've helped clients...") matters more than ever
- Trust signals (HTTPS, privacy policy, contact info, review mentions) are table stakes
- Outbound links to authoritative sources (.gov, .edu, major tech vendors) boost authority

### Zero-Click & Lead Generation
- ~65% of Google searches result in zero clicks (2026)
- SEO strategy must optimize for CONVERSION, not just traffic
- Content should capture leads directly (embedded CTAs, gated resources, newsletter signups)
- Brand entity building matters more than individual keyword rankings
- Local SEO (GBP, reviews, geo-targeting) drives the highest-converting traffic for service businesses

### Content Quality Signals
- Google's Helpful Content System penalizes thin, AI-generated content without expertise signals
- Topical authority (comprehensive coverage of a topic cluster) outweighs individual page optimization
- Content freshness is weighted more heavily — update existing content, don't just publish new
- Video content is increasingly featured in AI Overviews — consider embedding explainer videos

Always include these factors in your analysis and recommendations.
`.trim();
}
