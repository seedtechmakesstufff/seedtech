# Colors

All tokens live in `tailwind.config.ts` under `theme.extend.colors`.

## Dark Surfaces

| Token             | Hex         | Usage                        |
| ----------------- | ----------- | ---------------------------- |
| `dark-base`       | `#0a0a0f`   | Page background              |
| `dark-raised`     | `#0c0c14`   | Subtle surface raise         |
| `dark-elevated`   | `#14141f`   | Cards, panels                |
| `dark-overlay`    | `#1a1a28`   | Modals, dropdowns, inputs    |

## Light Surfaces

| Token          | Hex         | Usage                        |
| -------------- | ----------- | ---------------------------- |
| `light-base`   | `#f8f8fa`   | Light section backgrounds    |
| `light-raised` | `#ffffff`   | Cards on light sections      |

## Seed (Brand Green)

Primary brand color. `seed-500` / `seed` (DEFAULT) is the base.

| Token        | Hex         |
| ------------ | ----------- |
| `seed-50`    | `#edfff3`   |
| `seed-100`   | `#d5ffe4`   |
| `seed-200`   | `#aeffcb`   |
| `seed-300`   | `#6fffa4`   |
| `seed-400`   | `#40d97a`   |
| `seed-500`   | `#40A660`   |
| `seed-600`   | `#0f9c45`   |
| `seed-700`   | `#0f7a3a`   |
| `seed-800`   | `#116031`   |
| `seed-900`   | `#104f2a`   |
| `seed-950`   | `#022c15`   |

## Brand Accents

| Token             | Hex         | Usage                        |
| ----------------- | ----------- | ---------------------------- |
| `brand-blue`      | `#3b82f6`   | IT Services gradient, glows  |
| `brand-cyan`      | `#06b6d4`   | Accent, marketing gradient   |
| `brand-emerald`   | `#10b981`   | Success, gradient endpoints  |
| `brand-error`     | `#ef4444`   | Errors, destructive actions  |

## Gradients

Defined as `backgroundImage` tokens.

| Token                  | Value                                            | Usage                  |
| ---------------------- | ------------------------------------------------ | ---------------------- |
| `gradient-brand`       | `135deg, #0f9c45 → #10b981`                      | Buttons, icons         |
| `gradient-it`          | `135deg, #40A660 → #10b981`                      | IT service cards       |
| `gradient-web`         | `135deg, #3b82f6 → #06b6d4`                      | Web dev cards          |
| `gradient-marketing`   | `135deg, #06b6d4 → #10b981`                      | Marketing cards        |
| `gradient-brand-text`  | `135deg, #40d97a → #10b981 → #14b8a6`            | Gradient text spans    |
| `gradient-glow`        | Soft seed/emerald at 10% opacity                 | Ambient section glows  |

Use `text-gradient-brand` utility class (defined in `globals.css`) for gradient text.
