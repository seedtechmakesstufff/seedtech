import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { AnimatedH1 } from "@/components/kit";
import { ArticleJsonLd, BreadcrumbJsonLd, PersonJsonLd } from "@/components/JsonLd";
import { getPageMetadataRecord, resolveOgImage } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  // Check for admin overrides in PageMetadata DB
  const dbMeta = await getPageMetadataRecord(`/blog/${params.slug}`);

  const title = dbMeta?.title || post.metaTitle || post.title;
  const description = dbMeta?.description || post.metaDescription || post.excerpt;
  const ogImage = await resolveOgImage(dbMeta?.ogImageUrl);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: dbMeta?.ogTitle || title,
      description: dbMeta?.ogDescription || description,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    ...(dbMeta?.noIndex || dbMeta?.noFollow
      ? { robots: { index: !dbMeta.noIndex, follow: !dbMeta.noFollow } }
      : {}),
  };
}

/* ── Custom Markdown Components ── */
const markdownComponents: Components = {
  // Convert internal links to Next.js <Link>
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className="text-seed-400 hover:underline transition-colors">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  // Wrap tables in a scrollable container with rounded border
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-dark-elevated">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-white/[0.06]">{children}</tbody>,
  tr: ({ children }) => (
    <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-white/50">{children}</td>
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") return notFound();

  const author = post.authorRef;

  return (
    <article className="min-h-screen bg-dark-base pt-32 pb-20 px-4">
      <ArticleJsonLd
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt || ""}
        datePublished={
          (post.publishedAt || post.createdAt).toString()
        }
        dateModified={post.updatedAt?.toString()}
        {...(author
          ? {
              authorEntity: {
                name: author.name,
                url: `https://seedtechllc.com${author.canonicalUrl}`,
                jobTitle: author.jobTitle,
                image: author.imageUrl
                  ? `https://seedtechllc.com${author.imageUrl}`
                  : undefined,
                description: author.bio,
                sameAs: author.sameAs,
              },
            }
          : { author: post.author })}
        url={`https://seedtechllc.com/blog/${post.slug}`}
        wordCount={post.wordCount}
      />
      {author && (
        <PersonJsonLd
          name={author.name}
          jobTitle={author.jobTitle}
          url={`https://seedtechllc.com${author.canonicalUrl}`}
          image={
            author.imageUrl
              ? `https://seedtechllc.com${author.imageUrl}`
              : undefined
          }
          description={author.bio}
          sameAs={author.sameAs}
          worksFor="SeedTech"
          knowsAbout={author.expertise}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
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
          <AnimatedH1 className="text-heading-lg mt-3 leading-tight">
            {post.title}
          </AnimatedH1>
          <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
            {author?.imageUrl ? (
              <Image
                src={author.imageUrl}
                alt={author.name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : null}
            <span>By {author?.name || post.author}</span>
            {author?.jobTitle && (
              <>
                <span>·</span>
                <span>{author.jobTitle}</span>
              </>
            )}
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
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:font-display prose-headings:tracking-wide
          prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
          prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/[0.06]
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-white/90
          prose-p:text-white/60 prose-p:leading-relaxed prose-p:mb-5
          prose-a:text-seed-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white/80 prose-strong:font-semibold
          prose-li:text-white/60 prose-li:leading-relaxed prose-li:my-1
          prose-ul:my-4 prose-ol:my-4
          prose-code:bg-dark-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-seed-400 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-dark-elevated prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-xl
          prose-blockquote:border-seed-500/40 prose-blockquote:bg-seed-500/[0.03] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-white/50
          prose-hr:border-white/[0.08] prose-hr:my-10
          prose-img:rounded-xl
          prose-table:border-collapse prose-table:overflow-hidden prose-table:rounded-lg
          prose-th:bg-dark-elevated prose-th:text-white/70 prose-th:text-sm prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-white/[0.08]
          prose-td:text-white/50 prose-td:text-sm prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-white/[0.06]
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.body}
          </ReactMarkdown>
        </div>

        {/* Author Bio Card — E-E-A-T */}
        {author && (
          <div className="mt-14 p-6 bg-dark-elevated border border-white/[0.06] rounded-xl flex gap-5 items-start">
            {author.imageUrl && (
              <Image
                src={author.imageUrl}
                alt={author.name}
                width={64}
                height={64}
                className="rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <p className="text-white font-semibold text-base">
                {author.name}
              </p>
              {author.jobTitle && (
                <p className="text-seed-400 text-sm mt-0.5">
                  {author.jobTitle}, SeedTech
                </p>
              )}
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                {author.bio}
              </p>
              {author.credentials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {author.credentials.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 rounded-full border border-seed-500/20 text-seed-400/80"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {author.sameAs.length > 0 && (
                <div className="flex gap-3 mt-3">
                  {author.sameAs.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      {url.includes("linkedin")
                        ? "LinkedIn"
                        : url.includes("github")
                          ? "GitHub"
                          : url.includes("twitter") || url.includes("x.com")
                            ? "X / Twitter"
                            : "Profile"}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
