Week 1 — Make the data loop work:

1. ✅ Auto-sync GSC positions on snapshot — wire keyword position updates into the scheduled snapshot so currentPosition is always fresh
2. ✅ Crawl → Tasks pipeline — auto-generate SeoTask records from crawl issues (critical issues become high-priority tasks)
3. ✅ Seed real competitors — add 3-4 actual MSP competitors for the gap analysis engine to compare against

Week 2 — Content engine:
4. ✅ Content calendar generator — use Claude + GSC data to generate a 90-day content plan mapped to tier 3 keywords, saved as ContentIdea records
5. ✅ Blog post #2–5 — batch blog writer pipeline (outline → draft → meta → save) from ContentIdea records. UI buttons in Strategy tab.

Week 3 — Analysis depth:
6. ✅ Re-run insights — fixed all 4 insight detectors to use site-scoped GSC integration. 4 insight types now generating correctly.
7. ✅ Competitive gap analysis — `findKeywordGaps()` analyzes competitor topics vs our keywords. 75 keyword gaps identified, wired into API + UI.

---

## Testing Results (March 30, 2026) — ALL PASS ✅

### Content Calendar Generator
- [x] "Generate 90-Day Plan" → 12 ideas generated, 5 saved (7 from prior run)
- [x] Run again → dedup works (6/6 skipped, 0 duplicates saved)
- [x] Ideas include target keywords, funnel stages, suggested weeks

### Batch Blog Writer
- [x] "Write 2 Posts" → 2 posts written, 0 failed
- [x] Posts have: proper titles, slugs, keywords, 1800+ word markdown, meta
- [x] ContentIdea status updates from "idea" → "draft"
- [x] Word counts: 1,811 and 1,913

### SEO Insights (Week 3)
- [x] 4 insights generated: ctr_optimization, eeat_issue, internal_linking, keyword_opportunity
- [x] E-E-A-T detector flagged 4 issues including missing authority links
- [x] All detectors now using site-scoped GSC credentials

### Keyword Gap Analysis (Week 3)
- [x] 75 keyword gaps found (all "they-have-we-dont" type)
- [x] 2 competitor overviews, 50 content gaps alongside keyword gaps
- [x] Gaps include competitor domain, URL, AI Vis score, and action descriptions

### Still needs manual verification:
- [ ] Blog posts render correctly on /blog/[slug] in browser
- [ ] Strategy tab refreshes correctly after calendar/batch operations
- [ ] Keyword gaps display correctly in Competitors tab UI

---

## All 7 items complete. Moving to Phase 8.

### Phase 8: Content Pipeline Maturity
1. Evidence injection — Auto-weave case studies, metrics, testimonials into AI drafts
2. Content briefs — AI-generated research-backed briefs before writing
3. Post-publish monitoring — Index verification, ranking tracking, citation tracking, decay alerts
4. Structured data generator — FAQPage, HowTo, Article, Speakable auto-generation

### Phase 9: Client Onboarding Polish
1. GSC OAuth flow — In-app consent, token storage, automatic data pulls
2. Guided setup checklist — Connect integrations, first crawl, first blog post
3. White-label reports — PDF exports, branded email reports
4. Industry presets — One-click IndustryConfig for common verticals (MSP, legal, HVAC, dental, etc.)

