# Page Building Directive

> **Purpose:** Step-by-step reference for building new pages on the SeedTech platform.
> Follow this for every new page to ensure consistency in structure, metadata,
> AI context, SEO, and design system compliance.
>
> **Last updated:** March 2026

---

## Quick Reference

```
New page checklist:
  1. Create page.tsx with correct file structure
  2. Export static metadata object
  3. Add page context to the AI Context system
  4. Add to STATIC_ROUTES if it's a permanent page
  5. Wire structured data (JSON-LD)
  6. Follow section/component patterns below
  7. Verify with AI Context Preview
```

---

## 1. File Structure

All public-facing pages live in `src/app/`. Follow Next.js App Router conventions.

```
src/app/
├── page.tsx                          # Homepage
├── about/page.tsx                    # Top-level pages
├── contact/page.tsx
├── services/
│   ├── page.tsx                      # Service landing/overview
│   ├── managed-it/
│   │   ├── page.tsx                  # Service main page
│   │   ├── plans/page.tsx            # Sub-pages
│   │   ├── assessment/page.tsx
│   │   └── ...
│   ├── web-development/page.tsx
│   ├── seedtech-platform/page.tsx
│   └── ...
├── industries/
│   ├── page.tsx                      # Industry landing
│   ├── trucking/page.tsx             # Industry-specific pages
│   └── ...
├── pricing/
│   ├── it-support/page.tsx
│   └── web-development/page.tsx
├── blog/
│   ├── page.tsx                      # Blog index
│   └── [slug]/page.tsx               # Dynamic blog posts
└── ...
```

---

## 2. Page Template

Every page follows this general structure:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill,
  CTABanner, IconBox, ProcessStep, /* ... */
} from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

// ─── Static Metadata (required) ────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Page Title — SeedTech",
  description: "140-155 char meta description with clear value prop.",
  openGraph: {
    title: "OG Title (slightly different from page title)",
    description: "Social description, more conversational.",
    url: "https://seedtechllc.com/path",
    type: "website",
  },
  alternates: { canonical: "/path" },
};

// ─── Data (keep page data co-located) ──────────────────────────────────────
const features = [ /* ... */ ];
const steps = [ /* ... */ ];

// ─── Page Component ────────────────────────────────────────────────────────
export default function PageName() {
  return (
    <>
      {/* Structured Data */}
      <ServiceJsonLd name="..." description="..." url="..." />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://seedtechllc.com" },
        { name: "Services", url: "https://seedtechllc.com/services" },
        { name: "This Page", url: "https://seedtechllc.com/services/this-page" },
      ]} />

      {/* Hero Section */}
      <Section className="pt-32 md:pt-40">
        <GradientOrb />
        <GridPattern />
        {/* Hero content */}
      </Section>

      {/* Content Sections */}
      <Section>
        <SectionHeader eyebrow="SECTION" title="Section Title" description="..." />
        {/* Section content */}
      </Section>

      {/* CTA Section */}
      <Section>
        <CTABanner
          headline="Clear CTA headline"
          body="Supporting CTA copy."
          primaryCta={{ label: "Primary Action", href: "/contact" }}
        />
      </Section>
    </>
  );
}
```

---

## 3. Metadata Requirements

### Static metadata export (in page.tsx)
Every page **must** export a `metadata` object. This is the initial/fallback metadata.

```tsx
export const metadata: Metadata = {
  title: "Descriptive Title ≤60 chars — SeedTech",
  description: "Value-focused description ≤155 chars.",
  openGraph: {
    title: "Slightly different OG title ≤70 chars",
    description: "Social-optimized description ≤200 chars",
    url: "https://seedtechllc.com/full-path",
    type: "website",
  },
  alternates: { canonical: "/path" },
};
```

### AI-generated metadata (via admin panel)
After the page is live, metadata can be regenerated via:
- Admin → SEO → Metadata tab → click page → "Generate with AI"
- Admin → SEO → Metadata tab → "Bulk Generate All"

AI-generated metadata is stored in the `PageMetadata` DB table and served dynamically.
The static export acts as the fallback if no DB record exists.

### Rules
- Title: 50-60 chars. Front-load the most important concept.
- Description: 140-155 chars. Clear value prop + soft CTA.
- OG title/description should differ slightly from SEO title/description.
- Include brand suffix ` — SeedTech` in static titles (AI appends it automatically).
- Canonical is always the relative path (e.g., `/services/managed-it`).

---

## 4. Page Context Requirements

### Why it matters
Page context is the **#1 signal** the AI uses when generating metadata, blog content,
and keyword recommendations for a page. Without it, AI outputs will be generic.

### When to create page context
- **Immediately** when building a new page, or
- After launch via the "Generate with AI" button in the inline editor

### How to add page context
1. Go to **Admin → SEO → AI Context → Page Context Map**
2. Find the new page (it auto-discovers from static routes, blog posts, and crawled pages)
3. Click the page → write or AI-generate a description

### What to write
A **2-4 sentence description** that covers:
- What the page is about (services, products, information)
- Who the target audience is
- What action visitors should take

**Good example:**
> "This is the Managed IT services landing page for SeedTech. It covers the three
> SeedCare tiers (Essentials, Plus, Pro), per-user pricing, the proactive monitoring
> approach, tech stack (NinjaOne, SentinelOne), and the assessment-first sales process.
> Target audience is SMBs in the NY/NJ metro area looking for reliable, no-contract
> IT support. Primary CTA is to request a free assessment."

**Bad example:**
> "IT support page"

### Also set
- **Keywords:** 3-5 page-specific keywords (comma-separated)
- **Page Type:** page / service / industry / blog / landing

---

## 5. STATIC_ROUTES Registration

If the page is a permanent (non-dynamic) page, add it to the `STATIC_ROUTES` array
in **three files**:

| File | Purpose |
|------|---------|
| `src/app/api/admin/seo/page-contexts/route.ts` | Page context discovery |
| `src/app/api/admin/seo/metadata/generate-all/route.ts` | Bulk metadata generation |
| `src/app/api/admin/seo/page-contexts/generate-all/route.ts` | Bulk context generation |

```typescript
{ path: "/services/new-service", kind: "service" },
```

**Page kinds:**
- `page` — general pages (about, contact, pricing, reviews)
- `service` — service offering pages
- `industry` — industry vertical pages
- `blog` — blog posts (auto-discovered, don't add manually)
- `landing` — lead-gen landing pages (e.g., free-audit)

> **Note:** Blog posts are auto-discovered from the `BlogPost` table. Do NOT add them
> to STATIC_ROUTES. Crawled pages are also auto-discovered from `SitePage`.

---

## 6. Design System Components

### Layout primitives

| Component | Import | Purpose |
|-----------|--------|---------|
| `Section` | `@/components/layout/Section` | Page section wrapper — `py-24 md:py-32`, max-w-6xl, dark/light theme |
| `SectionHeader` | `@/components/layout/SectionHeader` | Eyebrow + animated title + description |

### Kit components (import from `@/components/kit`)

| Component | Usage |
|-----------|-------|
| `AnimatedH1` | Hero headlines (page title, animated on load) |
| `SplitTextReveal` | Animated text with word-by-word reveal |
| `GradientOrb` | Background gradient blur effect |
| `GridPattern` | Subtle dot-grid background pattern |
| `LiquidGlassCard` | Frosted glass card (primary card style) |
| `LiquidGlassPill` | Small pill/badge with glass effect |
| `GlassCard` | Simpler glass card variant |
| `CTABanner` | Full-width CTA section with headline + buttons |
| `IconBox` | Icon in a styled square container |
| `ProcessStep` | Numbered step with icon + title + body |
| `FAQAccordion` | Expandable FAQ section |
| `CheckList` | Bulleted list with checkmark icons |
| `CardTitle` | Card heading typography |
| `Body` | Body text typography |
| `Badge` | Status/category badge |
| `TestimonialCard` | Customer review/quote card |
| `Marquee` | Infinite scroll marquee |

### Other components

| Component | Import | Usage |
|-----------|--------|-------|
| `QuoteButton` | `@/components/quote-flow` | Opens the quote/contact flow modal |
| `ServiceJsonLd` | `@/components/JsonLd` | Service structured data |
| `BreadcrumbJsonLd` | `@/components/JsonLd` | Breadcrumb structured data |

### Section themes
```tsx
<Section theme="dark">  {/* Default — dark background */}
<Section theme="light"> {/* Light background for contrast */}
```

Alternate dark/light sections for visual rhythm. Most pages follow:
`dark (hero) → dark → light → dark → dark (CTA)`

---

## 7. Page Section Patterns

### Hero (every page)
```tsx
<Section className="pt-32 md:pt-40">
  <GradientOrb />
  <GridPattern />
  <div className="text-center max-w-3xl mx-auto">
    <LiquidGlassPill>EYEBROW TEXT</LiquidGlassPill>
    <AnimatedH1 className="mt-6">
      Primary Headline
    </AnimatedH1>
    <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
      Subheadline with value proposition.
    </p>
    <div className="mt-8 flex gap-4 justify-center">
      <QuoteButton label="Primary CTA" />
      <Link href="/path" className="...">Secondary CTA</Link>
    </div>
  </div>
</Section>
```

### Feature grid
```tsx
<Section>
  <SectionHeader eyebrow="FEATURES" title="What's Included" />
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((f) => (
      <LiquidGlassCard key={f.title}>
        <IconBox icon={f.icon} />
        <CardTitle>{f.title}</CardTitle>
        <Body>{f.body}</Body>
      </LiquidGlassCard>
    ))}
  </div>
</Section>
```

### Process steps
```tsx
<Section theme="light">
  <SectionHeader eyebrow="PROCESS" title="How It Works" theme="light" />
  <div className="space-y-8 max-w-2xl mx-auto">
    {steps.map((step, i) => (
      <ProcessStep key={i} number={i + 1} title={step.title} icon={step.icon}>
        {step.body}
      </ProcessStep>
    ))}
  </div>
</Section>
```

### Pricing tiers
```tsx
<Section>
  <SectionHeader eyebrow="PRICING" title="Simple, Transparent Pricing" />
  <div className="grid md:grid-cols-3 gap-6">
    {tiers.map((tier) => (
      <LiquidGlassCard key={tier.name} className={tier.highlight ? "border-seed-500/30" : ""}>
        {/* tier content */}
      </LiquidGlassCard>
    ))}
  </div>
</Section>
```

### FAQ
```tsx
<Section>
  <SectionHeader eyebrow="FAQ" title="Common Questions" />
  <FAQAccordion items={faqs} />
</Section>
```

### CTA (every page, at the bottom)
```tsx
<Section>
  <CTABanner
    headline="Ready to Get Started?"
    body="Brief supporting copy."
    primaryCta={{ label: "Start Now", href: "/contact" }}
    secondaryCta={{ label: "Learn More", href: "/about" }}
  />
</Section>
```

---

## 8. Structured Data (JSON-LD)

Every page should include appropriate JSON-LD. Common types:

| Page type | JSON-LD type | Component |
|-----------|-------------|-----------|
| Service pages | `Service` | `<ServiceJsonLd />` |
| Industry pages | `Service` (with industry focus) | `<ServiceJsonLd />` |
| Blog posts | `Article` | Handled by blog template |
| Homepage | `Organization` | In layout |
| All pages | `BreadcrumbList` | `<BreadcrumbJsonLd />` |

```tsx
<ServiceJsonLd
  name="Managed IT Services"
  description="Proactive managed IT with unlimited help desk..."
  url="https://seedtechllc.com/services/managed-it"
/>
<BreadcrumbJsonLd items={[
  { name: "Home", url: "https://seedtechllc.com" },
  { name: "Services", url: "https://seedtechllc.com/services" },
  { name: "Managed IT", url: "https://seedtechllc.com/services/managed-it" },
]} />
```

---

## 9. New Page Checklist

Use this checklist when creating any new page:

### Before building
- [ ] Determine the page type (service / industry / page / landing)
- [ ] Identify the primary keyword(s) this page should target
- [ ] Write the page context description (2-4 sentences)
- [ ] Determine the URL path and confirm it fits the site architecture

### During build
- [ ] Create `page.tsx` with correct file path
- [ ] Export static `metadata` object with title, description, OG, canonical
- [ ] Add `ServiceJsonLd` or appropriate JSON-LD
- [ ] Add `BreadcrumbJsonLd` with full breadcrumb trail
- [ ] Follow hero → content sections → CTA pattern
- [ ] Use design kit components (Section, SectionHeader, LiquidGlassCard, etc.)
- [ ] Alternate section themes for visual rhythm
- [ ] Include at least one CTA (QuoteButton or CTABanner)
- [ ] Keep data co-located in the page file (features, steps, tiers, FAQs)

### After build
- [ ] Add path to `STATIC_ROUTES` in all 3 route files (if permanent page)
- [ ] Go to Admin → AI Context → Page Context Map → add/generate context for the page
- [ ] Optionally add tracked keywords with this page as the target
- [ ] Use AI Context Preview to verify the prompt looks correct
- [ ] Generate metadata via Admin → Metadata tab (single or bulk)
- [ ] Verify the page appears correctly in the metadata table

### Content quality
- [ ] Hero has a clear headline + subhead + CTA
- [ ] Each section has a clear purpose (don't pad with filler sections)
- [ ] Copy is specific to this page's topic (not generic business copy)
- [ ] No marketing fluff: avoid "top-notch", "cutting-edge", "premier", "elevate"
- [ ] Page is differentiated from similar pages (e.g., managed IT vs. web dev)
- [ ] Mobile-responsive (Section + grid components handle this by default)

---

## 10. Industry Page Pattern

Industry pages have a specific pattern — they adapt the core services to a vertical:

```
Hero: Industry-specific headline + stats bar
Section 1: Industry pain points / challenges
Section 2: How SeedTech addresses them (feature grid with industry context)
Section 3: Process (how we work with {industry} companies)
Section 4: Services breakdown (IT + Web + SEO as they apply to this vertical)
Section 5: Social proof (if available)
CTA: Industry-specific CTA
```

**Key rule:** Industry pages must NOT just repeat the generic service descriptions.
They should reframe every feature through the lens of that specific industry.

---

## 11. Service Page Pattern

```
Hero: Service headline + key value prop + CTA
Section 1: What the service is (overview)
Section 2: Feature grid (what's included)
Section 3: How it works (process steps)
Section 4: Tech stack or tools (if applicable)
Section 5: Pricing tiers (if applicable)
Section 6: FAQ
CTA: Service-specific CTA
```

---

## 12. Writing Guidelines

### Tone
- Professional but approachable
- Technical but clear
- Direct — say what you mean in fewer words
- No corporate jargon or marketing-speak

### Banned phrases
These are explicitly banned in both human-written and AI-generated copy:
- "top-notch", "cutting-edge", "premier", "best-in-class"
- "elevate", "leverage", "synergy", "innovative"
- "one-stop shop", "peace of mind" (overused)
- "In today's digital landscape..." (every AI starts with this)

### Preferred voice
- ✅ "We monitor your systems 24/7 and fix issues before they disrupt your team."
- ❌ "Our cutting-edge monitoring solutions leverage innovative technology to elevate your IT infrastructure."
- ✅ "Per-user pricing. No contracts. Cancel anytime."
- ❌ "We offer best-in-class flexible pricing options designed to meet the unique needs of your growing business."
