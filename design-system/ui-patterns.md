# UI Patterns

How pages and sections are composed from the component library.

## Section Structure

Every content section uses the `<Section>` + `<SectionHeader>` primitives:

```tsx
import { Section } from "@/components/layout/Section"
import { SectionHeader } from "@/components/layout/SectionHeader"

<Section>
  <SectionHeader
    eyebrow="Label"
    title="Main Heading"
    titleHighlight="Highlighted Word"
    description="Supporting sentence."
  />
  {/* cards, grid, etc. */}
</Section>
```

`<Section>` props: `theme` (`dark` | `light`), `className`
`<SectionHeader>` props: `eyebrow`, `title`, `titleHighlight`, `description`, `align` (`center` | `left`), `theme`

## Background Rhythm

Alternate dark/light sections for visual separation:

```
Hero             → dark (bg-dark-base)
Features         → dark
How It Works     → light
Testimonials     → dark
Pricing          → light
CTA Banner       → dark (with glow)
Footer           → dark-raised
```

## Cards

| Component       | Use case                              |
| --------------- | ------------------------------------- |
| `<GlassCard>`   | Feature cards, service cards          |
| `<ElevatedCard>` | Pricing tiers                        |
| `<ElevatedCard highlight>` | Featured / popular tier   |

```tsx
import { GlassCard, ElevatedCard } from "@/components/kit"

<GlassCard theme="dark">...</GlassCard>
<ElevatedCard highlight>...</ElevatedCard>
```

Standard card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

## Buttons

```tsx
import { Button } from "@/components/kit"

// Primary CTA
<Button variant="primary" size="lg" icon="arrow" href="/contact">
  Get a Free Quote
</Button>

// Secondary / ghost
<Button variant="ghost" size="lg" href="/services">
  Explore Services
</Button>
```

Side-by-side CTA pair: `flex flex-col sm:flex-row gap-4`

| Variant      | Use                              |
| ------------ | -------------------------------- |
| `primary`    | Main CTA — one per section       |
| `secondary`  | Supporting action                |
| `ghost`      | Tertiary / nav links             |
| `outline`    | On dark, bordered                |
| `glow-blue`  | IT service accent                |
| `glow-cyan`  | Marketing accent                 |

## Shadows & Glows

| Token                | Use                               |
| -------------------- | --------------------------------- |
| `shadow-glowSeed`    | Primary button hover, icon boxes  |
| `shadow-glowSeedLg`  | Hero elements, featured cards     |
| `shadow-glowBlue`    | IT service elements               |
| `shadow-glowCyan`    | Marketing elements                |
| `shadow-cardDark`    | Cards on dark backgrounds         |
| `shadow-cardLight`   | Cards on light backgrounds        |
| `shadow-pricingHighlight` | Featured pricing card        |

## Background Effects

Decorative elements — always `absolute`, `pointer-events-none`, inside `relative overflow-hidden` parent:

```tsx
import { GradientOrb, FloatingOrb, GridPattern, DotPattern, AmbientGlow } from "@/components/kit"

<section className="relative overflow-hidden">
  <GradientOrb color="seed" size="xl" className="top-0 left-1/4 opacity-25" />
  <GridPattern />
  {/* content */}
</section>
```

| Component       | Description                           |
| --------------- | ------------------------------------- |
| `GradientOrb`   | Static blurred color orb              |
| `FloatingOrb`   | Animated (float keyframe)             |
| `GridPattern`   | Subtle grid overlay                   |
| `DotPattern`    | Dot matrix overlay                    |
| `AmbientGlow`   | Full-section pulse glow               |
| `GradientOverlay` | Top/bottom fade to bg color         |

## Typography in Sections

```tsx
// Section eyebrow
<Eyebrow>Why SeedTech</Eyebrow>

// Section headline with gradient highlight
<HeadingLg>
  Your <GradientText>All-in-One</GradientText> Technology Partner
</HeadingLg>

// Body
<BodyLg className="text-light-base/60 max-w-2xl mx-auto">
  Supporting description text here.
</BodyLg>
```

## Navbar

`src/components/layout/Navbar.tsx` — sticky, glass blur, client component.

- Logo: gradient `S` icon + "SeedTech" wordmark
- Desktop: nav links with Services dropdown (Managed IT, Web Dev, Marketing)
- Mobile: hamburger → full-screen slide menu
- CTA: "Get a Quote" → `/contact`

## Footer

`src/components/layout/Footer.tsx` — 4 columns: Brand + socials, Services, Company, Contact info. Gradient divider above copyright row.

## Process Steps

```tsx
import { ProcessStep } from "@/components/kit"

<ProcessStep step="01" title="Discovery" description="We audit your current setup." />
```

## Checklists & Results

```tsx
import { CheckList, ResultList } from "@/components/kit"

<CheckList items={["Item one", "Item two"]} columns={2} />
<ResultList items={["40% fewer tickets", "99.9% uptime"]} />
```

## CTA Banner

Full-width section with ambient glow — use at the bottom of each page:

```tsx
import { CTABanner } from "@/components/kit"

<CTABanner
  title="Ready to Transform Your IT?"
  description="Schedule a free consultation."
  primaryLabel="Get a Free Quote"
  primaryHref="/contact"
  secondaryLabel="View Our Work"
  secondaryHref="/our-work"
/>
```
