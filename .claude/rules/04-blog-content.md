---
globs:
  - "src/app/api/ai/**"
  - "src/app/admin/blog/**"
  - "src/lib/blog.ts"
---

# Blog & Content Pipeline

## Blog Generation (5 steps via `/api/ai/generate-blog`)
1. `?step=outline` — Claude generates pillar/spoke structure with AI citation focus
2. `?step=draft` — Full Markdown with mandatory components (see below)
3. `?step=meta` — Title tag, meta description, excerpt
4. `?step=score` — E-E-A-T + AIO + AI Visibility scoring
5. `?step=paa` — People Also Ask research and generation

## Mandatory Blog Components
- Citeable opening (20-60 words) — direct answer format
- Entity definition block
- Question-format H2 headings
- Comparison table (at least one)
- Numbered step lists
- Definition blocks
- FAQ section (4-6 questions)
- CTA closing section

## AI-First Content Principles
- Write to be **cited by AI systems**, not just to rank on Google
- **Entity authority:** Clear brand definition, credentials, relationships
- **Structured clarity:** Headings, lists, tables, definitions aid AI parsing
- **Conversational fit:** Answer patterns matching AI model training data
- **Source attribution:** Cite authoritative sources (Perplexity/Google AIO weight this)
- **Citation readiness:** Format for easy extraction + attribution

## Business Context
All AI generation uses `buildStrategyPrompt()` from `business-context.ts` which pulls from the `BusinessProfile` DB model (company name, services, target audience, tone, custom instructions).
