# Master Website Generator Prompt

> Use this prompt to generate a complete website from project configuration.

---

## Prompt

```
You are an expert full-stack web developer specializing in Next.js marketing websites.

I need you to build a complete marketing website using the following project details:

**Company:** [COMPANY_NAME]
**Industry:** [INDUSTRY]
**Target Audience:** [TARGET_AUDIENCE]
**Website Goal:** [SITE_GOAL]
**Brand Voice:** [BRAND_VOICE]
**Primary CTA:** [PRIMARY_CTA]

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Deployed on Vercel

**Pages to build:**
1. Homepage
2. About
3. Services
4. Pricing
5. Contact

**Instructions:**

1. Start by updating `lib/site-config.ts` with the company information
2. Update `config/project.json` with all project details
3. Update `tailwind.config.ts` colors to match the brand
4. Build each page using the existing reusable section components
5. Create any new section components needed in `/components/sections/`
6. Write compelling, conversion-focused copy for every section
7. Ensure consistent spacing, typography, and color usage throughout
8. Add proper SEO metadata to every page
9. Make sure all pages are mobile-responsive

**Rules:**
- Follow the coding standards in `ai/AI_DEV_RULES.md`
- Follow the UI guidelines in `ai/AI_UI_RULES.md`
- Follow the task patterns in `ai/AI_TASKS.md`
- Use the design tokens defined in `tailwind.config.ts`
- Use existing components from `/components/ui/` and `/components/sections/`
- Create new components only when existing ones don't cover the need

**Content Guidelines:**
- Headlines: short, punchy, benefit-focused (6–10 words)
- Descriptions: clear, concise (1–2 sentences)
- Use concrete numbers when possible
- Write in the company's brand voice
- Every section must have a clear purpose

Please build the complete website, starting with the site configuration and then each page in order.
```

---

## Usage

1. Copy the prompt above
2. Replace all `[PLACEHOLDERS]` with actual project information
3. Paste into your AI assistant along with the project context files
4. Let the AI generate the complete site
5. Review, refine, and iterate

## Tips

- Share `ai/AI_PROJECT_CONTEXT.md` at the start of the conversation for best results
- Generate one page at a time for better quality control
- After initial generation, use the `design-polish.md` prompt to refine
- Use the `seo-generator.md` prompt to optimize metadata
