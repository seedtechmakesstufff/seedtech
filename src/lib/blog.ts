/* ── Blog Storage Layer ──
 * CRUD operations for blog posts using Prisma + Neon PostgreSQL.
 * All operations are site-scoped via siteId parameter.
 */

import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from "@/types/blog";

/** Count words in a markdown string */
function countWords(text: string): number {
  return text
    .replace(/[#*_\[\]()>`~-]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Map a Prisma record to our BlogPost interface */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAppPost(p: any): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    author: p.author,
    category: p.category,
    tags: p.tags,
    targetKeyword: p.targetKeyword,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    status: p.status,
    wordCount: p.wordCount,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    scheduledAt: p.scheduledAt ? new Date(p.scheduledAt).toISOString() : null,
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
  };
}

/** Get all blog posts (newest first) */
export async function getAllPosts(siteId = DEFAULT_SITE_ID): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(toAppPost);
}

/** Get published posts only */
export async function getPublishedPosts(siteId = DEFAULT_SITE_ID): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { siteId, status: "published" },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(toAppPost);
}

/** Get a single post by slug */
export async function getPostBySlug(slug: string, siteId = DEFAULT_SITE_ID): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { siteId_slug: { siteId, slug } },
  });
  return post ? toAppPost(post) : null;
}

/** Get a single post by ID */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return post ? toAppPost(post) : null;
}

/** Create a new blog post */
export async function createPost(data: BlogPostCreate, siteId = DEFAULT_SITE_ID): Promise<BlogPost> {
  const post = await prisma.blogPost.create({
    data: {
      siteId,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: data.body,
      author: data.author,
      category: data.category,
      tags: data.tags,
      targetKeyword: data.targetKeyword,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      status: data.status,
      wordCount: countWords(data.body),
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    },
  });
  return toAppPost(post);
}

/** Update an existing blog post */
export async function updatePost(id: string, data: BlogPostUpdate): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.body !== undefined && {
          body: data.body,
          wordCount: countWords(data.body),
        }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.targetKeyword !== undefined && { targetKeyword: data.targetKeyword }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.publishedAt !== undefined && {
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        }),
        ...(data.scheduledAt !== undefined && {
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        }),
      },
    });
    return toAppPost(post);
  } catch {
    return null;
  }
}

/** Delete a blog post */
export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

