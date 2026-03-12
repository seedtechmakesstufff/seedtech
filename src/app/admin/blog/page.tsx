import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Eye,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  published: "bg-seed-500/20 text-seed-400",
  draft: "bg-yellow-500/20 text-yellow-400",
  scheduled: "bg-blue-500/20 text-blue-400",
};

export default async function BlogManagerPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Manager</h1>
          <p className="text-white/40 mt-1">Create, manage, and publish SEO-optimized blog content.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Blog Writer
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-white">{posts.length}</p>
          <p className="text-xs text-white/40 mt-1">Total Posts</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-seed-400">
            {posts.filter((p) => p.status === "published").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Published</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-yellow-400">
            {posts.filter((p) => p.status === "draft").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Drafts</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-blue-400">
            {posts.filter((p) => p.status === "scheduled").length}
          </p>
          <p className="text-xs text-white/40 mt-1">Scheduled</p>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-white/15 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/60 mb-2">No blog posts yet</h3>
          <p className="text-sm text-white/30 mb-6 max-w-md mx-auto">
            Use the AI Blog Writer to generate your first SEO-optimized post based on
            your keyword strategy.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Write Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Keyword</th>
                  <th className="px-5 py-3 font-medium">Words</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-white/80 font-medium">{post.title}</p>
                      <p className="text-xs text-white/30 font-mono mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">{post.targetKeyword}</td>
                    <td className="px-5 py-3 text-white/40 font-mono text-xs">{post.wordCount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-white/40 text-xs">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1 text-white/30 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="p-1 text-white/30 hover:text-white transition-colors"
                            title="View"
                            target="_blank"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
