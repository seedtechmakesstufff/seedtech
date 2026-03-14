# SeedTech Animation System

> Last updated: March 2026

---

## Easing Constants

All animations use a single easing curve for consistency:

```ts
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
// cubic-bezier(0.16, 1, 0.3, 1) — "expo out"
// Fast initial movement, strong deceleration. Feels snappy and premium.
// Same curve used by Turbine.studio and Apple's system animations.
```

Never use `ease-in-out` or the default spring for text reveals — it reads as sluggish.

---

## Text Reveal — Word-by-Word

**Component:** `SplitTextReveal` (`src/components/kit/SplitTextReveal.tsx`)

**Effect:** Each word animates independently from:
- `translateY: 110%` → `translateY: 0` (slides up through a clipping mask)
- `opacity: 0` → `opacity: 1`
- `filter: blur(28px)` → `filter: blur(0px)` (focus-in / materialize)

**Key technique:** Each word is wrapped in `overflow-hidden inline-block`. This creates a clipping mask so the word slides up from below the text baseline — not floating in open space. Without this, it's just a standard fade-up and loses the "emerging" feel.

**Timing:**

| Use case | `delay` | `stagger` | `duration` |
|---|---|---|---|
| Hero h1 (on mount) | `0.25s` | `0.07s` | `0.7s` |
| Page hero h1 (AnimatedH1) | `0.15s` | `0.07s` | `0.7s` |
| Section h2 (SectionHeader, on scroll) | `0s` | `0.055s` | `0.65s` |

**Props:**

```tsx
<SplitTextReveal
  text="Your headline text here"
  as="h1"                      // h1 | h2 | h3 | h4 | p | span
  mode="mount"                 // "mount" = fires once on load | "inView" = fires on scroll
  delay={0.15}                 // seconds before first word starts
  stagger={0.07}               // seconds between each word
  duration={0.7}               // seconds per word animation
  highlightWords={["Grows"]}   // words rendered with GradientText (brand gradient)
  className="..."
/>
```

**`mode="inView"` config:**
- Uses Framer Motion `whileInView` with `viewport={{ once: true, margin: "-60px" }}`
- `-60px` margin means the animation triggers 60px before the element reaches the viewport edge — feels natural, not delayed

---

## Convenience Wrappers

### `AnimatedH1`
**File:** `src/components/kit/AnimatedH1.tsx`

Drop-in for page hero `<h1>` tags. Fires on mount (page load). Uses `mode="mount"`, `delay=0.15`, `stagger=0.07`, `duration=0.7`.

```tsx
<AnimatedH1 highlightWords={["Grows"]}>
  Technology That Grows Your Business
</AnimatedH1>
```

Used on: all public page heroes — `/services`, `/about`, `/our-work`, `/pricing/*`, `/services/managed-it/*`, `/blog/[slug]`

### `SectionHeader` (h2)
**File:** `src/components/layout/SectionHeader.tsx`

All section-level `<h2>` headings across the site pass through this component, which internally uses `SplitTextReveal` with `mode="inView"`. Fires once per scroll-into-view.

`titleHighlight` words are automatically passed as `highlightWords` to `SplitTextReveal`.

```tsx
<SectionHeader
  eyebrow="What We Do"
  title="Three Pillars of"
  titleHighlight="Technology"   // → rendered with GradientText
  description="..."
/>
```

---

## Fade-Up (Non-Text Elements)

Used for pills, CTA rows, stat bars, and other block elements that should entrance without word-splitting.

**Pattern:**

```tsx
import { motion, type Transition } from "framer-motion";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EXPO_OUT } as Transition,
});

// Usage:
<motion.div {...fadeUp(0.1)}>...</motion.div>
```

**Hero entrance sequence (`HeroSection.tsx`):**

| Element | Delay |
|---|---|
| Service pills | `0.1s` |
| Headline words (×5 staggered) | `0.25s` → `~0.6s` |
| Subline paragraph | `0.7s` |
| CTA buttons row | `0.85s` |
| Stat bar | `1.0s` |

---

## Rules

1. **Never animate the same property twice.** If a word already moves on `y`, don't also add a `scale`. The blur + slide is sufficient.
2. **`overflow-hidden` is required** on the parent `<span>` for the word-reveal clip effect. Removing it turns the animation into a plain fade-up.
3. **`once: true` on all scroll-triggered animations.** Animations that replay every time the user scrolls back up feel cheap and distracting.
4. **Keep stagger ≤ 0.08s.** Higher values make longer headings feel broken — each word waits too long.
5. **Do not apply `SplitTextReveal` to:** admin UI, modals, quote flow steps, or any text that updates dynamically (e.g. error messages, live form labels). Animation should only apply to static marketing copy.
6. **Blur start value is `28px`** (boosted from the Turbine default of `8px`) for a more dramatic materialize effect on dark backgrounds.
