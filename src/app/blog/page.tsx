import { getPublishedPosts } from "@/lib/blog";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — SeedTech | IT Support & Web Development Insights",
  description:
    "Expert insights on managed IT services, cybersecurity, web development, and technology strategy for New Jersey businesses.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="min-h-screen bg-dark-base pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-seed-400 text-eyebrow uppercase tracking-widest mb-4">Blog</p>
          <h1 className="font-display text-title text-white">
            Insights & Resources
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto text-body-lg">
            Expert articles on managed IT, cybersecurity, web development, and growing your business with technology.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg">Coming soon — our first articles are on the way.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="relative group bg-dark-elevated border border-white/[0.06] rounded-xl p-6 hover:border-seed-500/20 transition-colors flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  {/* Category */}
                  <span className="text-xs text-seed-400 font-medium uppercase tracking-wider">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-white mt-1.5 group-hover:text-seed-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-white/40 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-4 text-xs text-white/30">
                    <span>{format(new Date(post.publishedAt || post.createdAt), "MMM d, yyyy")}</span>
                    <span>·</span>
                    <span>{Math.ceil(post.wordCount / 200)} min read</span>
                    <span>·</span>
                    <span>{post.tags?.[0]}</span>
                  </div>
                </div>

                <span className="hidden sm:block absolute bottom-4 right-5 text-seed-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
