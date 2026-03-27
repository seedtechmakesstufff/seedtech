/* ── JSON-LD Structured Data ──
 * Reusable component that auto-generates structured data
 * for: LocalBusiness, Organization, Service, FAQ, Article,
 *      BreadcrumbList, Person (E-E-A-T), HowTo, WebPage
 */

import { type ReactElement } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME || "";
const LOGO_URL = `${SITE_URL}/images/logo.png`;

/* ── Schema Types ── */

interface LocalBusinessSchema {
  type: "LocalBusiness";
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  areaServed?: string[];
}

interface OrganizationSchema {
  type: "Organization";
  name?: string;
  description?: string;
  foundingDate?: string;
  founders?: string[];
  sameAs?: string[];
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
  /** Full author entity for E-E-A-T */
  authorEntity?: {
    name: string;
    url?: string;
    jobTitle?: string;
    image?: string;
    sameAs?: string[];
    description?: string;
  };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  /** Speakable selector for AI Overview / voice search citation */
  speakable?: string[];
  /** Word count for content quality signal */
  wordCount?: number;
}

interface PersonSchema {
  type: "Person";
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  description?: string;
  sameAs?: string[];
  worksFor?: string;
  knowsAbout?: string[];
}

interface HowToSchema {
  type: "HowTo";
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string;
}

interface WebPageSchema {
  type: "WebPage";
  name: string;
  description: string;
  url: string;
  /** Speakable CSS selectors for AIO citation */
  speakable?: string[];
  isPartOf?: string;
  lastReviewed?: string;
}

interface BreadcrumbSchema {
  type: "Breadcrumb";
  items: { name: string; url: string }[];
}

type SchemaProps =
  | LocalBusinessSchema
  | OrganizationSchema
  | ServiceSchema
  | FAQSchema
  | ArticleSchema
  | PersonSchema
  | HowToSchema
  | WebPageSchema
  | BreadcrumbSchema;

/* ── Builders ── */

function buildLocalBusiness(props: LocalBusinessSchema) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: props.name || BUSINESS_NAME,
    description: props.description || "",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    image: LOGO_URL,
    telephone: props.phone || "",
    email: props.email || "",
    areaServed: (props.areaServed || []).map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    sameAs: [],
    priceRange: "$$",
    knowsAbout: [
      "Managed IT Services",
      "Cybersecurity",
      "Web Development",
      "Cloud Migration",
      "IT Support",
    ],
  };
}

function buildOrganization(props: OrganizationSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: props.name || BUSINESS_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    description: props.description,
    foundingDate: props.foundingDate,
    founder: props.founders?.map((name) => ({ "@type": "Person", name })),
    sameAs: props.sameAs || [],
    knowsAbout: [
      "Managed IT Services",
      "Cybersecurity",
      "Web Development",
      "Small Business IT Support",
    ],
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
  // E-E-A-T: Prefer full author entity, fall back to Organization
  const authorObj = props.authorEntity
    ? {
        "@type": "Person",
        name: props.authorEntity.name,
        url: props.authorEntity.url || `${SITE_URL}/about`,
        jobTitle: props.authorEntity.jobTitle,
        image: props.authorEntity.image,
        description: props.authorEntity.description,
        sameAs: props.authorEntity.sameAs || [],
        worksFor: {
          "@type": "Organization",
          name: BUSINESS_NAME,
          url: SITE_URL,
        },
      }
    : {
        "@type": "Organization",
        name: props.author || BUSINESS_NAME,
        url: SITE_URL,
      };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.title,
    description: props.description,
    author: authorObj,
    publisher: {
      "@type": "Organization",
      name: BUSINESS_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
      url: SITE_URL,
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    image: props.image || LOGO_URL,
    url: props.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": props.url },
    isAccessibleForFree: true,
  };

  if (props.wordCount) schema.wordCount = props.wordCount;

  // Speakable — helps Google AI Overview cite specific content
  if (props.speakable && props.speakable.length > 0) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: props.speakable,
    };
  }

  return schema;
}

function buildPerson(props: PersonSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: props.name,
    jobTitle: props.jobTitle,
    url: props.url || `${SITE_URL}/about`,
    image: props.image,
    description: props.description,
    sameAs: props.sameAs || [],
    worksFor: {
      "@type": "Organization",
      name: props.worksFor || BUSINESS_NAME,
      url: SITE_URL,
    },
    knowsAbout: props.knowsAbout || [],
  };
}

function buildHowTo(props: HowToSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: props.name,
    description: props.description,
    ...(props.totalTime ? { totalTime: props.totalTime } : {}),
    step: props.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: s.image } : {}),
    })),
  };
}

function buildWebPage(props: WebPageSchema) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: props.name,
    description: props.description,
    url: props.url.startsWith("http") ? props.url : `${SITE_URL}${props.url}`,
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: BUSINESS_NAME },
  };
  if (props.lastReviewed) schema.lastReviewed = props.lastReviewed;
  if (props.speakable && props.speakable.length > 0) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: props.speakable,
    };
  }
  return schema;
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
    case "Organization":
      schema = buildOrganization(props);
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
    case "Person":
      schema = buildPerson(props);
      break;
    case "HowTo":
      schema = buildHowTo(props);
      break;
    case "WebPage":
      schema = buildWebPage(props);
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

export function OrganizationJsonLd(
  props?: Omit<OrganizationSchema, "type">
): ReactElement {
  return <JsonLd type="Organization" {...(props || {})} />;
}

export function PersonJsonLd(
  props: Omit<PersonSchema, "type">
): ReactElement {
  return <JsonLd type="Person" {...props} />;
}

export function HowToJsonLd(
  props: Omit<HowToSchema, "type">
): ReactElement {
  return <JsonLd type="HowTo" {...props} />;
}

export function WebPageJsonLd(
  props: Omit<WebPageSchema, "type">
): ReactElement {
  return <JsonLd type="WebPage" {...props} />;
}
