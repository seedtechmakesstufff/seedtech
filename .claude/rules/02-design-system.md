---
globs:
  - "src/components/**"
  - "src/app/**/page.tsx"
---

# Design System — Soft UI Evolution

Style: premium, modern, not generic. Inspiration: huemor.rocks.

## Colors (from `tailwind.config.ts`)
- **Brand green (seed):** seed-500 `#40A660` (DEFAULT), full 50-950 palette
- **Dark surfaces:** dark-base `#0a0a0f`, dark-raised `#0c0c14`, dark-elevated `#14141f`, dark-overlay `#1a1a28`
- **Accents:** brand-blue `#3b82f6`, brand-cyan `#06b6d4`, brand-emerald `#10b981`
- **Gradients:** `gradient-brand` (seed→emerald), `gradient-web` (blue→cyan), `gradient-marketing` (cyan→emerald)
- Use `.text-gradient-brand` for gradient text spans

## Typography
- **Display:** League Gothic (`font-display`) — headings only, large sizes
- **Body:** Inter (`font-body`)
- Scale: `text-display` (4.5rem) → `text-title` → `text-heading-lg` → `text-heading` → `text-subheading` → `text-body-lg` → `text-body` → `text-body-sm` → `text-eyebrow`
- Typography components: `<Display>`, `<Title>`, `<Heading>`, `<Eyebrow>`, `<GradientText>`, etc. in `src/components/kit/Typography.tsx`
- One `<Display>` per page (hero only). Max body width: `max-w-2xl`

## Section Structure
```tsx
<Section theme="dark|light">
  <SectionHeader eyebrow="Label" title="Heading" titleHighlight="Word" description="..." />
  {/* content */}
</Section>
```
Alternate dark/light sections. Section padding: `py-24` default, `py-32` hero.

## Components (from `src/components/kit/`)
- **Cards:** `<GlassCard>` (features), `<ElevatedCard>` (pricing), `<LiquidGlassCard>` (interactive/nav)
- **Buttons:** variants: primary, secondary, ghost, outline, glow-blue, glow-cyan. One primary CTA per section.
- **Effects:** `<GradientOrb>`, `<FloatingOrb>`, `<GridPattern>`, `<AmbientGlow>` — always `absolute`, `pointer-events-none`
- **Process:** `<ProcessStep step="01" title="..." description="..." />`
- **CTA:** `<CTABanner>` at bottom of each page

## Animations
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out). Never `ease-in-out`.
- Text reveal: `<SplitTextReveal>` for headlines (word-by-word with blur). `<AnimatedH1>` for page heroes.
- `SectionHeader` auto-animates h2 on scroll (`mode="inView"`, `once: true`)
- Non-text: `fadeUp` pattern with Framer Motion. Stagger ≤ 0.08s.
- Never animate admin UI, modals, or dynamic content.

## Spacing
- Section: `py-24` (96px default), `py-32` (128px hero)
- Cards: `p-6` standard, `p-8` spacious, `gap-6` grid
- Container: `max-w-6xl mx-auto px-6` (handled by `<Section>`)
- Never use arbitrary values like `mt-[13px]` — use the Tailwind scale
