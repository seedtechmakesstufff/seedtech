"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Eye,
  Trash2,
  Sparkles,
  Undo2,
} from "lucide-react";
import StructuredEditor from "@/components/structured-editor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");

  // AI Visibility rewrite state
  const [rewriteApplied, setRewriteApplied] = useState(false);
  const [rewriteMeta, setRewriteMeta] = useState<{
    oldScore: number; oldGrade: string; newScore: number; newGrade: string; fixedCount: number;
  } | null>(null);
  const [originalBody, setOriginalBody] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/blog/${postId}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt);
        setMetaTitle(data.metaTitle);
        setMetaDescription(data.metaDescription);
        setCategory(data.category);
        setStatus(data.status);

        // Check for pending AI Visibility rewrite
        const raw = sessionStorage.getItem("ai-rewrite");
        if (raw) {
          try {
            const rewrite = JSON.parse(raw);
            if (rewrite.postId === postId && rewrite.content) {
              setOriginalBody(data.body);
              setBody(rewrite.content);
              setRewriteApplied(true);
              setRewriteMeta({
                oldScore: rewrite.oldScore,
                oldGrade: rewrite.oldGrade,
                newScore: rewrite.newScore,
                newGrade: rewrite.newGrade,
                fixedCount: rewrite.fixedCount,
              });
              sessionStorage.removeItem("ai-rewrite");
            } else {
              setBody(data.body);
              sessionStorage.removeItem("ai-rewrite");
            }
          } catch {
            setBody(data.body);
            sessionStorage.removeItem("ai-rewrite");
          }
        } else {
          setBody(data.body);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          body,
          excerpt,
          metaTitle,
          metaDescription,
          category,
          status,
          publishedAt: status === "published" ? (post?.publishedAt || new Date().toISOString()) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to delete post");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/blog")}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* AI Visibility Rewrite Banner */}
      {rewriteApplied && rewriteMeta && (
        <div className="bg-seed-500/5 border border-seed-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-seed-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-seed-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  AI Visibility Rewrite Applied
                  <span className="text-xs font-mono text-green-400">
                    {rewriteMeta.oldScore} → {rewriteMeta.newScore} (+{rewriteMeta.newScore - rewriteMeta.oldScore} pts)
                  </span>
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {rewriteMeta.fixedCount} failed check{rewriteMeta.fixedCount !== 1 ? "s" : ""} fixed.
                  Review the content below, make any edits, then Save.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setBody(originalBody);
                setRewriteApplied(false);
                setRewriteMeta(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 text-xs font-medium transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />Undo Rewrite
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
              />
            </div>

            <StructuredEditor markdown={body} onChange={setBody} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "scheduled")}
              className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* SEO */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>

            <div>
              <label className="block text-xs text-white/40 mb-1">Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-white/20 font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 rounded bg-dark-base border border-white/[0.08] px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-seed-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1">
                Meta Title ({metaTitle.length}/60)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1">
                Meta Description ({metaDescription.length}/160)
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50"
              >
                <option value="IT Support">IT Support</option>
                <option value="Web Development">Web Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Business">Business</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>
          </div>

          {/* Preview Link */}
          {status === "published" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-dark-elevated border border-white/[0.06] rounded-xl p-4 text-sm text-white/50 hover:text-white hover:border-seed-500/20 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Published Post
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
