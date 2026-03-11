# SeedTech — AI SEO Optimization Strategy

> **Primary Focus:** IT Support (MSP) Department
> **Business:** SeedTech — Managed IT, Web Development, Digital Marketing
> **Location:** Austin, TX
> **Domain:** seedtech.dev
> **Last Updated:** March 11, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
3. [Keyword Strategy — IT Support / MSP](#3-keyword-strategy--it-support--msp)
4. [Site Architecture & URL Strategy](#4-site-architecture--url-strategy)
5. [Page-by-Page SEO Plan](#5-page-by-page-seo-plan)
6. [Content Strategy — Topic Clusters](#6-content-strategy--topic-clusters)
7. [Technical SEO Roadmap](#7-technical-seo-roadmap)
8. [Local SEO Strategy](#8-local-seo-strategy)
9. [Schema / Structured Data Plan](#9-schema--structured-data-plan)
10. [Internal Linking Architecture](#10-internal-linking-architecture)
11. [Core Web Vitals & Performance](#11-core-web-vitals--performance)
12. [Measurement & KPIs](#12-measurement--kpis)
13. [Implementation Phases](#13-implementation-phases)

---

## 1. Executive Summary

SeedTech is an Austin-based MSP and web agency. **IT Support (Managed IT / MSP) is the primary revenue driver and the focus of this SEO strategy.** Web Development and Marketing are secondary service lines that strengthen authority and cross-sell opportunities.

### Strategic Thesis

The Austin MSP market is competitive but highly local. Decision-makers searching for IT support are typically:
- Small-to-midsize business owners (5–150 employees)
- Office managers or operations leads doing vendor research
- CTOs/IT directors at growing companies outgrowing break-fix

**Our edge:** Per-user pricing transparency, no contracts, a real interactive pricing calculator, and the credibility of a web-forward technical brand. The SEO strategy leans into **transactional local intent** (people ready to buy IT support in Austin) while building **topical authority** through educational content.

### Primary Objective

Rank on page 1 for **"managed IT services Austin"**, **"IT support Austin TX"**, and the surrounding long-tail cluster within 6–12 months.

---

## 2. Current State Audit

### What Exists Today

| Area | Status | Notes |
|------|--------|-------|
| **Title tags** | ⚠️ Partial | Only root layout, `/services/web-development`, `/pricing/web-development`, and `/our-work/[slug]` have metadata exports. Most pages (home, about, services index, contact, managed-it, pricing/it-support) have **no page-level metadata**. |
| **Meta descriptions** | ⚠️ Partial | Root layout has a generic description. Most pages inherit it — not unique per page. |
| **H1 tags** | ✅ Present | Every built-out page has a clear `<h1>`. Stub pages (about, services, managed-it, marketing) have minimal content. |
| **Open Graph / Twitter Cards** | ❌ Missing | No OG images, no social meta on any page. |
| **Structured Data (Schema)** | ❌ Missing | No JSON-LD on any page. No Organization, LocalBusiness, FAQ, or Service schema. |
| **Sitemap** | ❌ Missing | No `sitemap.ts` or `sitemap.xml`. |
| **Robots.txt** | ❌ Missing | No `robots.ts` or `robots.txt`. |
| **Canonical tags** | ⚠️ Default | Next.js sets basic canonicals but no explicit overrides. |
| **Image alt text** | ⚠️ Partial | ProjectCard has proper alt text. Many placeholder images have no meaningful alt. |
| **Internal linking** | ⚠️ Weak | Navigation and footer link to main pages. Very few contextual internal links within page content. |
| **Content depth** | ⚠️ Mixed | `/services/web-development` and `/pricing/it-support` are comprehensive (300+ words). `/services/managed-it`, `/about`, `/services`, `/contact` are stubs with <50 words. |
| **Blog / Resource hub** | ❌ Missing | No blog, no resource pages, no educational content. |

### Critical Gaps (Priority Order)

1. **No metadata on the most important MSP pages** — `/services/managed-it` and `/pricing/it-support` are the money pages and have no SEO metadata.
2. **`/services/managed-it` is a stub** — This should be the single most content-rich page on the site for MSP keywords. It currently has ~20 words.
3. **No structured data** — Missing LocalBusiness, Service, FAQ, and Organization schema that Google heavily weights for local service queries.
4. **No sitemap or robots.txt** — Search engines can still crawl, but we're leaving easy wins on the table.
5. **No blog / content marketing** — Zero topical authority. No long-tail content to capture informational queries that feed the MSP funnel.
6. **No local SEO presence** — No Google Business Profile optimization mentioned, no location pages, no NAP consistency.

---

## 3. Keyword Strategy — IT Support / MSP

### Keyword Tiers

#### Tier 1 — Primary (Transactional, High Intent)
These are the money keywords. People searching these are ready to buy or shortlist.

| Keyword | Est. Monthly Volume | Difficulty | Intent | Target Page |
|---------|---------------------|------------|--------|-------------|
| managed IT services Austin | 300–500 | Medium-High | Transactional | `/services/managed-it` |
| IT support Austin TX | 400–600 | Medium | Transactional | `/services/managed-it` |
| IT support company Austin | 200–350 | Medium | Transactional | `/services/managed-it` |
| managed service provider Austin | 150–250 | Medium | Transactional | `/services/managed-it` |
| Austin IT services | 200–400 | Medium | Transactional | `/services/managed-it` |
| IT support pricing | 300–500 | Medium | Commercial | `/pricing/it-support` |
| managed IT pricing per user | 150–250 | Low-Medium | Commercial | `/pricing/it-support` |

#### Tier 2 — Secondary (Commercial Investigation)
People comparing, evaluating, almost ready.

| Keyword | Est. Volume | Difficulty | Intent | Target Page |
|---------|-------------|------------|--------|-------------|
| best managed IT services Austin | 100–200 | Medium | Commercial | `/services/managed-it` |
| small business IT support Austin | 150–300 | Low-Medium | Commercial | `/services/managed-it` |
| outsourced IT support Austin | 100–200 | Low-Medium | Commercial | `/services/managed-it` |
| IT help desk Austin | 100–150 | Low | Commercial | `/services/managed-it` |
| remote IT support Texas | 100–200 | Low | Commercial | `/services/managed-it` |
| IT support no contract | 50–100 | Low | Commercial | `/pricing/it-support` |
| per user IT pricing | 50–150 | Low | Commercial | `/pricing/it-support` |
| break fix vs managed IT | 100–200 | Low | Informational → Commercial | Blog |

#### Tier 3 — Long-Tail (Informational, Funnel Top)
Educational queries that build authority and capture leads earlier.

| Keyword | Est. Volume | Difficulty | Intent | Target Page |
|---------|-------------|------------|--------|-------------|
| how much does managed IT cost | 200–400 | Low | Informational | Blog → `/pricing/it-support` |
| what does a managed service provider do | 300–500 | Low | Informational | Blog |
| signs you need IT support | 100–200 | Low | Informational | Blog |
| IT support for small business cost | 200–350 | Low | Informational | Blog → `/pricing/it-support` |
| how to choose an MSP | 150–300 | Low | Informational | Blog |
| managed IT vs in-house IT | 200–400 | Low-Medium | Informational | Blog |
| cybersecurity for small business Austin | 100–200 | Low | Informational | Blog |
| what is endpoint monitoring | 50–100 | Low | Informational | Blog |
| IT onboarding checklist | 100–200 | Low | Informational | Blog (lead magnet) |
| Microsoft 365 setup for business | 200–400 | Low | Informational | Blog |

### Keyword Mapping Summary

```
/                               → "SeedTech" (brand), "IT support web development Austin"
/services/managed-it            → "managed IT services Austin" (PILLAR PAGE)
/pricing/it-support             → "IT support pricing", "managed IT cost per user"
/services/web-development       → "web development Austin" (secondary)
/pricing/web-development        → "web development pricing" (secondary)
/about                          → "SeedTech Austin", "IT company Austin"
/contact                        → "IT support quote Austin", "contact managed IT Austin"
/our-work                       → "IT support case studies", "MSP portfolio"
/blog/*                         → Long-tail informational cluster (to be created)
```

---

## 4. Site Architecture & URL Strategy

### Current Routes (19)

```
/                                   ← Homepage
/about                              ← Stub
/contact                            ← Has form
/services                           ← Stub index
/services/managed-it                ← STUB — needs full buildout (CRITICAL)
/services/web-development           ← Built out
/services/marketing                 ← Stub
/pricing/it-support                 ← Built out (calculator)
/pricing/web-development            ← Built out (4 tiers)
/our-work                           ← Index with filters
/our-work/[slug] × 5               ← Case study detail pages
/design-kit                         ← Internal tool (should be noindexed)
```

### Proposed New Routes

```
── HIGH PRIORITY (MSP-focused) ──────────────────────────────────
/blog                               ← Blog index
/blog/[slug]                        ← Individual posts
/blog/category/[category]           ← Category archives (it-support, web-dev, etc.)

── MEDIUM PRIORITY ──────────────────────────────────────────────
/services/managed-it/help-desk      ← Service sub-page (optional)
/services/managed-it/cybersecurity  ← Service sub-page (optional)
/services/managed-it/cloud-backup   ← Service sub-page (optional)
/resources                          ← Lead magnets, guides, checklists
/resources/it-onboarding-checklist  ← Gated PDF download (lead gen)
```

### URL Rules

- All lowercase, hyphenated slugs
- No trailing slashes
- No query parameters for content pages
- `/design-kit` should have `noindex` meta
- Blog posts: `/blog/how-much-does-managed-it-cost` (keyword in slug)

---

## 5. Page-by-Page SEO Plan

### 🔴 CRITICAL — `/services/managed-it` (MSP Pillar Page)

This is the single most important page for SEO. It's currently a stub with ~20 words. It needs to be a **comprehensive, 2,000+ word pillar page** targeting "managed IT services Austin."

**Target Keywords:**
- Primary: "managed IT services Austin"
- Secondary: "IT support Austin TX", "managed service provider Austin"
- Supporting: "small business IT support", "outsourced IT Austin", "proactive IT management"

**Proposed Title Tag:**
```
Managed IT Services Austin | Proactive IT Support — SeedTech
```
(57 characters)

**Proposed Meta Description:**
```
Proactive managed IT services in Austin, TX. Unlimited help desk, endpoint monitoring, cybersecurity & cloud backup. Per-user pricing, no contracts. Get a free quote.
```
(163 characters)

**Proposed Page Sections:**
1. **Hero** — Bold statement, primary keyword in H1, CTA to quote flow
2. **Trust Strip** — Client logos / "Trusted by X Austin businesses"
3. **What's Included** — Grid of service features (help desk, monitoring, patching, backup, security, vCIO)
4. **How It Works** — 3-step process (Onboard → Monitor → Support)
5. **Plans Overview** — Summary of 3 tiers linking to `/pricing/it-support`
6. **Why SeedTech vs. Others** — Differentiators (no contracts, transparent pricing, local team)
7. **FAQ Section** — 6-8 FAQs targeting long-tail keywords (★ will generate FAQ schema)
8. **Case Studies / Social Proof** — Testimonials, results
9. **CTA** — "Get Your Free IT Assessment" → quote flow modal

**Content Requirements:**
- H1 must contain "Managed IT Services" and "Austin"
- First paragraph must contain primary keyword naturally
- Include at least 8 internal links (to pricing, blog posts, case studies, contact)
- FAQ answers should be 40-60 words each (featured snippet length)
- Use semantic variations throughout: "IT support", "MSP", "helpdesk", "proactive IT", "remote support"

---

### 🔴 CRITICAL — `/pricing/it-support`

Already well-built with the interactive calculator. Needs metadata and on-page optimization.

**Target Keywords:**
- Primary: "IT support pricing", "managed IT cost per user"
- Secondary: "MSP pricing calculator", "IT support no contract"

**Proposed Title Tag:**
```
IT Support Pricing | Per-User Plans from $110/mo — SeedTech
```
(58 characters)

**Proposed Meta Description:**
```
Transparent IT support pricing starting at $110/user/month. 3 tiers, no contracts, unlimited remote support. Use our calculator for an instant quote.
```
(150 characters)

**On-Page Optimization Needed:**
- Add metadata export
- Ensure H1 contains "IT Support Pricing"
- FAQ section already exists — needs FAQ schema markup
- Add internal links to `/services/managed-it` and future blog posts
- Add breadcrumb navigation for schema

---

### 🟡 IMPORTANT — Homepage `/`

**Target Keywords:**
- Primary: "SeedTech" (brand)
- Secondary: "IT support and web development Austin"

**Proposed Title Tag:**
```
SeedTech | Managed IT Services & Web Development in Austin, TX
```
(62 characters — slightly over but acceptable)

**Proposed Meta Description:**
```
Austin's all-in-one tech partner. Proactive managed IT support, custom web development, and digital marketing. Per-user pricing, no contracts. Get a free quote.
```
(160 characters)

**On-Page Optimization Needed:**
- Add explicit metadata export to `page.tsx` (currently only in layout)
- Ensure homepage H1 is descriptive (currently "Technology That Grows Your Business" — good for brand but weak for keywords)
- Add more content sections — the page is mostly placeholders
- Include an "Austin" mention naturally in above-the-fold content

---

### 🟡 IMPORTANT — `/about`

**Target Keywords:** "SeedTech Austin", "Austin IT company", "about SeedTech"

**Proposed Title Tag:**
```
About SeedTech | Austin IT Support & Web Development Team
```
(57 characters)

**Proposed Meta Description:**
```
Meet the team behind SeedTech — Austin-based IT support and web development experts. We help small and mid-size businesses thrive with proactive technology.
```
(156 characters)

**Status:** Stub — needs full buildout with team info, mission, E-E-A-T signals.

---

### 🟡 IMPORTANT — `/contact`

**Target Keywords:** "contact IT support Austin", "IT support quote"

**Proposed Title Tag:**
```
Contact SeedTech | Get a Free IT Support Quote — Austin, TX
```
(59 characters)

**Proposed Meta Description:**
```
Get in touch with SeedTech for managed IT support, web development, or marketing. Austin-based team, fast response. Call, email, or request a free quote.
```
(153 characters)

---

### 🟢 SECONDARY — `/services/web-development`

Already well-built. Needs metadata optimization for "web development Austin."

**Proposed Title Tag:**
```
Custom Web Development Austin | Websites That Convert — SeedTech
```
(64 characters — trim if needed)

**Current Meta:** Has a metadata export — audit and refine keywords.

---

### 🟢 SECONDARY — `/our-work`

**Proposed Title Tag:**
```
Our Work | Web Development & IT Case Studies — SeedTech
```
(55 characters)

**Proposed Meta Description:**
```
See real results from SeedTech projects — custom ecommerce builds, inventory platforms, and managed IT solutions for Austin businesses.
```
(134 characters)

---

### ⚪ LOW — `/design-kit`

**Action:** Add `robots: { index: false }` to metadata. This is an internal tool, not a public page.

---

## 6. Content Strategy — Topic Clusters

### Pillar + Cluster Model

The **pillar page** is `/services/managed-it`. Every blog post in the IT cluster links back to it, and it links to each cluster post. This builds topical authority.

```
                    ┌──────────────────────────┐
                    │   /services/managed-it    │
                    │    (PILLAR PAGE)          │
                    │  "Managed IT Services     │
                    │        Austin"            │
                    └────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
    ┌─────┴─────┐          ┌─────┴─────┐          ┌─────┴─────┐
    │ Cluster 1 │          │ Cluster 2 │          │ Cluster 3 │
    │  COST &   │          │ CHOOSING  │          │ SECURITY  │
    │  PRICING  │          │  AN MSP   │          │  & RISK   │
    └─────┬─────┘          └─────┬─────┘          └─────┬─────┘
          │                      │                      │
   Blog Posts:              Blog Posts:             Blog Posts:
   ├─ How much does         ├─ How to choose       ├─ Cybersecurity for
   │  managed IT cost?      │  an MSP               │  small business
   ├─ Break-fix vs          ├─ Signs you need       ├─ What is endpoint
   │  managed IT            │  IT support            │  monitoring?
   ├─ IT support for        ├─ Managed IT vs        ├─ Phishing prevention
   │  small business cost   │  in-house IT           │  for employees
   └─ Per-user pricing      └─ Top MSP questions    └─ Data backup strategy
      explained                for Austin biz          for SMBs
```

### Blog Content Calendar — First 12 Posts

Priority order. Each post targets a Tier 3 keyword and links to the pillar page.

| # | Title | Target Keyword | Word Count | Funnel Stage |
|---|-------|----------------|------------|--------------|
| 1 | How Much Does Managed IT Cost in 2026? | how much does managed IT cost | 2,000 | Top → Mid |
| 2 | Break-Fix vs. Managed IT: Which Is Right for Your Business? | break fix vs managed IT | 1,800 | Mid |
| 3 | 7 Signs Your Small Business Needs IT Support | signs you need IT support | 1,500 | Top |
| 4 | How to Choose a Managed Service Provider (MSP) | how to choose an MSP | 2,000 | Mid |
| 5 | Managed IT vs. In-House IT: A Cost Comparison | managed IT vs in-house IT | 1,800 | Mid |
| 6 | IT Support for Small Business: What to Expect & What It Costs | IT support for small business cost | 1,800 | Top → Mid |
| 7 | What Does a Managed Service Provider Actually Do? | what does a managed service provider do | 1,500 | Top |
| 8 | Cybersecurity Basics for Small Businesses in Austin | cybersecurity for small business Austin | 1,500 | Top |
| 9 | What Is Endpoint Monitoring (And Why Does Your Business Need It)? | what is endpoint monitoring | 1,200 | Top |
| 10 | The IT Onboarding Checklist Every Growing Team Needs | IT onboarding checklist | 1,500 | Top (lead magnet) |
| 11 | Microsoft 365 Setup for Business: A Step-by-Step Guide | Microsoft 365 setup for business | 1,800 | Top |
| 12 | Per-User IT Pricing Explained: Why It's Better for Small Business | per user IT pricing | 1,500 | Mid |

### Publishing Cadence

- **Month 1–3:** 2 posts/month (foundational cluster)
- **Month 4–6:** 3 posts/month (expanding long-tail)
- **Ongoing:** 2–4 posts/month

---

## 7. Technical SEO Roadmap

### Priority 1 — Metadata (Every Page)

Add `export const metadata: Metadata = { ... }` to every page that's missing one. See Section 5 for exact titles and descriptions.

Pages missing metadata:
- `/` (page.tsx — currently inherits from layout only)
- `/about`
- `/contact`
- `/services` (index)
- `/services/managed-it` ← CRITICAL
- `/services/marketing`
- `/pricing/it-support` ← CRITICAL
- `/our-work` (index)
- `/design-kit` (needs `noindex`)

### Priority 2 — Sitemap & Robots

**`app/sitemap.ts`** — Dynamic sitemap covering all routes + future blog posts.

**`app/robots.ts`** — Allow all crawlers, block `/design-kit`, `/api/`, point to sitemap.

### Priority 3 — Structured Data (JSON-LD)

See Section 9 for full schema plan.

### Priority 4 — Open Graph Images

- Create a default OG image (1200×630) with SeedTech branding
- Create per-page OG images for money pages (`/services/managed-it`, `/pricing/it-support`)
- Use Next.js `opengraph-image.tsx` convention for dynamic generation if feasible

### Priority 5 — Performance & Core Web Vitals

See Section 11.

---

## 8. Local SEO Strategy

SeedTech is Austin-based. **Local SEO is critical for MSP keywords** because "IT support" queries have strong local intent (Google surfaces map packs).

### Google Business Profile (GBP)

- [ ] Claim and verify Google Business Profile for "SeedTech"
- [ ] Category: Primary — "Managed IT Service Provider" / "IT Services"
- [ ] Secondary categories: "Web Development", "Internet Marketing"
- [ ] Add complete NAP (Name, Address, Phone) matching website footer exactly
- [ ] Add business hours
- [ ] Upload 10+ high-quality photos (office, team, events, work)
- [ ] Write business description with primary keywords
- [ ] Add all services as GBP "Services"
- [ ] Post weekly updates (blog posts, case studies, announcements)
- [ ] Respond to all reviews within 24 hours

### NAP Consistency

Ensure the exact same format appears everywhere:

```
SeedTech
Austin, TX
hello@seedtech.dev
(XXX) XXX-XXXX
```

**Directories to list on:**
- Google Business Profile
- Bing Places
- Apple Business Connect
- Yelp
- Clutch.co (B2B directory — strong for MSPs)
- UpCity
- LinkedIn Company Page
- Facebook Business Page
- Better Business Bureau (BBB)
- ChannelE2E / Channel Futures (MSP directories)

### Local Content Signals

- Mention "Austin, TX" naturally on key pages (homepage, managed-it, about, contact)
- Consider a "/locations/austin" page if expanding to other markets later
- Reference local businesses in case studies
- Blog about Austin-specific IT topics ("Austin small business cybersecurity")

### Review Strategy

- Ask satisfied clients for Google reviews after successful onboarding
- Target: 15+ Google reviews within 6 months
- Respond professionally to every review (positive and negative)
- Include review links in email signatures and post-project follow-ups

---

## 9. Schema / Structured Data Plan

### Homepage — Organization + LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "SeedTech",
  "url": "https://seedtech.dev",
  "logo": "https://seedtech.dev/img/logo.png",
  "description": "Austin-based managed IT services, web development, and digital marketing.",
  "email": "hello@seedtech.dev",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "City",
    "name": "Austin"
  },
  "sameAs": [
    "https://www.linkedin.com/company/seedtechmedia",
    "https://www.instagram.com/seedtechmedia",
    "https://www.tiktok.com/@seedtechmedia"
  ]
}
```

### `/services/managed-it` — Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Managed IT Services",
  "provider": { "@type": "Organization", "name": "SeedTech" },
  "serviceType": "Managed IT Support",
  "areaServed": { "@type": "City", "name": "Austin" },
  "description": "Proactive managed IT services including unlimited help desk, endpoint monitoring, cybersecurity, and cloud backup.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "110",
    "highPrice": "160",
    "priceCurrency": "USD",
    "offerCount": "3"
  }
}
```

### `/pricing/it-support` — FAQ Schema

Extract existing FAQ data and generate:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What counts as a 'seat' or 'user'?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "One seat = one person on your team who needs IT support. It covers all their devices — laptop, phone, monitors, etc."
      }
    }
    // ... more questions
  ]
}
```

### `/our-work/[slug]` — Case Study / Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "PaddlersCove — BigCommerce Storefront & Custom Inventory Platform",
  "author": { "@type": "Organization", "name": "SeedTech" },
  "publisher": { "@type": "Organization", "name": "SeedTech" }
}
```

### Blog Posts — Article + BreadcrumbList Schema

Each blog post should get Article schema and breadcrumbs.

### All Sub-Pages — BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seedtech.dev" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://seedtech.dev/services" },
    { "@type": "ListItem", "position": 3, "name": "Managed IT", "item": "https://seedtech.dev/services/managed-it" }
  ]
}
```

---

## 10. Internal Linking Architecture

### Current Issue

Pages are mostly siloed — linked from nav/footer only. There's almost no contextual linking within page content.

### Target Architecture

```
Homepage
├── links to → /services/managed-it (primary CTA)
├── links to → /pricing/it-support
├── links to → /our-work (featured projects)
└── links to → /about

/services/managed-it (PILLAR)
├── links to → /pricing/it-support ("See our pricing")
├── links to → /our-work/paddlers-cove (case study proof)
├── links to → /contact ("Get a free assessment")
├── links to → each blog cluster post
└── links to → /about ("Meet the team behind your IT")

/pricing/it-support
├── links to → /services/managed-it ("Learn what's included")
├── links to → /contact
└── links to → blog posts about pricing

/blog/[post]
├── links to → /services/managed-it (pillar — EVERY post)
├── links to → /pricing/it-support (when relevant)
├── links to → other cluster blog posts (2-3 per post)
└── links to → /contact or /our-work
```

### Rules

- Every blog post links to the managed IT pillar page at least once
- Every service page links to its pricing page and vice versa
- Use descriptive anchor text (never "click here")
- 3–5 internal links per 1,000 words of content
- Update old content with links to new content when published

---

## 11. Core Web Vitals & Performance

### Current Strengths

- **Next.js 14 with App Router** — Server components by default (fast TTFB)
- **Static generation (SSG)** — All 19 routes are prerendered (zero server cost)
- **Image optimization** — Using `next/image` for project cards
- **Font optimization** — Using `next/font/google` with `display: swap`
- **WebP images** — All uploaded images are already WebP

### Audit Checklist

- [ ] Run Lighthouse on all key pages — target 90+ performance score
- [ ] Verify LCP < 2.5s (hero images are the likely LCP element)
- [ ] Verify CLS < 0.1 (font swap + image dimensions are set — should be good)
- [ ] Verify FID/INP < 200ms (minimal client JS on most pages)
- [ ] Ensure all images have explicit `width`/`height` or `fill` with `sizes`
- [ ] Add `loading="lazy"` to below-fold images (Next.js does this automatically for `next/image`)
- [ ] Preload critical fonts if not already done by `next/font`
- [ ] Minimize third-party scripts (analytics, chat widgets, etc.)

### Recommendations

- Keep framer-motion usage lightweight — only on interactive pages (pricing calculator)
- Avoid layout shifts from dynamic content loading
- Consider adding `rel="preload"` for the hero images on money pages
- Compress all public images further if not already optimized

---

## 12. Measurement & KPIs

### Tools to Set Up

| Tool | Purpose | Priority |
|------|---------|----------|
| **Google Search Console** | Track impressions, clicks, keyword positions, indexing | 🔴 Immediate |
| **Google Analytics 4** | Track organic traffic, conversions, behavior | 🔴 Immediate |
| **Google Business Profile** | Local search visibility, reviews, profile views | 🔴 Immediate |
| **PageSpeed Insights** | Core Web Vitals monitoring | 🟡 Week 1 |
| **Ahrefs or SEMrush** | Keyword tracking, backlink monitoring, competitor analysis | 🟡 Month 1 |

### KPIs to Track Monthly

| Metric | Baseline (Today) | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|-------------------|-----------------|-----------------|-----------------|
| Organic traffic (sessions/mo) | ~0 (new site) | 200 | 800 | 2,500+ |
| Indexed pages | ~10 | 20 | 35+ | 50+ |
| Avg. keyword position — "managed IT services Austin" | Not ranking | Top 30 | Top 15 | Top 5 |
| Avg. keyword position — "IT support Austin" | Not ranking | Top 30 | Top 10 | Top 5 |
| Google Business Profile views/mo | 0 | 200 | 500 | 1,000+ |
| Organic leads (quote requests) | 0 | 2 | 8 | 20+ |
| Blog posts published | 0 | 4 | 12 | 24+ |
| Google reviews | 0 | 5 | 15 | 30+ |
| Domain authority (Ahrefs DR) | 0 | 5 | 15 | 25+ |
| Backlinks | 0 | 10 | 30 | 75+ |

### Conversion Tracking

Set up GA4 events for:
- Quote flow modal opened
- Quote flow completed (form submitted)
- Calculator interaction (step completions)
- Phone number clicks
- Email link clicks
- "Contact" page form submissions

---

## 13. Implementation Phases

### Phase 1 — Foundation (Weeks 1–2) ⬅️ START HERE

**Goal:** Fix critical technical gaps. No content creation yet.

- [ ] Add `export const metadata` to every page (titles + descriptions from Section 5)
- [ ] Create `app/sitemap.ts` with all current routes
- [ ] Create `app/robots.ts` (allow all, block `/design-kit`, point to sitemap)
- [ ] Add `robots: { index: false }` to `/design-kit` metadata
- [ ] Set up Google Search Console and verify domain
- [ ] Set up Google Analytics 4
- [ ] Claim Google Business Profile

### Phase 2 — Money Page (Weeks 3–5)

**Goal:** Build out the MSP pillar page — the single highest-impact SEO action.

- [ ] Build comprehensive `/services/managed-it` page (2,000+ words, all sections from Section 5)
- [ ] Add Service schema (JSON-LD) to managed-it page
- [ ] Add FAQ schema to `/pricing/it-support`
- [ ] Add Organization + LocalBusiness schema to homepage
- [ ] Add BreadcrumbList schema to all sub-pages
- [ ] Create default OG image (1200×630) and add Open Graph metadata

### Phase 3 — Content Engine (Weeks 6–12)

**Goal:** Launch blog, start building topical authority.

- [ ] Build blog infrastructure (`/blog`, `/blog/[slug]`, MDX or CMS integration)
- [ ] Publish first 4 blog posts (posts #1–4 from content calendar)
- [ ] Implement internal linking between blog posts ↔ pillar page ↔ pricing
- [ ] Add Article schema to blog posts
- [ ] Set up weekly GBP posting schedule (share blog posts)

### Phase 4 — Expansion (Months 3–6)

**Goal:** Scale content, build authority, start link-building.

- [ ] Publish 2–3 blog posts per month
- [ ] Build out `/about` page fully (E-E-A-T signals, team bios)
- [ ] Build out remaining service stubs (`/services`, `/services/marketing`)
- [ ] Create lead magnet (IT Onboarding Checklist PDF → `/resources`)
- [ ] Begin local link-building (Austin business directories, chamber of commerce)
- [ ] Guest post or get quoted in Austin Business Journal, local tech publications
- [ ] List on MSP directories (Clutch, UpCity, ChannelE2E)
- [ ] Actively collect Google reviews (target 15+)

### Phase 5 — Optimization (Months 6–12)

**Goal:** Refine based on data, double down on what's working.

- [ ] Audit keyword rankings — adjust content strategy based on Search Console data
- [ ] Refresh and update top-performing blog posts
- [ ] A/B test title tags and meta descriptions for CTR improvement
- [ ] Expand into adjacent keyword clusters if MSP cluster is well-covered
- [ ] Consider service sub-pages if search volume warrants it
- [ ] Evaluate paid search (Google Ads) to supplement organic for high-value MSP keywords

---

## Appendix: Competitor Landscape (Austin MSP Market)

Research these competitors to understand what's ranking and identify content gaps:

| Competitor | Domain | Notes |
|------------|--------|-------|
| Gravity Systems | gravitysystems.io | Well-established Austin MSP, likely strong local SEO |
| Managed Solution | managedsolution.com | Regional MSP with content marketing |
| Eureka Process | eurekaprocess.com | Austin IT consulting |
| IT Support Austin (generic) | Various | Check who's ranking for the primary keyword |

**Competitor Audit Tasks:**
- [ ] Search "managed IT services Austin" — note top 5 organic results
- [ ] Analyze their title tags, meta descriptions, content depth
- [ ] Identify content topics they cover that SeedTech doesn't
- [ ] Note their schema markup usage
- [ ] Check backlink profiles (Ahrefs)
- [ ] Find content gaps SeedTech can fill first

---

*This document is the strategic blueprint. Implementation starts with Phase 1 (technical foundations). No code changes until strategy is approved.*
