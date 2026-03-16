/* ── JSON-LD Structured Data ──
 * Reusable component that auto-generates structured data
 * for: LocalBusiness, Service, FAQ, Article, BreadcrumbList
 */

import { type ReactElement } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";
const BUSINESS_NAME = "SeedTech LLC";
const LOGO_URL = `${SITE_URL}/images/seedtech.png`;

/* ── Schema Types ── */

interface LocalBusinessSchema {
  type: "LocalBusiness";
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  areaServed?: string[];
}

interface ServiceSchema {
  type: "Service";
  name: string;
  description: string;
  url?: string;
  provider?: string;
  areaServed?: string[];
}

interface FAQSchema {
  type: "FAQ";
  questions: { question: string; answer: string }[];
}

interface ArticleSchema {
  type: "Article";
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

interface BreadcrumbSchema {
  type: "Breadcrumb";
  items: { name: string; url: string }[];
}

type SchemaProps =
  | LocalBusinessSchema
  | ServiceSchema
  | FAQSchema
  | ArticleSchema
  | BreadcrumbSchema;

/* ── Builders ── */

function buildLocalBusiness(props: LocalBusinessSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: props.name || BUSINESS_NAME,
    description:
      props.description ||
      "SeedTech provides managed IT services, cybersecurity solutions, and web development for small and mid-size businesses.",
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: props.phone || "",
    email: props.email || "support@seedtechllc.com",
    areaServed: (props.areaServed || ["United States"]).map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    sameAs: [],
    priceRange: "$$",
    "@id": `${SITE_URL}/#organization`,
  };
}

function buildService(props: ServiceSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: props.name,
    description: props.description,
    url: props.url || SITE_URL,
    provider: {
      "@type": "Organization",
      name: props.provider || BUSINESS_NAME,
      url: SITE_URL,
    },
    areaServed: (props.areaServed || ["United States"]).map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };
}

function buildFAQ(props: FAQSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: props.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

function buildArticle(props: ArticleSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.title,
    description: props.description,
    author: {
      "@type": "Organization",
      name: props.author || BUSINESS_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    image: props.image || LOGO_URL,
    url: props.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.url,
    },
  };
}

function buildBreadcrumb(props: BreadcrumbSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: props.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/* ── Component ── */

export function JsonLd(props: SchemaProps): ReactElement {
  let schema: Record<string, unknown>;

  switch (props.type) {
    case "LocalBusiness":
      schema = buildLocalBusiness(props);
      break;
    case "Service":
      schema = buildService(props);
      break;
    case "FAQ":
      schema = buildFAQ(props);
      break;
    case "Article":
      schema = buildArticle(props);
      break;
    case "Breadcrumb":
      schema = buildBreadcrumb(props);
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ── Shortcut exports ── */

export function LocalBusinessJsonLd(
  props?: Omit<LocalBusinessSchema, "type">
): ReactElement {
  return <JsonLd type="LocalBusiness" {...props} />;
}

export function ServiceJsonLd(
  props: Omit<ServiceSchema, "type">
): ReactElement {
  return <JsonLd type="Service" {...props} />;
}

export function FAQJsonLd(
  props: Omit<FAQSchema, "type">
): ReactElement {
  return <JsonLd type="FAQ" {...props} />;
}

export function ArticleJsonLd(
  props: Omit<ArticleSchema, "type">
): ReactElement {
  return <JsonLd type="Article" {...props} />;
}

export function BreadcrumbJsonLd(
  props: Omit<BreadcrumbSchema, "type">
): ReactElement {
  return <JsonLd type="Breadcrumb" {...props} />;
}
