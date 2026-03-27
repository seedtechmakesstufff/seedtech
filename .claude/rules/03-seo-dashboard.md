---
globs:
  - "src/app/admin/seo/**"
  - "src/lib/seo-*.ts"
  - "src/lib/ai-*.ts"
  - "src/lib/citation-*.ts"
  - "src/lib/competitive-*.ts"
  - "src/lib/topic-*.ts"
  - "src/app/api/admin/seo/**"
  - "src/app/api/cron/**"
---

# SEO Dashboard

## 9 Tabs
1. **Overview** — Health score, weekly snapshots, key metrics
2. **AI Visibility** — Per-page citation readiness (5-dimension: Citation Readiness, Entity Authority, Structured Clarity, Conversational Fit, Multi-Engine Coverage)
3. **Keywords** — Tracked keywords with GSC positions, tier/intent/cluster
4. **Site Audit** — Crawler (25+ checks: titles, meta, headings, images, links, structured data, E-E-A-T)
5. **Insights** — AI-generated (freshness, cannibalization, linking, CTR, keyword discovery)
6. **Topic Clusters** — Pillar/spoke maps, gap analysis, authority scoring, internal link enforcement
7. **Citations** — Brand mentions across Perplexity, ChatGPT, Google AIO, Gemini, Copilot
8. **Competitors** — Content analysis, gaps, SERP features
9. **Strategy** — Tasks + content calendar

## Scoring
- **Overall:** 50% AI Visibility + 25% E-E-A-T + 25% AIO
- **AI Visibility (ai-visibility.ts):** citeable opening, data richness, entity definitions, structured clarity, comparison tables, multi-engine signals → letter grade A-F
- **E-E-A-T (seo-eeat.ts):** Author credentials, expertise signals, experience evidence, trust signals. Uses `site-scoring-config.ts` for DB-driven patterns.
- **AIO (seo-aio.ts):** Direct answer format, Q&A structure, lists, tables, definitions, FAQ section

## Citation Checking (citation-checker.ts)
- Perplexity: real API calls
- ChatGPT: real OpenAI API calls
- Google AIO / Gemini / Copilot: Claude-simulated responses
- Builds queries from business context + tracked keywords
- Stores as `AICitation` records with platform, brand mention, URL citation, sentiment

## Topic Clusters (topic-clusters.ts)
- `generateTopicCluster()` — Claude generates 8-15 subtopics from seed keyword
- Gap analysis matches subtopics against existing content (keyword/slug similarity)
- Authority scoring: coverage% + content quality + internal linking + AI visibility
- `InternalLinkSuggestion` model for cross-linking recommendations

## Cron Schedule
- `/api/cron/seo` — Weekly Monday 6 AM UTC (Vercel cron)
- Runs: snapshot, crawl, insights, citations for all active sites
