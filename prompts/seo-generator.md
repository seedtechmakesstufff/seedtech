# SEO Generator Prompt

> Use this prompt to generate comprehensive SEO metadata for every page.

---

## Page Metadata Prompt

```
Generate complete SEO metadata for the following page in a Next.js (App Router) project.

**Page:** [PAGE_NAME]
**URL:** [PAGE_URL]
**Company:** [COMPANY_NAME]
**Industry:** [INDUSTRY]
**Page Purpose:** [WHAT_THIS_PAGE_DOES]

Generate a Next.js metadata export with:

1. `title` — Compelling, keyword-rich (50-60 characters)
2. `description` — Clear value proposition (150-160 characters)
3. `openGraph` — Full Open Graph tags for social sharing
4. `twitter` — Twitter card metadata
5. `keywords` — Relevant keywords (optional, for reference)

**Format:**

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | Company Name",
  description: "A compelling description under 160 characters that includes primary keywords and a value proposition.",
  openGraph: {
    title: "Page Title | Company Name",
    description: "Description for social sharing.",
    url: "https://example.com/page",
    siteName: "Company Name",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Company Name — Page Title",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title | Company Name",
    description: "Description for Twitter.",
    images: ["/og-image.jpg"],
  },
};

**Rules:**
- Title should be unique per page
- Description must be compelling and include a call-to-action
- Include primary keyword in both title and description
- Keep title under 60 characters
- Keep description under 160 characters
- Use the company's brand voice
```

---

## Full Site SEO Audit Prompt

```
Perform an SEO audit on this Next.js website. Check every page for:

### Technical SEO
- [ ] Every page has a unique `<title>` tag via Metadata export
- [ ] Every page has a unique meta description
- [ ] Only one `<h1>` per page
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] All images have descriptive `alt` text
- [ ] All images use `next/image` for optimization
- [ ] Internal links use `next/link`
- [ ] Pages load fast (Server Components where possible)
- [ ] No broken links

### Content SEO
- [ ] Primary keyword appears in the page title
- [ ] Primary keyword appears in the h1
- [ ] Primary keyword appears in the meta description
- [ ] Content is original and valuable
- [ ] Pages have sufficient content length (300+ words for main pages)

### Structured Data (Optional)
- [ ] Organization schema on homepage
- [ ] LocalBusiness schema if applicable
- [ ] FAQ schema on FAQ sections
- [ ] BreadcrumbList schema for sub-pages

### Open Graph
- [ ] Every page has og:title, og:description, og:image
- [ ] OG images are 1200x630px
- [ ] Twitter card tags are present

Generate corrected metadata exports for any pages that need improvement.
```

---

## Sitemap Generation Prompt

```
Generate a `sitemap.ts` file for this Next.js App Router project.

Pages to include:
- / (homepage)
- /about
- /services
- /pricing
- /contact

Use the Next.js App Router sitemap convention:

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // ... more pages
  ];
}

Place the file at `app/sitemap.ts`.
```
