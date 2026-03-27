# SeedTech

A Next.js 14 (App Router) website + multi-tenant SEO SaaS platform for SeedTech LLC — a web development, Managed IT (SeedCare), and AI-powered SEO agency based in Northern NJ.

## Tech Stack
- **Framework**: Next.js 14 (App Router, `src/app/`)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Neon (serverless), Prisma 7.5 ORM
- **Styling**: Tailwind CSS 3, Framer Motion, GSAP
- **Auth**: NextAuth v4 (credentials, JWT sessions)
- **Email**: Resend
- **AI**: Claude API (via OpenAI SDK), Perplexity API (citations)
- **Deployment**: Vercel (cron: Monday 6 AM UTC)
- **Storage**: Vercel Blob

## Architecture

**Multi-tenant model:** Tenant → Site → all data. Every SEO/content model has `siteId` with cascade deletes.
- Auth: JWT with userId/tenantId/siteId/role. Use `requireSiteContext()` for API routes, `requireAdmin()` for pages.
- Roles: owner / admin / editor / viewer via `Membership` model.
- Constants: `DEFAULT_SITE_ID = "site_seedtech"`, `DEFAULT_TENANT_ID = "tenant_seedtech"`

**SEO Dashboard (9 tabs):** Overview, AI Visibility, Keywords, Site Audit, Insights, Topic Clusters, Citations, Competitors, Strategy.

**Key lib files:**
- `ai-visibility.ts` — 5-dimension AI citation scoring (0-100)
- `seo-eeat.ts` — E-E-A-T analysis (author, expertise, trust signals)
- `seo-aio.ts` — Google AI Overview optimization
- `topic-clusters.ts` — Pillar/spoke cluster generation via Claude
- `citation-checker.ts` — Brand mention tracking across Perplexity, ChatGPT, Gemini, Google AIO
- `site-scoring-config.ts` — DB-driven config loader (IndustryConfig + BusinessProfile + Authors → regex patterns)
- `business-context.ts` — Editable company profile with `buildStrategyPrompt()`
- `cron-runner.ts` — `runTrackedJob()` wrapper for scheduled jobs

**Business context chain:** `BusinessProfile` DB model (production) → `content/business-context.json` (filesystem fallback) → `ai/business-context/managed-it.md` (comprehensive reference doc)

## Project Structure
- `src/app/` — Pages and API routes (App Router)
- `src/components/` — React components (admin, home, layout, kit, ui, forms, quote-flow)
- `src/lib/` — Server utilities, Prisma client, SEO engines, email, auth
- `src/data/` — Static data (FAQs, reviews)
- `prisma/` — Schema, migrations, seed scripts
- `content/` — Business context JSON
- `ai/` — Reference docs (see Context Directory below)
- `design-system/` — Visual design tokens
- `prompts/` — Generator prompt templates

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — Build (runs `prisma generate` first)
- `npm run lint` — ESLint
- `npx prisma db push` — Push schema changes
- `npx prisma migrate dev` — Create migration
- `npx prisma studio` — Database GUI

## Conventions

### Code
- Server components by default; `'use client'` only when needed
- API routes in `src/app/api/`
- Prisma schema is source of truth for DB models
- Environment variables in `.env.local` (never commit)
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Lucide React for icons
- Components under 200 lines; no large layouts in page files
- Pages import from `/components`; don't inline complex UI

### Design (Soft UI Evolution)
- Premium, modern feel — not generic AI landing page layouts
- Large typography, generous spacing, layered dark/light sections
- Glass morphism cards, subtle gradients, hover animations
- Fonts: League Gothic (display/headings), Inter (body)
- GSAP for scroll animations; Framer Motion for transitions
- Mobile responsive on all pages; WCAG AA accessibility
- Inspiration: huemor.rocks

### AI-First Content
- Optimize content for AI citation, not just Google ranking
- 5 dimensions: Citation Readiness, Entity Authority, Structured Clarity, Conversational Fit, Multi-Engine Coverage
- Scoring formula: 50% AI Visibility + 25% E-E-A-T + 25% AIO
- Mandatory blog components: citeable opening (20-60 words), entity definition, Q&A headings, comparison table, FAQ section

## Context Directory (read on-demand, not every session)
- `ai/seo/log.md` — Development log (Phases 1-7 completed, architecture decisions)
- `ai/seo/SYSTEM_REVIEW_2026_03.md` — Full system review, gap analysis, roadmap
- `ai/seo/SEO_AUTOPILOT.md` — SEO Autopilot product guide
- `ai/business-context/managed-it.md` — SeedCare Managed IT business model (436 lines)
- `ai/Industry-context/law-firms.md` — Law firm vertical strategy
- `ai/Industry-context/construction-trucking-specific.md` — Construction/trucking strategy
- `design-system/` — Colors, typography, spacing, animations, UI patterns, icons
- `prompts/` — Component generator, design polish, website generator, SEO generator

## Current State (March 2026)
- **Phases 1-7 complete**: Multi-tenant arch, SaaS readiness, topic authority, AI citation intelligence
- **Next**: Phase 8 (Content Pipeline Maturity), Phase 9 (Client Onboarding Polish)

## Known Tech Debt
- No Stripe billing / subscription system yet
- GSC uses env vars, not OAuth consent flow
- No GA4 data ingestion
- DEFAULT_AUTHORS fallback in seo-eeat.ts (remove when all sites migrated)
- DEFAULT_CONTEXT in business-context.ts is SeedTech-specific
- Competitive URL discovery is basic (sitemap only, no headless browser)
- Gap analysis uses keyword heuristics (could use embeddings)
