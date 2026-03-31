/* ── Blog Post Data Model ──
 * Stored in Neon PostgreSQL via Prisma ORM.
 * Body content is Markdown.
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // Markdown content
  coverImage?: string;
  author: string;
  authorId: string | null;
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
