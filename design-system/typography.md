# Typography

All tokens live in `tailwind.config.ts` under `theme.extend.fontSize` and `theme.extend.fontFamily`.

## Fonts

| Role      | Font           | CSS Variable              | Tailwind Class   |
| --------- | -------------- | ------------------------- | ---------------- |
| Headings  | League Gothic  | `--font-league-gothic`    | `font-display`   |
| Body      | Inter          | `--font-inter`            | `font-body`      |

Loaded via `next/font/google` in `src/app/layout.tsx`.

> **Note:** League Gothic is a condensed display typeface — it works best at large sizes (hero, section headings, stat callouts). Avoid using `font-display` at small sizes (`text-body-sm` or below).

## Type Scale

| Token          | Size      | Line Height | Letter Spacing | Usage                    |
| -------------- | --------- | ----------- | -------------- | ------------------------ |
| `text-display` | 4.5rem    | 1.05        | -0.03em        | Hero headlines           |
| `text-title`   | 3.5rem    | 1.1         | -0.02em        | Page titles              |
| `text-heading-lg` | 2.75rem | 1.15       | -0.02em        | Large section headings   |
| `text-heading` | 2.25rem   | 1.2         | -0.01em        | Section headings (h2)    |
| `text-subheading` | 1.5rem | 1.35        | -0.01em        | Sub-sections, card leads |
| `text-card-title` | 1.125rem | 1.4        | —              | Card headings            |
| `text-body-lg` | 1.125rem  | 1.65        | —              | Intro paragraphs         |
| `text-body`    | 1rem      | 1.6         | —              | Standard body            |
| `text-body-sm` | 0.875rem  | 1.55        | —              | Captions, meta           |
| `text-eyebrow` | 0.75rem   | 1.5         | +0.08em        | Section labels           |
| `text-stat-number` | 3.5rem | 1.1        | —              | Stat callouts            |
| `text-step-number` | 2.5rem | 1.15       | —              | Process step numbers     |

## Components

Each scale token maps to a component in `src/components/kit/Typography.tsx`:

`<Display>` `<Title>` `<HeadingLg>` `<Heading>` `<Subheading>` `<CardTitle>` `<BodyLg>` `<Body>` `<BodySm>` `<Eyebrow>` `<StatNumber>` `<StepNumber>` `<GradientText>`

## Rules

- One `<Display>` per page — hero only
- Headings use `font-display` (League Gothic)
- Body uses `font-body` (Inter)
- Eyebrow labels: uppercase, tracked, `text-seed-400` on dark / `text-seed-600` on light
- Gradient text: wrap in `<GradientText>` or use `.text-gradient-brand` utility class
- Max line length for body: `max-w-2xl` (672px)
