# SeedTech SEO Strategy — Page Playbook

> Single source of truth for all SEO landing pages.
> Every page must follow the technical requirements below.
> Reference this before building any new page.
> Updated April 4, 2026.

---

## 1. Page Requirements (Every SEO Landing Page)

### Metadata
- `export const metadata: Metadata` — hardcoded, NOT from `buildMetadata()` DB
- `title` — primary keyword first, pipe or em-dash separator, brand last. 60 chars max.
- `description` — include geo keyword, CTA trigger, phone number if urgent. 155 chars max.
- `alternates.canonical` — relative path (resolved by `metadataBase` in layout.tsx)
- `openGraph.title` / `openGraph.description` — slightly different wording from meta
- `openGraph.images` — explicit `[{ url: "/og-image.png", width: 1200, height: 630, alt }]`

### JSON-LD (3 schemas per page)
1. **Service or Article** — `@type: Service` for service/location pages, `@type: Article` for insights
2. **FAQPage** — minimum 5 questions, keyword-rich, no duplicate Qs across pages
3. **BreadcrumbList** — absolute URLs with `https://seedtechllc.com`

### Page Structure
- Breadcrumb nav (dark theme, `text-xs`, `max-w-6xl`)
- Hero with `GradientOrb`, `GridPattern`, `LiquidGlassPill`, `AnimatedH1`
- H1 MUST contain the primary keyword
- Primary CTA + secondary CTA (phone or assessment link)
- Alternating `Section theme="light"` / dark sections
- FAQ section (dark theme with `LiquidGlassCard`)
- Internal links section (2x2 grid, `shadow-cardLight` cards on light)
- Final CTA via `CTABanner`

### Cross-Linking Rules
- Every SEO page links to at least 2 other SEO pages + assessment
- Emergency pages link to service pages (and vice versa)
- Location pages link to parent service page + 1-2 sibling location pages
- Insights link to related service pages + sibling insights
- Vertical cluster pages link to all siblings in the cluster + assessment
- Core vertical page links to parent service page + all supporting pages
- Use SEO page routes not service routes

### Content Differentiation Rules
- NO duplicate body copy across pages
- NO duplicate FAQ questions across pages
- Service pages: provider-switching signals
- Emergency pages: crisis symptoms
- IT Support page: day-to-day operational friction
- Location pages: local business pain + why local MSP matters
- Insights: educational, trust-building, non-salesy

### Sitemap
- Every new page added to `src/app/sitemap.ts`
- Service/emergency/vertical pages: `priority: 0.9`
- Location/insights pages: `priority: 0.8`

### Design System
- Section, SectionHeader, LiquidGlassCard, LiquidGlassPill, GradientOrb
- GridPattern, AnimatedH1, CTABanner, IconBox, CardTitle, Body, CheckList
- Light sections: white cards with `border-black/[0.05] shadow-cardLight`
- Dark sections: `LiquidGlassCard` or `liquid-glass` utility
- Warning cards: `border-amber-100 bg-amber-50/30`
- LiquidGlassPill variants: default, seed, blue, cyan, emerald (NO red)

### Brand Constants
- Phone: (914) 362-8889
- Email: support@seedtechllc.com
- Address: Hopatcong, NJ
- Plans: Essentials $110, Plus $130, Pro $160 per user per month
- Tools: NinjaOne (RMM), SentinelOne (endpoint security)
- No contracts, month-to-month, per-user pricing

---

## 2. Page Status Tracker

### Tier 1 — High-Intent Geo Service Pages

| Page | Route | Status |
|------|-------|--------|
| Managed IT Services NJ | /managed-it-services-new-jersey | LIVE |
| IT Support NJ | /it-support-new-jersey | LIVE |
| Emergency IT Support NJ | /emergency-it-support-new-jersey | LIVE |
| Cybersecurity Services NJ | /cybersecurity-services-new-jersey | LIVE |
| Cloud Services NJ | /cloud-services-new-jersey | LIVE |
| Backup and DR NJ | /backup-disaster-recovery-new-jersey | LIVE |

### Tier 2 — Reactive / Emergency Pages

| Page | Route | Status |
|------|-------|--------|
| Server Down Help | /server-down-help | LIVE |
| Ransomware Response NJ | /ransomware-response-new-jersey | LIVE |
| Server Down Business | /server-down-business | LIVE |
| Network Down Business | /network-down-business | LIVE |
| Company Server Down | /company-server-down | LIVE |
| Business Email Down | /business-email-down | LIVE |

### Tier 3 — Location Pages

| Page | Route | Status |
|------|-------|--------|
| Morristown IT Support | /locations/morristown-it-support | LIVE |
| Mendham IT Support | /locations/mendham-it-support | LIVE |
| Chester IT Support | /locations/chester-it-support | LIVE |
| Bernardsville IT Support | /locations/bernardsville-it-support | LIVE |
| Basking Ridge IT Support | /locations/basking-ridge-it-support | LIVE |
| Morris County IT Support | /locations/morris-county-it-support | LIVE |
| Somerset County IT Support | /locations/somerset-county-it-support | LIVE |
| Essex County IT Support | /locations/essex-county-it-support | LIVE |
| Union County IT Support | /locations/union-county-it-support | LIVE |

### Tier 4 — Insights Articles

| Page | Route | Status |
|------|-------|--------|
| What Does Managed IT Cost in NJ? | /insights/what-does-managed-it-cost-nj | LIVE |
| When to Switch IT Providers | /insights/when-to-switch-it-provider | LIVE |
| What Does an MSP Do? | /insights/what-does-an-msp-do | LIVE |
| Signs Your IT Company Is Failing | /insights/signs-your-it-company-is-failing | LIVE |

### Tier 5 — Law Firm Vertical Cluster

| Page | Route | Status |
|------|-------|--------|
| IT Support for Law Firms NJ (core) | /it-support-law-firms-new-jersey | LIVE |
| Cybersecurity for Law Firms NJ | /cybersecurity-law-firms-nj | LIVE |
| Data Security for Law Firms NJ | /data-security-law-firms-nj | LIVE |
| IT Compliance for Law Firms NJ | /it-compliance-law-firms-nj | LIVE |

### Tier 6 — Data-Driven Service & Vertical Pages (Keyword Planner Gap Analysis)

| Page | Route | Status |
|------|-------|--------|
| Endpoint Security NJ | /endpoint-security-new-jersey | LIVE |
| Help Desk Services NJ | /help-desk-services-new-jersey | LIVE |
| Outsourced IT Support NJ | /outsourced-it-support-new-jersey | LIVE |
| Managed Service Provider NJ | /managed-service-provider-new-jersey | LIVE |
| IT Support for Construction Companies NJ | /it-support-construction-companies-nj | LIVE |
| HIPAA-Compliant IT Support NJ | /hipaa-compliant-it-support-nj | LIVE |

---

## 3. Location Page Blueprint

Each location page follows a standardized template with localized content.

Structure:
1. Hero with local context paragraphs
2. Services section (4 cards, light theme, localized descriptions)
3. Local industries section (4 cards, dark theme, specific to area economy)
4. Nearby communities (8+ location pills, light theme)
5. FAQ (5 unique per location, locally relevant)
6. Internal links to managed-it-services-nj + 1-2 sibling locations + assessment
7. CTA with assessment + phone

Key rules:
- County pages use areaServed AdministrativeArea
- Town pages use areaServed City
- Each page references local businesses, industries, and geographic character
- NO duplicate paragraphs across location pages
- Breadcrumb: Home / IT Services NJ / Location Name

---

## 4. Insights Article Blueprint

Long-form educational content targeting informational keywords.

Structure:
1. Hero with question as H1 and featured snippet answer (40-60 words)
2. Detailed breakdown (3-5 sections with H2s)
3. Visual elements (comparison tables, warning cards, numbered steps)
4. How SeedTech approaches this (soft CTA, not salesy)
5. FAQ (5 related questions)
6. Internal links to relevant service pages + sibling insights
7. CTA with assessment

Key rules:
- Tone is educational, not sales-driven
- Include specific numbers, pricing, and real examples
- 800-1200 words of actual content per article
- Target featured snippet format for the primary question
- JSON-LD uses Article type (not Service)

---

## 5. Strategy Principles

- Service pages = primary conversion (assessment CTA)
- Emergency pages = fastest ROI (phone CTA dominant)
- Location pages = ranking expansion (template + local customization)
- Insights = authority + AI training data visibility
- Every page owns its keyword — no cannibalization
- Internal linking builds topical authority cluster around managed IT + NJ

Emergency SEO opportunity: Most MSPs ignore emergency keywords.
These searchers have highest urgency, lowest price sensitivity,
convert to managed IT at high rates, and face almost zero organic competition.

---

## 6. Build Order (Complete)

1. Managed IT Services NJ — DONE
2. IT Support NJ — DONE
3. Emergency IT Support NJ — DONE
4. Cybersecurity Services NJ — DONE
5. Backup and Disaster Recovery NJ — DONE
6. Cloud Services NJ — DONE
7. Server Down Help — DONE
8. Ransomware Response NJ — DONE
9. Location pages (9 pages) — DONE
10. Insights articles (4 articles) — DONE
11. Law firm vertical cluster (4 pages) — DONE
12. Endpoint Security NJ — DONE
13. Help Desk Services NJ — DONE
14. Outsourced IT Support NJ — DONE
15. Managed Service Provider NJ — DONE
16. IT Support for Construction Companies NJ — DONE
17. HIPAA-Compliant IT Support NJ — DONE

All 31 SEO pages are live.
