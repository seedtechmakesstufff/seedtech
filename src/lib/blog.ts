/* ── Blog Storage Layer ──
 * Reads/writes blog posts as JSON files in /content/blog/
 * Simple file-based persistence — no database needed for now.
 */

import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Ensure the blog directory exists */
async function ensureDir() {
  await fs.mkdir(BLOG_DIR, { recursive: true });
}

/** Count words in a markdown string */
function countWords(text: string): number {
  return text
    .replace(/[#*_\[\]()>`~-]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Get all blog posts */
export async function getAllPosts(): Promise<BlogPost[]> {
  await ensureDir();
  const files = await fs.readdir(BLOG_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const posts: BlogPost[] = [];
  for (const file of jsonFiles) {
    const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
    posts.push(JSON.parse(raw));
  }

  // Sort by creation date descending
  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return posts;
}

/** Get published posts only */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.status === "published");
}

/** Get a single post by slug */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Get a single post by ID */
export async function getPostById(id: string): Promise<BlogPost | null> {
  await ensureDir();
  const filePath = path.join(BLOG_DIR, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Create a new blog post */
export async function createPost(data: BlogPostCreate): Promise<BlogPost> {
  await ensureDir();
  const now = new Date().toISOString();
  const id = uuid();

  const post: BlogPost = {
    ...data,
    id,
    wordCount: countWords(data.body),
    createdAt: now,
    updatedAt: now,
  };

  await fs.writeFile(path.join(BLOG_DIR, `${id}.json`), JSON.stringify(post, null, 2));
  return post;
}

/** Update an existing blog post */
export async function updatePost(id: string, data: BlogPostUpdate): Promise<BlogPost | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  const updated: BlogPost = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    wordCount: data.body ? countWords(data.body) : existing.wordCount,
  };

  await fs.writeFile(path.join(BLOG_DIR, `${id}.json`), JSON.stringify(updated, null, 2));
  return updated;
}

/** Delete a blog post */
export async function deletePost(id: string): Promise<boolean> {
  try {
    await fs.unlink(path.join(BLOG_DIR, `${id}.json`));
    return true;
  } catch {
    return false;
  }
}
