/* ── Structured Data Generator ──
 *
 * Builds JSON-LD structured data for blog posts.
 * Generates: Article, FAQPage, BreadcrumbList, Speakable
 *
 * Can be called:
 *   - During batch blog generation (auto-populate structuredData)
 *   - From an API endpoint (regenerate for existing posts)
 *   - On save in the blog editor
 */

import type { AuthorEntity } from "@/lib/seo-eeat";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";
const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME || "";
const LOGO_URL = `${SITE_URL}/images/logo.png`;

/* ── Types ── */

export interface StructuredDataInput {
  title: string;
  slug: string;
  excerpt: string;
  body: string;           // Markdown content
  author: string;
  authorEntity?: AuthorEntity | null;
  category: string;
  tags: string[];
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string | null;
  updatedAt?: string;
  wordCount: number;
  coverImage?: string;
}

export interface GeneratedStructuredData {
  article: Record<string, unknown>;
  faqPage: Record<string, unknown> | null;   // null if no FAQ detected
  breadcrumb: Record<string, unknown>;
  speakable: string[];                        // CSS selectors for speakable content
}

/* ── Main Generator ── */

/**
 * Generate all structured data for a blog post.
 * Returns an object containing Article, optional FAQPage, and BreadcrumbList schemas.
 */
export function generateBlogStructuredData(
  input: StructuredDataInput
): GeneratedStructuredData {
  const postUrl = `${SITE_URL}/blog/${input.slug}`;

  // Build Article schema
  const article = buildArticleSchema(input, postUrl);

  // Extract FAQ from markdown and build FAQPage schema
  const faqs = extractFAQsFromMarkdown(input.body);
  const faqPage = faqs.length > 0 ? buildFAQPageSchema(faqs) : null;

  // Build BreadcrumbList
  const breadcrumb = buildBreadcrumbSchema(input.title, input.slug);

  // Determine speakable selectors
  const speakable = [
    "article > h1",         // Title
    "article > p:first-of-type",  // Citeable opening paragraph
    ".faq-section",         // FAQ section
  ];

  return { article, faqPage, breadcrumb, speakable };
}

/**
 * Generate a flat JSON-LD payload array for storing in the database.
 * This is the format saved to BlogPost.structuredData.
 */
export function generateStructuredDataPayload(
  input: StructuredDataInput
): Record<string, unknown>[] {
  const result = generateBlogStructuredData(input);
  const schemas: Record<string, unknown>[] = [result.article];

  if (result.faqPage) {
    schemas.push(result.faqPage);
  }

  schemas.push(result.breadcrumb);
  return schemas;
}

/* ── Schema Builders ── */

function buildArticleSchema(
  input: StructuredDataInput,
  postUrl: string
): Record<string, unknown> {
  // E-E-A-T: Prefer full author entity with Person schema
  const authorObj = input.authorEntity
    ? {
        "@type": "Person",
        name: input.authorEntity.name,
        url: input.authorEntity.url || `${SITE_URL}/about`,
        jobTitle: input.authorEntity.jobTitle || undefined,
        image: input.authorEntity.image || undefined,
        description: input.authorEntity.bio || undefined,
        sameAs: input.authorEntity.sameAs?.length
          ? input.authorEntity.sameAs
          : undefined,
        worksFor: {
          "@type": "Organization",
          name: BUSINESS_NAME,
          url: SITE_URL,
        },
        knowsAbout: input.authorEntity.expertise?.length
          ? input.authorEntity.expertise
          : undefined,
      }
    : {
        "@type": "Organization",
        name: input.author || BUSINESS_NAME,
        url: SITE_URL,
      };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.metaTitle || input.title,
    name: input.title,
    description: input.metaDescription || input.excerpt,
    author: authorObj,
    publisher: {
      "@type": "Organization",
      name: BUSINESS_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
      url: SITE_URL,
    },
    datePublished: input.publishedAt || new Date().toISOString(),
    dateModified: input.updatedAt || input.publishedAt || new Date().toISOString(),
    image: input.coverImage || LOGO_URL,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    isAccessibleForFree: true,
    wordCount: input.wordCount,
    articleSection: input.category,
    keywords: input.tags.join(", "),
    inLanguage: "en-US",
  };

  // Speakable — helps Google AI Overview cite specific content
  schema.speakable = {
    "@type": "SpeakableSpecification",
    cssSelector: [
      "article > h1",
      "article > p:first-of-type",
    ],
  };

  // About — link to the target keyword as a concept
  if (input.targetKeyword) {
    schema.about = {
      "@type": "Thing",
      name: input.targetKeyword,
    };
  }

  return schema;
}

function buildFAQPageSchema(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(
  title: string,
  slug: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL || "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };
}

/* ── FAQ Extraction from Markdown ── */

/**
 * Extract FAQ question/answer pairs from markdown content.
 * Looks for common patterns:
 *   - ### heading ending with ? followed by paragraph text
 *   - **Q: ...** followed by **A: ...**
 *   - FAQ section with question headings
 */
export function extractFAQsFromMarkdown(
  markdown: string
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = markdown.split("\n");

  let inFAQSection = false;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect FAQ section heading
    if (/^#{1,3}\s+.*(faq|frequently\s+asked|common\s+questions)/i.test(line)) {
      inFAQSection = true;
      continue;
    }

    // Detect end of FAQ section (a non-question heading of same or higher level)
    if (inFAQSection && /^#{1,2}\s+/.test(line) && !line.endsWith("?")) {
      // Flush last FAQ
      if (currentQuestion && currentAnswer.length) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      inFAQSection = false;
      currentQuestion = null;
      currentAnswer = [];
      continue;
    }

    // Question-format heading (### What is...?)
    const questionMatch = line.match(/^#{2,4}\s+(.+\?)\s*$/);
    if (questionMatch) {
      // Flush previous FAQ
      if (currentQuestion && currentAnswer.length) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      currentQuestion = questionMatch[1];
      currentAnswer = [];
      continue;
    }

    // **Q:** pattern
    const qPattern = line.match(/^\*\*Q:\s*(.+?)\*\*/);
    if (qPattern) {
      if (currentQuestion && currentAnswer.length) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      currentQuestion = qPattern[1].replace(/\?$/, "") + "?";
      currentAnswer = [];
      continue;
    }

    // **A:** pattern
    const aPattern = line.match(/^\*\*A:\s*\*\*\s*(.+)/);
    if (aPattern && currentQuestion) {
      currentAnswer.push(aPattern[1]);
      continue;
    }

    // Collect answer lines (non-empty lines after a question)
    if (currentQuestion && line && !line.startsWith("#")) {
      // Skip markdown formatting markers
      const cleanLine = line
        .replace(/^\*\*A:\*\*\s*/, "")
        .replace(/^>\s*/, "");
      if (cleanLine) {
        currentAnswer.push(cleanLine);
      }
    }
  }

  // Flush the last FAQ
  if (currentQuestion && currentAnswer.length) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswer.join(" ").trim(),
    });
  }

  // Only return FAQs where we have a proper question (ends with ?) and a meaningful answer
  return faqs
    .filter((faq) => faq.question.endsWith("?") && faq.answer.length > 20)
    .slice(0, 10); // Google supports up to 10 FAQs
}

/* ── Utility: Count words ── */

export function countWords(text: string): number {
  return text
    .replace(/[#*_\-|`>[\]()]/g, " ")  // Strip markdown
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}
