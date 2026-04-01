/* ── Blog Post Data Model ──
 * Stored in Neon PostgreSQL via Prisma ORM.
 * Body content is Markdown.
 */

/** Resolved author entity for EEAT attribution */
export interface AuthorEntity {
  id: string;
  name: string;
  slug: string;
  jobTitle: string;
  bio: string;
  imageUrl: string | null;
  canonicalUrl: string;
  sameAs: string[];
  expertise: string[];
  credentials: string[];
  experience: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // Markdown content
  coverImage?: string;
  author: string;
  authorId: string | null;
  /** Resolved author entity (included when fetched with relation) */
  authorRef?: AuthorEntity | null;
  category: string;
  tags: string[];
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  structuredData: Record<string, unknown> | null;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null; // ISO date string
  scheduledAt: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export type BlogPostCreate = Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "wordCount">;
export type BlogPostUpdate = Partial<BlogPostCreate>;
