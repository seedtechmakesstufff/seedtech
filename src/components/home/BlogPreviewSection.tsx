import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import { format } from "date-fns";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

/**
 * Server component — fetches the 3 most recent published blog posts
 * and renders them in a compact card grid on the homepage.
 * Falls back gracefully to an empty state if no posts exist yet.
 */
export async function BlogPreviewSection() {
  let posts: BlogPost[];
  try {
    posts = await getPublishedPosts();
  } catch {
    posts = [];
  }

  const latest = posts.slice(0, 3);

  return (
    <section data-section-theme="light" className="relative py-24 md:py-32 overflow-hidden bg-white">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-seed-600 text-eyebrow uppercase tracking-widest mb-3">
              Insights
            </p>
            <h2 className="font-display text-heading md:text-heading-lg text-gray-900 leading-[1.1]">
              From the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors group shrink-0"
          >
            View all posts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Posts grid or empty state */}
        {latest.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-200">
            <p className="text-gray-400 text-lg">
              New articles are on the way — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={cn(
                  "group relative flex flex-col rounded-2xl p-6",
                  "bg-gray-50 border border-gray-200",
                  "transition-all duration-300",
                  "hover:bg-white hover:border-gray-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
                )}
              >
                {/* Category pill */}
                <span className="self-start text-[10px] font-medium uppercase tracking-widest text-seed-600 bg-seed-500/10 rounded-full px-3 py-1">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-seed-600 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-3 text-xs text-gray-400">
                  <span>
                    {format(
                      new Date(post.publishedAt || post.createdAt),
                      "MMM d, yyyy"
                    )}
                  </span>
                  <span>·</span>
                  <span>{Math.ceil(post.wordCount / 200)} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
