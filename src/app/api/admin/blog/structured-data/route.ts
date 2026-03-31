/* ── Structured Data API ──
 * POST /api/admin/blog/structured-data
 * Regenerates JSON-LD structured data for one or all blog posts.
 *
 * Body: { postId?: string }
 *   - If postId provided → regenerate for that post
 *   - If omitted → regenerate for ALL posts
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { generateStructuredDataPayload, countWords } from "@/lib/structured-data";
import { getAuthorEntity } from "@/lib/seo-eeat";
import { loadSiteScoringConfig } from "@/lib/site-scoring-config";

export async function POST(request: Request) {
  try {
    const ctx = await requireSiteContext();
    if (ctx instanceof NextResponse) return ctx;
    const { siteId } = ctx as SiteContext;
    const body = await request.json().catch(() => ({}));
    const { postId } = body as { postId?: string };

    // Load site config for author resolution
    let siteConfig;
    try {
      siteConfig = await loadSiteScoringConfig(siteId);
    } catch {
      /* defaults */
    }

    // Find posts to process
    const where = postId
      ? { id: postId, siteId }
      : { siteId };

    const posts = await prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        author: true,
        category: true,
        tags: true,
        targetKeyword: true,
        metaTitle: true,
        metaDescription: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (posts.length === 0) {
      return NextResponse.json(
        { error: postId ? "Post not found" : "No posts found" },
        { status: 404 }
      );
    }

    let updated = 0;
    const errors: { id: string; error: string }[] = [];

    for (const post of posts) {
      try {
        const author = getAuthorEntity(post.author, siteConfig);
        const wordCount = countWords(post.body);

        const schemas = generateStructuredDataPayload({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          author: post.author,
          authorEntity: author,
          category: post.category,
          tags: post.tags,
          targetKeyword: post.targetKeyword,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          publishedAt: post.publishedAt?.toISOString() || null,
          updatedAt: post.updatedAt?.toISOString(),
          wordCount,
        });

        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            structuredData: JSON.parse(JSON.stringify({ schemas })),
          },
        });

        updated++;
      } catch (err) {
        errors.push({
          id: post.id,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      total: posts.length,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[structured-data] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
