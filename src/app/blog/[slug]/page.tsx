import { getPublishedPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") return notFound();

  return (
    <article className="min-h-screen bg-dark-base pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/30 mb-8">
          <Link href="/" className="hover:text-white/50 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white/50 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-white/50 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="text-seed-400 text-xs font-medium uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="font-display text-heading-lg text-white mt-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
            <span>By {post.author}</span>
            <span>·</span>
            <span>
              {format(new Date(post.publishedAt || post.createdAt), "MMMM d, yyyy")}
            </span>
            <span>·</span>
            <span>{Math.ceil(post.wordCount / 200)} min read</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border border-white/[0.08] text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:tracking-wide prose-a:text-seed-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white/80 prose-p:text-white/60 prose-li:text-white/60 prose-code:bg-dark-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-seed-400 prose-pre:bg-dark-elevated prose-pre:border prose-pre:border-white/[0.06]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-dark-elevated border border-white/[0.06] rounded-xl text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Need IT Support for Your Business?
          </h3>
          <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
            SeedTech provides proactive managed IT services, web development, and
            digital marketing for businesses in Northern New Jersey.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/pricing/it-support"
              className="bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              View Pricing
            </Link>
            <Link
              href="/contact"
              className="border border-white/[0.08] text-white/60 hover:text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
