# SeedTech Platform — Requirements & Architecture

> **Purpose:** Single source of truth for how the SeedTech platform's AI, SEO, and content
> systems work together. Reference this when building new features, onboarding clients,
> or debugging AI output quality.
>
> **Last updated:** March 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Business Context](#2-business-context)
3. [Page Context](#3-page-context)
4. [SEO Keywords](#4-seo-keywords)
5. [AI Context Pipeline](#5-ai-context-pipeline)
6. [Metadata Generation](#6-metadata-generation)
7. [Page Context Auto-Population](#7-page-context-auto-population)
8. [Admin UI Map](#8-admin-ui-map)
9. [Data Flow Diagram](#9-data-flow-diagram)
10. [Rules & Constraints](#10-rules--constraints)

---

## 1. System Overview

The platform has a 3-layer AI context system that feeds every AI-generated output:

```
┌─────────────────────────────────────────────────────┐
│                   AI OUTPUT LAYER                    │
│  Metadata generation · Blog writing · SEO advisor   │
│  Keyword discovery · Content scoring                 │
└────────────────────────┬────────────────────────────┘
                         │ reads from
┌────────────────────────▼────────────────────────────┐
│              CENTRALIZED CONTEXT BUILDER              │
│              src/lib/seo-context.ts                   │
│  buildSeoContext({ siteId, path, pageKind, ... })    │
└──┬──────────────────┬──────────────────┬────────────┘
   │                  │                  │
   ▼                  ▼                  ▼
┌────────┐     ┌────────────┐     ┌──────────┐
│Business│     │Page Context │     │ Keywords │
│Context │     │  (per-page) │     │(tracked) │
└────────┘     └────────────┘     └──────────┘
   DB: Site        DB: PageContext    DB: TrackedKeyword
```

**Priority order for AI generation:**
1. **Page Context** — #1 signal. What the specific page is about.
2. **Keywords** — keywords explicitly targeting this page are HIGH PRIORITY.
3. **Business Context** — brand name, tone, positioning. Secondary.

---

## 2. Business Context

### What it is
Company-wide identity, services, tone of voice, and custom instructions. Applies to
every AI output across all pages.

### Where it lives
- **DB:** Fields on the `Site` model (via `getBusinessContextForSite()`)
- **Admin UI:** `/admin/seo/context` → Business Profile section
- **API:** `GET/PUT /api/admin/settings/business-context`

### Required fields
| Field | Required | Purpose |
|-------|----------|---------|
| `companyName` | **Yes** | Brand name in all outputs |
| `domain` | **Yes** | Canonical domain for URLs |
| `location` | **Yes** | Local SEO signals |
| `primaryService` | **Yes** | Core offering context |
| `tagline` | Recommended | Brand positioning |
| `secondaryServices` | Recommended | Full service awareness |
| `targetAudience` | Recommended | Who we're writing for |
| `uniqueSellingPoints` | Recommended | Differentiation angles |
| `toneOfVoice` | Recommended | Writing style direction |
| `customInstructions` | Optional | Override rules (e.g., "never use the word 'elevate'") |

### How it's used
- `buildStrategyPrompt(ctx)` converts DB fields into a structured prompt section
- Injected into every AI call as `═══ BUSINESS CONTEXT ═══` (secondary priority)
- Used for brand name suffixes, tone consistency, and positioning

---

## 3. Page Context

### What it is
A human-written (or AI-generated) description of what a specific page covers. This is
the **#1 signal** the AI uses when generating metadata or content for that page.

### Where it lives
- **DB:** `PageContext` model — `{ siteId, path, description, keywords[], pageType }`
- **Unique constraint:** `@@unique([siteId, path])`
- **Admin UI:** `/admin/seo/context` → Page Context Map section
- **API:** `CRUD /api/admin/seo/page-contexts`

### Schema
```prisma
model PageContext {
  id          String   @id @default(cuid())
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  path        String                    // e.g., "/services/managed-it"
  description String   @db.Text        // 2-4 sentences about what the page covers
  keywords    String[]                  // page-specific keywords
  pageType    String   @default("page") // page | service | industry | blog | landing
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@unique([siteId, path])
  @@map("page_contexts")
}
```

### States
| Source | Badge | Meaning |
|--------|-------|---------|
| `custom` | 🟣 Configured | Has a DB-stored description |
| `unconfigured` | 🟡 Needs context | Page exists but no context written yet |

### Page discovery
The system discovers pages from 3 sources (no hardcoded defaults):
1. **Static routes** — 27 known routes defined in the API
2. **Blog posts** — published `BlogPost` records → `/blog/{slug}`
3. **Crawled pages** — `SitePage` records with `status: "active"`

### Rules
- **Never fall back to hardcoded default descriptions.** If a page has no context,
  the AI receives: `"No page context available. Infer purpose from URL path: {path}"`
- Page context is fetched per-page during generation, not cached globally
- Blog posts at `/blog/*` get supplemented with actual post title/excerpt from `BlogPost` table

---

## 4. SEO Keywords

### What they are
Tracked keywords with tier, intent, volume, competition, and target page assignment.

### Where they live
- **DB:** `TrackedKeyword` model
- **Admin UI:** `/admin/seo/context` → Keywords section
- **API:** `/api/admin/seo/keywords`

### How they influence AI
Keywords are split into 3 buckets per page during generation:

| Bucket | Label in prompt | Behavior |
|--------|----------------|----------|
| Keywords targeting THIS page | `HIGH PRIORITY` | AI must weave primary keyword into title |
| General/unassigned keywords | `use if relevant` | AI may use if they fit the page |
| Keywords targeting OTHER pages | `do NOT use` | Listed only for differentiation |

### Fields
| Field | Purpose |
|-------|---------|
| `keyword` | The search term |
| `tier` | tier1 (primary) / tier2 (secondary) / tier3 (long-tail) |
| `intent` | informational / transactional / navigational / commercial |
| `targetPage` | Which page this keyword belongs to (path) |
| `volume` | Monthly search volume |
| `competition` | low / medium / high |
| `currentPosition` | GSC-reported ranking position |

---

## 5. AI Context Pipeline

### `buildSeoContext()` — the single entry point

**Location:** `src/lib/seo-context.ts`

**Input:**
```typescript
interface SeoContextOptions {
  siteId: string;
  path: string;
  pageKind?: string | null;
  currentTitle?: string | null;
  currentDescription?: string | null;
  existingTitles?: string[];  // for differentiation
}
```

**Output:**
```typescript
interface SeoContextResult {
  businessContext: string;
  keywordsContext: string;
  pageContext: string;
  existingTitlesContext: string;
  fullPrompt: string;  // ready to send to Claude
}
```

**What it assembles (in order):**
1. Business context via `getBusinessContextForSite()` + `buildStrategyPrompt()`
2. Keywords via `TrackedKeyword` query, split by relevance to the target page
3. Page context via `PageContext` DB lookup (+ blog post data if `/blog/*`)
4. Existing titles for differentiation
5. Full prompt with quality rules, char limits, and JSON output format

### Who calls it
| Caller | Purpose |
|--------|---------|
| `/api/admin/seo/metadata/generate` | Single page metadata generation |
| `/api/admin/seo/metadata/generate-all` | Bulk metadata generation (SSE) |
| `/api/admin/seo/context-preview` | Preview what AI sees for a page |

---

## 6. Metadata Generation

### Single page
- **API:** `POST /api/admin/seo/metadata/generate`
- Calls `buildSeoContext()` → sends `fullPrompt` to Claude → parses JSON → saves to `PageMetadata`
- Returns: `{ title, description, ogTitle, ogDescription, canonical, jsonLdType }`

### Bulk (all pages)
- **API:** `POST /api/admin/seo/metadata/generate-all`
- SSE streaming with live progress
- Discovers pages from: static routes + blog posts + crawled pages
- Skips pages with complete metadata by default (`skipComplete: true`)
- `callClaudeWithRetry()` — 5 retries, exponential backoff (2s→30s), Retry-After header support
- 1s delay between calls for rate limiting
- **UI:** Metadata tab → "Bulk Generate" → Lottie progress modal

### Claude model
- `claude-sonnet-4-20250514`
- `max_tokens: 512`
- Direct fetch to `api.anthropic.com` (env var: `CLAUDE_API_KEY`)

---

## 7. Page Context Auto-Population

### How it works
Both single-page and bulk context generation **fetch the actual live page content**
using `fetchPageText()` from `src/lib/fetch-page-text.ts`. This fetches the rendered
HTML from the live site, strips nav/footer/scripts, and extracts:
- Page title
- Meta description
- All headings (H1-H4)
- Body text (capped at ~4000 chars)

This real page content is the **primary source** Claude uses. Business context is
provided only for brand awareness — it must never override what the page actually says.

### `fetchPageText()` utility
**Location:** `src/lib/fetch-page-text.ts`

- Fetches from `NEXT_PUBLIC_SITE_URL` + path
- Uses JSDOM to parse HTML
- Strips: nav, header, footer, script, style, SVG, iframe, cookie banners
- Returns: `{ title, metaDescription, headings[], bodyText, summary }`
- 15s timeout, graceful fallback to null if fetch fails

### Bulk auto-populate
- **API:** `POST /api/admin/seo/page-contexts/generate-all`
- SSE streaming — same pattern as metadata bulk generate
- Skips already-configured pages by default
- For each unconfigured page: sends business context + existing metadata + URL structure to Claude
- Claude returns: `{ description, keywords[], pageType }`
- Saves to `PageContext` via upsert
- **UI:** Page Context Map → "Auto-populate with AI" button → Lottie progress modal

### Single page AI generate
- **API:** `POST /api/admin/seo/page-contexts/generate-single`
- Body: `{ path, kind?, save? }`
- `save=false` returns result without persisting (for preview in editor)
- 3 retries with exponential backoff
- **UI:** Inline editor → "Generate with AI" button → populates draft fields

### When to auto-generate
- **Backward compat:** "Auto-populate with AI" button for all existing unconfigured pages
- **Going forward:** When a new page is created/published (future directive)
- Users can always review and edit AI-generated context before or after saving

---

## 8. Admin UI Map

### SEO → AI Context (`/admin/seo/context`)
4 sections with secondary sidebar:

| Section | What it manages |
|---------|----------------|
| **Business Profile** | Company identity, services, tone, custom instructions |
| **Page Context Map** | Per-page descriptions + AI auto-populate |
| **Keywords** | Tracked keywords with tier/intent/target page |
| **AI Preview** | Preview the full prompt Claude receives for any page |

### SEO → Metadata Tab (`/admin/seo` → Metadata tab)
- Per-page metadata editor (title, description, OG, canonical, etc.)
- Single-page AI generate button
- Bulk generate modal with Lottie progress

### SEO → Settings (`/admin/seo/settings`)
- Connections (API keys — GSC, Claude)
- Automation & Reports (cron, email, IndexNow)

---

## 9. Data Flow Diagram

```
User creates/edits Business Profile
         │
         ▼
User writes Page Context (or clicks "Auto-populate with AI")
         │
         ▼
User adds Tracked Keywords with target pages
         │
         ▼
User clicks "Generate Metadata" (single or bulk)
         │
         ▼
buildSeoContext() assembles 3 layers into one prompt
         │
         ▼
Claude generates metadata (title, desc, OG, canonical, jsonLd)
         │
         ▼
Saved to PageMetadata table
         │
         ▼
Next.js pages read metadata at build/request time
```

---

## 10. Rules & Constraints

### Hard rules (never break these)
1. **No hardcoded default descriptions.** The system must never fall back to pre-written
   page descriptions. If no context exists, tell the AI to infer from the URL path.
2. **Page context is the #1 signal.** Business context is secondary. A service page about
   web development should never produce metadata about IT support.
3. **One source of truth.** `buildSeoContext()` is the only function that assembles AI
   prompts for SEO generation. All routes call it — never build prompts ad-hoc.
4. **No marketing fluff in AI outputs.** The Claude prompt explicitly bans: "top-notch",
   "cutting-edge", "premier", "best-in-class", "elevate".
5. **Differentiation is enforced.** Existing titles from other pages are passed to Claude
   so it can't produce duplicate-sounding metadata across pages.

### Rate limiting
- Bulk generation: 1s delay between Claude calls
- `callClaudeWithRetry()`: 5 retries, exponential backoff (2s, 4s, 8s, 16s, 30s)
- Respects `Retry-After` header from Claude API
- Max duration: 300s (5 min) for Vercel serverless

### Multi-tenant
- Every query is scoped by `siteId` via `requireSiteContext()`
- `requireSiteContext()` returns `{ userId, tenantId, siteId, role, email }`
- All models cascade delete from Site → Tenant
- Role hierarchy: owner > admin > editor > viewer
