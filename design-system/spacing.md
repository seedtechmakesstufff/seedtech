# Spacing

Standard Tailwind 4px base scale. Key values used across the project:

## Common Values

| Token | px   | Usage                                   |
| ----- | ---- | --------------------------------------- |
| `2`   | 8px  | Tight inline gaps                       |
| `3`   | 12px | Small padding, button vertical          |
| `4`   | 16px | Standard gap, icon padding              |
| `5`   | 20px | Medium spacing                          |
| `6`   | 24px | Card padding, grid gap (standard)       |
| `8`   | 32px | Card padding (spacious), grid gap (lg)  |
| `10`  | 40px | Section header margin                   |
| `12`  | 48px | Section header → content gap           |
| `16`  | 64px | Section padding (sm)                    |
| `20`  | 80px | Section padding (md)                    |
| `24`  | 96px | Section padding (default — `py-24`)     |
| `32`  | 128px | Section padding (hero — `py-32`)       |

## Sections

```tsx
<Section>           // py-24 (96px) — default
<Section>           // py-32 (128px) — hero / spacious
```

The `<Section>` component in `src/components/layout/Section.tsx` handles this automatically.

## Container

`max-w-6xl mx-auto px-6` on all sections (handled by `<Section>`).

## Component Patterns

**Cards** — `p-6` standard · `p-8` spacious · `gap-6` grid gap

**Section header** — eyebrow `mb-4` · header block `mb-16`

**Buttons** — `px-5 py-2.5` (md) · `px-8 py-4` (lg) · side-by-side gap: `gap-4`

**Navbar** — `py-4` · logo/links gap: `gap-8` · sticky with `top-0`

### Navigation

```
Nav height:    h-16 (64px)
Nav item gap:  gap-8
```

### Footer

```
Top padding:   py-12
Column gap:    gap-8
Bottom bar:    py-6
```

## Spacing Rules

1. **Use the scale** — never use arbitrary values like `mt-[13px]`
2. **Be consistent** — same component = same spacing everywhere
3. **Vertical rhythm** — use consistent section padding throughout a page
4. **Whitespace is good** — marketing sites need generous breathing room
5. **Mobile spacing** — reduce section padding on mobile if needed: `py-12 md:py-section`
