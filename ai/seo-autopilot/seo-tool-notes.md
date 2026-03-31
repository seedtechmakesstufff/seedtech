Week 1 — Make the data loop work:

1. ✅ Auto-sync GSC positions on snapshot — wire keyword position updates into the scheduled snapshot so currentPosition is always fresh
2. ✅ Crawl → Tasks pipeline — auto-generate SeoTask records from crawl issues (critical issues become high-priority tasks)
3. ✅ Seed real competitors — add 3-4 actual MSP competitors for the gap analysis engine to compare against

Week 2 — Content engine:
4. ✅ Content calendar generator — use Claude + GSC data to generate a 90-day content plan mapped to tier 3 keywords, saved as ContentIdea records
5. ✅ Blog post #2–5 — batch blog writer pipeline (outline → draft → meta → save) from ContentIdea records. UI buttons in Strategy tab.

Week 3 — Analysis depth:
6. 🔲 Re-run insights — with real GSC data flowing, the strike-distance and CTR opportunity detectors will surface real wins
7. 🔲 Competitive gap analysis — with real competitors added, generate keyword gap reports

---

## Testing Checklist (before marking Week 2 done)

### Content Calendar Generator
- [ ] Click "Generate 90-Day Plan" on Strategy tab → verify 12 ideas appear
- [ ] Check ContentIdea records in DB match the generated ideas
- [ ] Run again → verify dedup works (skipped count > 0, no duplicates)
- [ ] Verify ideas are mapped to existing KeywordClusters where applicable

### Batch Blog Writer
- [ ] Click "Write 5 Posts" → verify blog posts appear in /admin/blog
- [ ] Check each post has: proper title, slug, keyword, markdown body, meta
- [ ] Verify ContentIdea status updated from "idea" → "draft"
- [ ] Verify "Write 5 Posts" button disables when no "idea" status ideas remain
- [ ] Check word count calculated and stored correctly

### Integration
- [ ] After generating calendar + writing posts, verify Strategy tab refreshes automatically
- [ ] Verify blog posts render correctly on /blog/[slug]
- [ ] Run site audit → check new blog pages are crawlable and pass checks

---

## What's Next After Week 3

### Week 3 items to build:
6. **Re-run insights** — Trigger /api/admin/seo/insights with fresh GSC data. Verify:
   - Strike-distance detector finds keywords at positions 8-20
   - CTR opportunity detector finds high-impression/low-CTR keywords
   - Content freshness detector flags stale pages
   - Cannibalization detector finds keyword conflicts
7. **Competitive gap analysis** — With Dataprise + Ntiva seeded:
   - Run competitor analysis (POST /api/admin/seo/competitors/analysis)
   - Check gap reports in Competitors tab
   - Verify keyword gaps surface competitor keywords we don't rank for

