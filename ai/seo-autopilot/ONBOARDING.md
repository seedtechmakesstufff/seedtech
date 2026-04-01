# SEO Autopilot — Client Onboarding Guide

Step-by-step setup for deploying SEO Autopilot on a new client site. Complete each phase in order — later phases depend on earlier ones.

**Last updated:** March 31, 2026  
**Reference client:** SeedTech (site_seedtech)

---

## Phase 1 — Infrastructure

> Dev/deploy time. ~15 minutes.

1. **Create Tenant + Site** in the database (Prisma seed or admin panel)
2. **Set environment variables** (Vercel or `.env.local`):
   - `DATABASE_URL` — required
   - `CLAUDE_API_KEY` — required (powers all AI features)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_SERVICE_ACCOUNT_KEY` + `GOOGLE_SEARCH_CONSOLE_SITE` — required for rankings
   - `INDEXNOW_API_KEY` — optional but recommended
   - `RESEND_API_KEY` + `REPORT_FROM_EMAIL` + `REPORT_TO_EMAIL` — optional for email reports
   - `CRON_SECRET` — required for weekly automation
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — optional
3. **Verify connections** at `/admin/seo/settings` → Test Connection buttons

---

## Phase 2 — AI Context (the core of everything)

> Everything AI-generated — metadata, blogs, keyword research, insights — is shaped by this context. If this is thin, everything downstream is thin.

### 2A — Business Profile
Go to `/admin/seo/context` → **Service Nodes**. The "business" node type auto-sorts first. Fill in: company name, services, audience, tone. This is the identity that feeds every AI prompt.

### 2B — Service Nodes
Add a node for each core service/offering. Each gets its own structured context:
- Summary, audience, pricing, USPs, messaging guidelines
- Do/don't say rules (tone guardrails)
- Competitor names (for positioning)
- **AI Import feature** — paste a text dump and AI generates the node automatically

**SeedTech reference:** 2 service nodes created — Managed IT Support (25 page links) and Web Development (16 page links), 41 total page links.

### 2C — Page Context
`/admin/seo/context` → **Page Context**. Describe what each page is about and assign keywords. The **Bulk Generate** button uses AI to auto-generate descriptions for all unconfigured pages in one click.

### 2D — Link Nodes to Pages
Back on Service Nodes, link each node to its relevant pages. Relevance levels:
- **Primary** — the main page for that service
- **Secondary** — closely related pages
- **Mention** — pages that reference the service

### 2E — AI Preview
`/admin/seo/context` → **AI Preview**. Pick any page and see the exact prompt the AI would receive. This is how you verify your context is good before generating anything.

---

## Phase 3 — Keyword Strategy

> This is where most of the onboarding work happens. Budget 2-4 hours for a thorough setup.

### 3A — Read the site first
Before touching keywords, **read every page on the client's site**. Not skim — read. Note:
- Exact language used in hero sections and feature lists
- FAQ questions (these match Google's "People Also Ask" patterns)
- Pricing specifics (these have high commercial intent)
- Differentiator claims (competitors can't rank for language unique to the client)
- Industry-specific terms from vertical pages

### 3B — Seed Tracked Keywords
`/admin/seo/context` → **Keywords** → Manage. Each keyword gets:
- **Tier**: T1 (head terms, competitive), T2 (service/industry/geo-specific, achievable), T3 (questions, blog targets)
- **Intent**: informational / commercial / transactional / navigational
- **Target page**: the specific URL this keyword should drive traffic to
- **Volume/Competition**: leave as "unknown" until GSC provides real data

**SeedTech reference:** 157 keywords seeded across 4 rounds:
| Round | Keywords | Method |
|-------|----------|--------|
| v3 base | 92 | Deep site content analysis — FAQ-derived, pricing-specific, differentiator language |
| AI audit patch | +18 | GSC data revealed near-me gaps, crisis queries, geo expansion |
| Reactive expansion | +48 | Pain-point targeting across 6 crisis categories |
| Adjustments | -1 net | Re-tiered 3 keywords, fixed 1 target page |

### 3C — Keyword Derivation Rules
Every keyword should come from one of these sources (don't invent):
1. **Actual page copy** — language already on the site
2. **FAQ content** — questions from the site's FAQ sections
3. **Pricing specifics** — "$X/user/month", "starting at $Y", "no contract"
4. **Differentiator language** — claims competitors can't make
5. **Industry page framing** — exact terms from vertical pages
6. **Local geography** — county names, city names, metro area terms

### 3D — Reactive / Pain-Point Keywords
After the base keywords, add a reactive layer targeting **crisis moment searches**:
- **Crisis moment**: "business email not working", "my business got hacked"
- **Post-incident**: "how to prevent data breach small business"
- **Frustration**: "IT support takes too long to respond", "how to fire your IT company"
- **Compliance panic**: "cyber insurance denied need IT security"
- **Cost shock**: "IT support too expensive for small business"
- **Growth trigger**: "outgrew break fix need managed IT"

These have the highest conversion intent and lowest competition.

### 3E — AI Keyword Research
Keywords → **AI Research** tab. 5 research modes:
- **Full Audit** — comprehensive GSC data analysis
- **Discover Keywords** — AI-suggested opportunities from context + GSC
- **Gap Analysis** — what competitors rank for that we don't
- **Competitor Analysis** — deep-dive on specific competitor domains
- **Question Keywords** — "People Also Ask" style queries

### 3F — GSC Baseline
After seeding keywords, run the **Full Audit** from AI Research. This reveals:
- Brand vs. non-brand traffic split (SeedTech was 94% brand)
- Average position baseline (SeedTech was 27.8 — page 3)
- Near-me query gaps
- High-impression/low-click opportunities

---

## Phase 4 — Strategy Documents

> NEW (March 2026). Strategy docs persist your SEO thesis so every AI feature remembers it.

### 4A — What They Are
`/admin/seo/context` → **Strategy** tab. Markdown documents that feed into every AI prompt:
- Metadata generation (`seo-context.ts`)
- Keyword research (all 5 research modes)
- Blog writer (single + batch)
- Content calendar generator

### 4B — Categories
| Category | Purpose |
|----------|---------|
| `keyword_strategy` | Why these keywords, tier rationale, derivation methodology |
| `audit_findings` | What GSC/crawl data revealed, baseline metrics |
| `content_roadmap` | Blog articles needed, priority order, content guidelines |
| `competitive_analysis` | Competitor positioning, gaps, advantages |
| `general` | Anything else — tone docs, brand rules, etc. |

### 4C — Seed During Onboarding
Create 3-4 strategy docs during onboarding that capture the thesis:

1. **Keyword Architecture** — tier structure, intent distribution, derivation methodology, what's NOT included and why
2. **Reactive Keyword Thesis** (if applicable) — pain-point categories, conversion rationale
3. **GSC Baseline Audit** — current state metrics, brand vs. non-brand split, quick win opportunities, 90-day targets
4. **Blog Content Roadmap** — specific articles needed, priority order, content guidelines (citeable opening paragraphs, entity references, internal linking rules, CTA requirements)

### 4D — Active Flag
Each doc has an `isActive` toggle. Only active docs feed into AI prompts. Deactivate outdated strategy without deleting it — version history is preserved.

**SeedTech reference:** 4 strategy docs seeded — keyword architecture (157kw thesis), reactive keyword thesis (6 pain categories), GSC baseline (March 2026 audit), blog content roadmap (31 articles).

---

## Phase 5 — First Audit Cycle

1. **Run Site Crawl** — `/admin/seo` → Audit tab → "Run Site Crawl". Checks 25+ on-page issues (missing titles, meta descriptions, thin content, alt text, internal linking, etc.)
2. **Generate All Metadata** — `/admin/seo` → Metadata tab. One-click AI generation of titles + descriptions for every page. Context + strategy docs feed the generation.
3. **Take First Snapshot** — Overview tab → "Take Snapshot". Captures health score baseline.
4. **Run PageSpeed** — Audit tab → "Run PageSpeed" for Core Web Vitals.

---

## Phase 6 — Content Engine

1. **Generate 90-Day Content Calendar** — Strategy tab → "Generate 90-Day Plan". AI creates content ideas mapped to your keywords, strategy docs, and GSC data.
2. **Batch Write Blog Posts** — Strategy tab → "Write 5 Posts". Takes ideas from the calendar and auto-writes full SEO-optimized blog posts as drafts.
3. **AI Blog Writer** — `/admin/blog/new` for individual AI-written posts with full control over outline, draft, and meta.

---

## Day-to-Day Workflow

Once set up, the ongoing workflow is:

| Frequency | Action | Where |
|-----------|--------|-------|
| **Daily** | Check health score, GSC data (auto-syncs when >6h stale), quick actions | Overview tab |
| **Weekly** | Review AI Visibility scores, drill into failed checks, rewrite weak pages | AI Visibility tab |
| **Weekly** | Scan for insights — freshness, cannibalization, linking gaps | Insights tab |
| **Bi-weekly** | Review keyword positions from GSC, discover new opportunities | Keywords tab |
| **Monthly** | Generate next batch of content calendar ideas + write posts | Strategy tab |
| **Monthly** | Update strategy docs with new findings, deactivate outdated ones | AI Context → Strategy |
| **Quarterly** | Re-run full audit, update GSC baseline, review roadmap | AI Research → Full Audit |

### Automated (no action needed)
- **Weekly cron** (`/api/cron/seo`) — every Monday: snapshot → crawl → insights → email report
- **GSC sync** — auto-syncs on dashboard visit when data is >6 hours stale
- **Crawl-to-tasks** — crawl issues auto-generate actionable SeoTask records
- **Auto-resolve** — tasks auto-close when subsequent crawls show the issue is fixed

---

## The AI Context Chain

Understanding how context flows through the system:

```
Business Profile + Service Nodes + Page Context
         ↓
   seo-context.ts (assembles full prompt)
         ↓
   + Active Strategy Docs (from SeoStrategyDoc table)
   + Tracked Keywords (with GSC performance data)
   + Existing Page Titles (dedup guard)
         ↓
   Feeds into:
   ├── Metadata generation (titles, descriptions)
   ├── Blog writer (outlines, drafts, meta)
   ├── Batch blog writer (same, at scale)
   ├── Keyword research (all 5 modes)
   └── Content calendar generator
```

Every AI output is only as good as this context chain. The onboarding quality directly determines the quality of everything the system produces afterward.