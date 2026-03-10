# Component Generator Prompt

> Use this prompt to generate new reusable components for the project.

---

## Section Component Prompt

```
Create a new section component for a Next.js marketing website.

**Component Name:** [COMPONENT_NAME]
**Purpose:** [WHAT_IT_DOES]
**Content:** [WHAT_IT_DISPLAYS]

**Requirements:**

1. Create the file at `/components/sections/[ComponentName].tsx`
2. Use TypeScript with a clearly defined props interface
3. Provide sensible default prop values so it works out of the box
4. Wrap the content in the `<Section>` component from `@/components/ui/Section`
5. Include a centered headline + subheadline header
6. Use existing UI components from `@/components/ui/` (Button, Card, Container)
7. Style with TailwindCSS using project design tokens
8. Make it fully responsive (mobile → desktop)
9. Add a JSDoc comment explaining the component's purpose
10. Use `cn()` from `@/lib/utils` for conditional class merging

**Template:**

import React from "react";
import { Section } from "@/components/ui/Section";

interface [ComponentName]Props {
  headline?: string;
  subheadline?: string;
  background?: "white" | "light" | "dark" | "primary";
}

/**
 * [Component description]
 */
export function [ComponentName]({
  headline = "Default Headline",
  subheadline = "Default description.",
  background = "white",
}: [ComponentName]Props) {
  return (
    <Section background={background}>
      <div className="text-center mb-12">
        <h2 className="text-heading-xl font-bold text-neutral-900 mb-4">
          {headline}
        </h2>
        <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
          {subheadline}
        </p>
      </div>
      {/* Component content here */}
    </Section>
  );
}

Follow the coding rules in `ai/AI_DEV_RULES.md` and the UI rules in `ai/AI_UI_RULES.md`.
```

---

## UI Component Prompt

```
Create a new reusable UI component for a Next.js project.

**Component Name:** [COMPONENT_NAME]
**Purpose:** [WHAT_IT_DOES]
**Variants:** [LIST_OF_VARIANTS]

**Requirements:**

1. Create the file at `/components/ui/[ComponentName].tsx`
2. Use TypeScript with a defined props interface
3. Accept a `className` prop for external style overrides
4. Use `cn()` from `@/lib/utils` for class merging
5. Support multiple variants via a `variant` prop
6. Style with TailwindCSS using project design tokens
7. Keep it small, focused, and composable
8. Add a JSDoc comment

Follow the coding rules in `ai/AI_DEV_RULES.md`.
```

---

## Common Section Components to Generate

Use the section prompt above with these configurations:

| Component          | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `Testimonials`     | Customer testimonial cards with quotes     |
| `LogoBar`          | Trusted-by company logo strip              |
| `HowItWorks`      | 3-step process visualization               |
| `TeamGrid`         | Team member photo/bio cards                |
| `FAQ`              | Accordion-style frequently asked questions |
| `Stats`            | Key metric counters (500+ clients, etc.)   |
| `BlogPreview`      | Latest blog post cards                     |
| `Newsletter`       | Email signup form                          |
| `ContactForm`      | Full contact form with validation          |
| `ServiceCard`      | Individual service detail block            |
