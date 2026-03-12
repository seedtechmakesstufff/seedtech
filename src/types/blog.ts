/* ── Blog Post Data Model ──
 * JSON file-based storage for blog posts.
 * Each post is stored as a JSON object in /content/blog/
 * with Markdown body content.
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // Markdown content
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null; // ISO date string
  scheduledAt: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export type BlogPostCreate = Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "wordCount">;
export type BlogPostUpdate = Partial<BlogPostCreate>;
