import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getPublishedPosts } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";
import { AnimatedH2 } from "@/components/kit";

/**
 * Server component — fetches published posts and filters to category="SEO".
 * Renders 3 most recent in a dark-themed grid that matches the
 * /seo-for-restaurants page aesthetic.
 */
export async function SeoBlogSection() {
  let posts: BlogPost[];
  try {
    posts = await getPublishedPosts();
  } catch {
    posts = [];
  }

  const seoPosts = posts.filter((p) => p.category === "SEO").slice(0, 3);

  return (
    <section
      data-section-theme="dark"
      className="relative py-24 md:py-32 overflow-hidden bg-dark-base"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-seed-400 text-eyebrow uppercase tracking-widest mb-3">
              SEO Insights
            </p>
            <AnimatedH2
              highlightWords={["SEO"]}
              className="font-display text-heading md:text-heading-lg text-white leading-[1.1]"
            >
              From the SEO Playbook
            </AnimatedH2>
          </div>
          <Link
            href="/blog?category=SEO"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group shrink-0"
          >
            View all SEO posts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {seoPosts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-white/40 text-lg">
              New SEO articles are on the way — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {seoPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={cn(
                  "group relative flex flex-col rounded-2xl p-6",
                  "bg-white/[0.03] border border-white/[0.06]",
                  "transition-all duration-300",
                  "hover:bg-white/[0.05] hover:border-seed-500/30 hover:-translate-y-1"
                )}
              >
                <span className="self-start text-[10px] font-medium uppercase tracking-widest text-seed-400 bg-seed-500/10 rounded-full px-3 py-1">
                  {post.category}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-seed-300 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-3 text-xs text-white/30">
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
