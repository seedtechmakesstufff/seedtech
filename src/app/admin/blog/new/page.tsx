"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Check,
  Loader2,
  FileText,
  Target,
  Wand2,
  Pencil,
  Send,
  Eye,
  Calendar,
  Save,
  Brain,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Bot,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/* ── Wizard Steps ── */
const STEPS = [
  { id: 1, label: "Topic & Keyword", icon: Target },
  { id: 2, label: "AI Outline", icon: Wand2 },
  { id: 3, label: "AI Draft", icon: FileText },
  { id: 4, label: "Edit & Review", icon: Pencil },
  { id: 5, label: "Publish", icon: Send },
];

interface OutlineSection {
  heading: string;
  points: string[];
  estimatedWords: number;
}

interface Outline {
  title: string;
  slug: string;
  excerpt: string;
  sections: OutlineSection[];
  metaTitle: string;
  metaDescription: string;
  internalLinks: string[];
  category: string;
  tags: string[];
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // DB-loaded data (replaces static seo-strategy.ts imports)
  const [trackedKeywords, setTrackedKeywords] = useState<{ keyword: string; tier: string; volume: string; intent: string; targetPage: string }[]>([]);
  const [contentIdeas, setContentIdeas] = useState<{ id: string; title: string; targetKeyword: string; wordCount: number; funnelStage: string; status: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/seo/keywords").then((r) => r.json()).then((d) => { if (d.keywords) setTrackedKeywords(d.keywords); }).catch(() => {});
    fetch("/api/admin/seo/strategy").then((r) => r.json()).then((d) => { if (d.contentIdeas) setContentIdeas(d.contentIdeas); }).catch(() => {});
  }, []);

  // Step 1 — Topic & Keyword
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState(1500);

  // Step 2 — Outline
  const [outline, setOutline] = useState<Outline | null>(null);

  // Step 3/4 — Draft
  const [draft, setDraft] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [tags, setTags] = useState<string[]>([]);

  // Step 5 — Publish
  const [publishAction, setPublishAction] = useState<"draft" | "publish" | "schedule">("draft");
  const [scheduleDate, setScheduleDate] = useState("");

  // Author
  const [authors, setAuthors] = useState<{ id: string; name: string; jobTitle: string; isDefault: boolean }[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/authors").then((r) => r.json()).then((d) => {
      if (d.authors) {
        setAuthors(d.authors);
        const defaultAuthor = d.authors.find((a: { isDefault: boolean }) => a.isDefault);
        if (defaultAuthor) setSelectedAuthorId(defaultAuthor.id);
      }
    }).catch(() => {});
  }, []);

  // Content Scoring
  const [scoringLoading, setScoringLoading] = useState(false);
  const [contentScore, setContentScore] = useState<{
    overall: number;
    eeat: { score: number; issues: string[]; suggestions: string[] };
    aio: { overall: number; directAnswer: number; structuredContent: number; entityClarity: number; citability: number; issues: { check: string; passed: boolean; message: string; recommendation?: string }[] };
    aiVisibility: { overall: number; citationReadiness: number; entityAuthority: number; structuredClarity: number; conversationalFit: number; multiEngineCoverage: number; grade: string; gradeLabel: string; checks: { category: string; check: string; passed: boolean; weight: number; message: string; fix?: string }[] };
    recommendations: string[];
  } | null>(null);
  const [paaQuestions, setPaaQuestions] = useState<{ question: string; answer: string; snippetPotential: boolean }[]>([]);

  // Progress modal
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressTitle, setProgressTitle] = useState("");
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);

  interface ProgressStep {
    label: string;
    status: "pending" | "active" | "done";
    detail?: string;
  }

  function updateStep(index: number, updates: Partial<ProgressStep>) {
    setProgressSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }

  /* ── AI API Call Helper ── */
  async function callAI(payload: Record<string, unknown>) {
    const res = await fetch("/api/ai/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI generation failed");
    return data.result;
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /* ── Step Handlers ── */

  async function handleGenerateOutline() {
    setLoading(true);
    setError("");
    setProgressTitle("Generating Outline");
    setProgressSteps([
      { label: "Analyzing topic & target keyword", status: "active" },
      { label: "Researching SEO strategy context", status: "pending" },
      { label: "Generating structured outline with Claude", status: "pending" },
      { label: "Extracting metadata & internal links", status: "pending" },
    ]);
    setProgressOpen(true);

    try {
      // Simulate visible progress for each phase
      await sleep(600);
      updateStep(0, { status: "done", detail: `"${keyword}"` });
      updateStep(1, { status: "active" });

      await sleep(500);
      updateStep(1, { status: "done", detail: "Loaded tracked keywords & calendar" });
      updateStep(2, { status: "active" });

      const result = await callAI({
        step: "outline",
        topic,
        keyword,
        tone,
        wordCount,
      });

      updateStep(2, { status: "done", detail: "claude-opus-4-6" });
      updateStep(3, { status: "active" });

      if (typeof result === "object") {
        setOutline(result as Outline);
        setMetaTitle(result.metaTitle || "");
        setMetaDescription(result.metaDescription || "");
        setExcerpt(result.excerpt || "");
        setSlug(result.slug || "");
        setCategory(result.category || "IT Support");
        setTags(result.tags || []);
      }

      await sleep(400);
      updateStep(3, { status: "done", detail: `${(result as Outline)?.sections?.length || 0} sections` });

      await sleep(600);
      setProgressOpen(false);
      setStep(2);
    } catch (err: unknown) {
      setProgressOpen(false);
      setError(err instanceof Error ? err.message : "Outline generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateDraft() {
    setLoading(true);
    setError("");
    setProgressTitle("Writing Full Draft");
    setProgressSteps([
      { label: "Loading outline & SEO context", status: "active" },
      { label: "Generating blog content with Claude", status: "pending" },
      { label: "Formatting Markdown & internal links", status: "pending" },
      { label: "Counting words & finalizing", status: "pending" },
    ]);
    setProgressOpen(true);

    try {
      await sleep(500);
      updateStep(0, { status: "done", detail: `${outline?.sections?.length || 0} sections loaded` });
      updateStep(1, { status: "active", detail: "This may take 15-30 seconds…" });

      const result = await callAI({
        step: "draft",
        topic: outline?.title || topic,
        keyword,
        outline,
        tone,
        wordCount,
      });

      const draftText = typeof result === "string" ? result : JSON.stringify(result);
      const words = draftText.split(/\s+/).filter(Boolean).length;

      updateStep(1, { status: "done", detail: "claude-opus-4-6" });
      updateStep(2, { status: "active" });

      await sleep(400);
      updateStep(2, { status: "done", detail: "Links resolved" });
      updateStep(3, { status: "active" });

      setDraft(draftText);

      await sleep(400);
      updateStep(3, { status: "done", detail: `${words.toLocaleString()} words` });

      await sleep(600);
      setProgressOpen(false);
      setStep(3);
    } catch (err: unknown) {
      setProgressOpen(false);
      setError(err instanceof Error ? err.message : "Draft generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePost() {
    setLoading(true);
    setError("");
    try {
      const status =
        publishAction === "publish"
          ? "published"
          : publishAction === "schedule"
          ? "scheduled"
          : "draft";

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: outline?.title || topic,
          slug,
          excerpt,
          body: draft,
          author: authors.find((a) => a.id === selectedAuthorId)?.name || "Unknown",
          authorId: selectedAuthorId || undefined,
          category,
          tags,
          targetKeyword: keyword,
          metaTitle,
          metaDescription,
          status,
          publishedAt: status === "published" ? new Date().toISOString() : null,
          scheduledAt: status === "scheduled" ? new Date(scheduleDate).toISOString() : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setLoading(false);
    }
  }

  /* ── Content Scoring ── */

  async function handleScoreContent() {
    if (!draft) return;
    setScoringLoading(true);
    setError("");
    try {
      const result = await callAI({ step: "score", content: draft, keyword });
      setContentScore(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Content scoring failed");
    } finally {
      setScoringLoading(false);
    }
  }

  async function handleResearchPAA() {
    if (!keyword) return;
    setScoringLoading(true);
    setError("");
    try {
      const result = await callAI({ step: "paa", keyword });
      if (Array.isArray(result)) {
        setPaaQuestions(result);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PAA research failed");
    } finally {
      setScoringLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.push("/admin/blog"))}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-seed-400" />
            AI Blog Writer
          </h1>
          <p className="text-white/40 mt-0.5 text-sm">Step {step} of {STEPS.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, _i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full",
                step === s.id
                  ? "bg-seed-500/10 text-seed-400 border border-seed-500/30"
                  : step > s.id
                  ? "bg-seed-500/5 text-seed-500/60"
                  : "bg-dark-elevated text-white/20"
              )}
            >
              {step > s.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <s.icon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── STEP 1: Topic & Keyword ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Choose Your Topic</h2>

            {/* Quick picks from content calendar */}
            <div>
              <label className="block text-sm text-white/50 mb-3">Quick pick from content calendar:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {contentIdeas.filter((c) => c.status === "idea").map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => {
                      setTopic(idea.title);
                      setKeyword(idea.targetKeyword);
                      setWordCount(idea.wordCount);
                    }}
                    className={cn(
                      "text-left px-3 py-2 rounded-lg border text-xs transition-colors",
                      topic === idea.title
                        ? "border-seed-500/30 bg-seed-500/10 text-seed-400"
                        : "border-white/[0.06] text-white/50 hover:border-white/10 hover:text-white/70"
                    )}
                  >
                    <span className="font-medium">{idea.title}</span>
                    <span className="block text-white/30 mt-0.5">🎯 {idea.targetKeyword}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Or custom topic */}
            <div className="solid-divider" />

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Blog Topic / Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How Much Does Managed IT Cost in 2026?"
                className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Target Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. how much does managed IT cost"
                className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
              />
              {/* Keyword suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {trackedKeywords.filter((k) => k.tier === "tier3")
                  .slice(0, 6)
                  .map((k) => (
                    <button
                      key={k.keyword}
                      onClick={() => setKeyword(k.keyword)}
                      className="text-xs px-2 py-1 rounded-full border border-white/[0.08] text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
                    >
                      {k.keyword}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
                >
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Target Word Count</label>
                <input
                  type="number"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  min={500}
                  max={5000}
                  step={100}
                  className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateOutline}
              disabled={!topic || !keyword || loading}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate Outline
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: AI Outline ── */}
      {step === 2 && outline && (
        <div className="space-y-6">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-white">{outline.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-seed-500/10 text-seed-400 border border-seed-500/30">
                AI Generated
              </span>
            </div>

            <div className="text-sm text-white/40">
              <p><strong className="text-white/60">Slug:</strong> /blog/{outline.slug}</p>
              <p className="mt-1"><strong className="text-white/60">Excerpt:</strong> {outline.excerpt}</p>
              <p className="mt-1"><strong className="text-white/60">Category:</strong> {outline.category}</p>
            </div>

            <div className="solid-divider" />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Outline</h3>
              {outline.sections.map((section, i) => (
                <div key={i} className="bg-dark-base rounded-lg p-4 border border-white/[0.04]">
                  <h4 className="text-sm font-medium text-white/80">
                    <span className="text-white/30 mr-2">H2:</span>
                    {section.heading}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {section.points.map((point, j) => (
                      <li key={j} className="text-xs text-white/40 flex items-start gap-2">
                        <span className="text-white/20 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/20 mt-2">~{section.estimatedWords} words</p>
                </div>
              ))}
            </div>

            {outline.internalLinks && outline.internalLinks.length > 0 && (
              <>
                <div className="solid-divider" />
                <div>
                  <h3 className="text-sm font-semibold text-white/60 mb-2">Suggested Internal Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {outline.internalLinks.map((link) => (
                      <span key={link} className="text-xs px-2 py-1 rounded bg-dark-base text-white/40 font-mono">
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back to topic
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateOutline}
                disabled={loading}
                className="flex items-center gap-2 border border-white/[0.08] text-white/60 hover:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Regenerate
              </button>
              <button
                onClick={handleGenerateDraft}
                disabled={loading}
                className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Generate Full Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: AI Draft (read-only preview) ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">AI-Generated Draft</h2>
              <span className="text-xs text-white/30">
                {draft.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="bg-dark-base rounded-lg p-6 border border-white/[0.04] prose prose-invert prose-sm max-w-none max-h-[60vh] overflow-y-auto prose-headings:font-display prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/[0.06] prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-p:text-white/55 prose-p:leading-relaxed prose-a:text-seed-400 prose-strong:text-white/75 prose-li:text-white/55 prose-hr:border-white/[0.08] prose-hr:my-6 prose-table:text-xs prose-th:bg-dark-elevated prose-th:px-3 prose-th:py-2 prose-th:text-white/60 prose-th:border prose-th:border-white/[0.08] prose-td:px-3 prose-td:py-2 prose-td:text-white/45 prose-td:border prose-td:border-white/[0.06]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft}</ReactMarkdown>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back to outline
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateDraft}
                disabled={loading}
                className="flex items-center gap-2 border border-white/[0.08] text-white/60 hover:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Regenerate Draft
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit & Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Edit & Review ── */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main editor */}
            <div className="lg:col-span-2 bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Edit Content</h2>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1">Title</label>
                <input
                  type="text"
                  value={outline?.title || topic}
                  onChange={(e) => {
                    if (outline) setOutline({ ...outline, title: e.target.value });
                    else setTopic(e.target.value);
                  }}
                  className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1">
                  Body (Markdown) — {draft.split(/\s+/).filter(Boolean).length} words
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={25}
                  className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors resize-y"
                />
              </div>
            </div>

            {/* Sidebar — SEO metadata */}
            <div className="space-y-4">
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">SEO Metadata</h3>

                <div>
                  <label className="block text-xs text-white/40 mb-1">URL Slug</label>
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
                    Meta Title <span className="text-white/20">({metaTitle.length}/60)</span>
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
                    Meta Description <span className="text-white/20">({metaDescription.length}/160)</span>
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
              </div>

              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Categorization</h3>

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

                <div>
                  <label className="block text-xs text-white/40 mb-1">Target Keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    readOnly
                    className="w-full rounded bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white/50 font-mono"
                  />
                </div>
              </div>

              {/* Google Preview */}
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Google Preview</h3>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-blue-600 text-sm font-medium leading-tight truncate">
                    {metaTitle || "Page Title"}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5">
                    seedtechllc.com/blog/{slug || "..."}
                  </p>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {metaDescription || "Meta description will appear here..."}
                  </p>
                </div>
              </div>

              {/* ── AI Visibility & Content Score ── */}
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-seed-400" />
                    AI Visibility Score
                  </h3>
                  <button
                    onClick={handleScoreContent}
                    disabled={scoringLoading || !draft}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-seed-500/10 text-seed-400 hover:bg-seed-500/20 disabled:opacity-50 transition-colors"
                  >
                    {scoringLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
                    Score
                  </button>
                </div>

                {!contentScore && !scoringLoading && (
                  <p className="text-xs text-white/30 text-center py-3">
                    Click &ldquo;Score&rdquo; to analyze your content for AI citation readiness, E-E-A-T signals, and overall quality.
                  </p>
                )}

                {scoringLoading && !contentScore && (
                  <div className="flex items-center justify-center py-4 gap-2 text-xs text-white/40">
                    <Loader2 className="w-4 h-4 animate-spin text-seed-400" />
                    Analyzing content…
                  </div>
                )}

                {contentScore && (
                  <div className="space-y-4">
                    {/* AI Visibility Grade — THE primary metric */}
                    <div className="bg-dark-base rounded-lg p-3 border border-white/[0.04] text-center">
                      <div className={cn(
                        "text-3xl font-bold",
                        contentScore.aiVisibility.grade === "A" ? "text-green-400" :
                        contentScore.aiVisibility.grade === "B" ? "text-emerald-400" :
                        contentScore.aiVisibility.grade === "C" ? "text-yellow-400" :
                        contentScore.aiVisibility.grade === "D" ? "text-orange-400" : "text-red-400"
                      )}>
                        {contentScore.aiVisibility.grade}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">{contentScore.aiVisibility.gradeLabel}</div>
                    </div>

                    {/* Score gauges */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "AI Visibility", value: contentScore.aiVisibility.overall, color: contentScore.aiVisibility.overall >= 65 ? "text-green-400" : contentScore.aiVisibility.overall >= 45 ? "text-yellow-400" : "text-red-400" },
                        { label: "E-E-A-T", value: contentScore.eeat.score, color: contentScore.eeat.score >= 65 ? "text-green-400" : contentScore.eeat.score >= 45 ? "text-yellow-400" : "text-red-400" },
                        { label: "Citation", value: contentScore.aiVisibility.citationReadiness, color: contentScore.aiVisibility.citationReadiness >= 65 ? "text-green-400" : contentScore.aiVisibility.citationReadiness >= 45 ? "text-yellow-400" : "text-red-400" },
                      ].map((gauge) => (
                        <div key={gauge.label} className="bg-dark-base rounded-lg p-2.5 text-center border border-white/[0.04]">
                          <div className={cn("text-xl font-bold", gauge.color)}>
                            {gauge.value}
                          </div>
                          <div className="text-[10px] text-white/30 mt-0.5">{gauge.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-scores breakdown */}
                    <div className="space-y-1.5">
                      {[
                        { label: "Entity Authority", value: contentScore.aiVisibility.entityAuthority },
                        { label: "Structured Clarity", value: contentScore.aiVisibility.structuredClarity },
                        { label: "Conversational Fit", value: contentScore.aiVisibility.conversationalFit },
                        { label: "Multi-Engine", value: contentScore.aiVisibility.multiEngineCoverage },
                      ].map((sub) => (
                        <div key={sub.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 w-24 shrink-0">{sub.label}</span>
                          <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                sub.value >= 65 ? "bg-green-500" : sub.value >= 45 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: `${sub.value}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/40 w-6 text-right">{sub.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Citation Checks */}
                    <div>
                      <h4 className="text-xs font-medium text-white/50 mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> AI Citation Checks
                      </h4>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {contentScore.aiVisibility.checks
                          .sort((a, b) => b.weight - a.weight)
                          .map((check, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            {check.passed ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            )}
                            <span className={check.passed ? "text-white/40" : "text-white/60"}>
                              {check.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {contentScore.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-white/50 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Top Fixes
                        </h4>
                        <div className="space-y-1.5">
                          {contentScore.recommendations.map((rec, i) => (
                            <div key={i} className="text-xs text-yellow-400/80 bg-yellow-400/5 rounded px-2 py-1.5 border border-yellow-400/10">
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── People Also Ask Research ── */}
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-purple-400" />
                    People Also Ask
                  </h3>
                  <button
                    onClick={handleResearchPAA}
                    disabled={scoringLoading || !keyword}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 transition-colors"
                  >
                    {scoringLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Research
                  </button>
                </div>

                {paaQuestions.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-2">
                    Research PAA questions for &ldquo;{keyword}&rdquo; to improve AI Overview coverage.
                  </p>
                )}

                {paaQuestions.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {paaQuestions.map((paa, i) => (
                      <div key={i} className="bg-dark-base rounded-lg p-2.5 border border-white/[0.04]">
                        <p className="text-xs font-medium text-white/70">{paa.question}</p>
                        <p className="text-[10px] text-white/30 mt-1 line-clamp-2">{paa.answer}</p>
                        {paa.snippetPotential && (
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            Snippet potential
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back to draft
            </button>
            <button
              onClick={() => setStep(5)}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Review & Publish
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Publish ── */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Publish Options</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { value: "draft", label: "Save as Draft", desc: "Save for later editing", icon: Save },
                  { value: "publish", label: "Publish Now", desc: "Go live immediately", icon: Eye },
                  { value: "schedule", label: "Schedule", desc: "Set a future publish date", icon: Calendar },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPublishAction(option.value)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-colors",
                    publishAction === option.value
                      ? "border-seed-500/30 bg-seed-500/10"
                      : "border-white/[0.06] hover:border-white/10"
                  )}
                >
                  <option.icon
                    className={cn(
                      "w-5 h-5 mb-2",
                      publishAction === option.value ? "text-seed-400" : "text-white/30"
                    )}
                  />
                  <p className={cn("text-sm font-medium", publishAction === option.value ? "text-seed-400" : "text-white/60")}>
                    {option.label}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>

            {publishAction === "schedule" && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
                />
              </div>
            )}

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Author</label>
              {authors.length > 0 ? (
                <select
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors"
                >
                  <option value="">Select author…</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}{a.jobTitle ? ` — ${a.jobTitle}` : ""}{a.isDefault ? " (default)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-white/30">
                  No authors configured.{" "}
                  <a href="/admin/seo" className="text-seed-400 hover:underline">Add authors in SEO Settings →</a>
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="solid-divider" />

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-white">Summary</h3>
              <p className="text-white/50">
                <strong className="text-white/70">Title:</strong> {outline?.title || topic}
              </p>
              <p className="text-white/50">
                <strong className="text-white/70">URL:</strong> /blog/{slug}
              </p>
              <p className="text-white/50">
                <strong className="text-white/70">Keyword:</strong> {keyword}
              </p>
              <p className="text-white/50">
                <strong className="text-white/70">Word Count:</strong>{" "}
                {draft.split(/\s+/).filter(Boolean).length}
              </p>
              <p className="text-white/50">
                <strong className="text-white/70">Category:</strong> {category}
              </p>
              {selectedAuthorId && (
                <p className="text-white/50">
                  <strong className="text-white/70">Author:</strong>{" "}
                  {authors.find((a) => a.id === selectedAuthorId)?.name || "—"}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back to editor
            </button>
            <button
              onClick={handleSavePost}
              disabled={loading}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : publishAction === "publish" ? (
                <Eye className="w-4 h-4" />
              ) : publishAction === "schedule" ? (
                <Calendar className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {publishAction === "publish"
                ? "Publish Now"
                : publishAction === "schedule"
                ? "Schedule Post"
                : "Save Draft"}
            </button>
          </div>
        </div>
      )}

      {/* ── Progress Modal ── */}
      {progressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-elevated border border-white/[0.08] rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-seed-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{progressTitle}</h3>
                <p className="text-xs text-white/30 mt-0.5">Claude Opus 4.6 is working…</p>
              </div>
            </div>

            {/* Steps */}
            <div className="px-6 py-5 space-y-4">
              {progressSteps.map((ps, i) => (
                <div key={i} className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0">
                    {ps.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : ps.status === "active" ? (
                      <Loader2 className="w-5 h-5 text-seed-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        ps.status === "done"
                          ? "text-white/50"
                          : ps.status === "active"
                          ? "text-white"
                          : "text-white/20"
                      )}
                    >
                      {ps.label}
                    </p>
                    {ps.detail && (
                      <p className="text-xs text-white/30 mt-0.5 truncate">{ps.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer progress bar */}
            <div className="h-1 bg-white/[0.04]">
              <div
                className="h-full bg-gradient-to-r from-seed-500 to-seed-400 transition-all duration-500 ease-out"
                style={{
                  width: `${(progressSteps.filter((s) => s.status === "done").length / progressSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
