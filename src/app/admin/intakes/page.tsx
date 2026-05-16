"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  ClipboardList,
  FolderOpen,
  Clock,
  CheckCircle2,
  Eye,
  ChevronDown,
  ChevronUp,
  Link2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ── Types ──────────────────────────────────────────────

interface ClientIntake {
  id: string;
  token: string;
  companyName: string;
  contactEmail: string | null;
  assetDriveUrl: string | null;
  status: "sent" | "submitted" | "reviewed";
  notes: string | null;
  siteId: string | null;
  createdAt: string;
  submittedAt: string | null;
  formType: string;
}

const STATUS_META = {
  sent: { label: "Sent", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  submitted: { label: "Submitted", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  reviewed: { label: "Reviewed", icon: Eye, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
};

// ── Create Modal ───────────────────────────────────────

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (intake: ClientIntake) => void }) {
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [assetDriveUrl, setAssetDriveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [formType, setFormType] = useState("service");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, contactEmail, assetDriveUrl, notes, formType }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const intake = await res.json();
      onCreated(intake);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">New Client Intake</h2>
          <p className="text-sm text-white/40 mt-1">Generates a private link you can send to the client.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Company Name *</label>
            <input
              autoFocus
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Acme Plumbing"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Client Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="owner@acmeplumbing.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Google Drive Asset Link
              <span className="text-white/30 font-normal ml-2">— share folder where they upload logo, photos, etc.</span>
            </label>
            <input
              value={assetDriveUrl}
              onChange={e => setAssetDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Form Type</label>
            <div className="flex gap-3">
              {[
                { value: "service", label: "Service Business" },
                { value: "ecommerce", label: "Ecommerce (coming soon)", disabled: true },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && setFormType(opt.value)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg border text-sm transition-colors",
                    opt.disabled ? "opacity-30 cursor-not-allowed border-white/10 text-white/40" :
                    formType === opt.value
                      ? "border-seed-500 bg-seed-500/10 text-white"
                      : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Internal Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Context, referral source, etc."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500 resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !companyName.trim()}
              className="flex-1 py-2 rounded-lg bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create Intake Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Submission Viewer ──────────────────────────────────

// ── Section definitions (mirrors IntakeForm) ──────────

const REVIEW_SECTIONS = [
  { id: "business", title: "Your Business", fields: [
    { id: "legalName", label: "Legal business name" },
    { id: "preferredName", label: "Display name" },
    { id: "contactName", label: "Name & role" },
    { id: "contactEmail", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "address", label: "Address" },
    { id: "serviceAreas", label: "Service areas" },
    { id: "industry", label: "Industry" },
    { id: "oneLiner", label: "One-liner" },
    { id: "allServices", label: "All services" },
    { id: "notDo", label: "What they don't do" },
    { id: "billingContact", label: "Billing contact" },
  ]},
  { id: "customers", title: "Your Customers", fields: [
    { id: "idealCustomer", label: "Ideal customer" },
    { id: "buyingTrigger", label: "Why they hire you" },
    { id: "differentiators", label: "Differentiators" },
    { id: "proudResult", label: "Best result delivered" },
    { id: "credentials", label: "Credentials / certifications" },
    { id: "testimonials", label: "Reviews / testimonials" },
  ]},
  { id: "brand", title: "Brand & Style", fields: [
    { id: "brandVoice", label: "Brand voice" },
    { id: "sitesLove", label: "Sites they love" },
    { id: "colorPalette", label: "Brand colors" },
    { id: "hasBrandGuide", label: "Logo / brand guide" },
    { id: "pricingModel", label: "Pricing model" },
    { id: "showPricing", label: "Show pricing on site?" },
    { id: "startingPrice", label: "Pricing details" },
  ]},
  { id: "website", title: "Your Website", fields: [
    { id: "primaryGoal", label: "Primary goal" },
    { id: "servicePages", label: "Service pages needed" },
    { id: "otherPages", label: "Other pages" },
    { id: "story", label: "Business story" },
    { id: "teamMembers", label: "Team members" },
    { id: "competitors", label: "Competitors" },
  ]},
  { id: "tech", title: "Tech & SEO", fields: [
    { id: "hasDomain", label: "Has domain?" },
    { id: "domainName", label: "Domain name" },
    { id: "domainProvider", label: "Domain registrar" },
    { id: "hasExistingSite", label: "Existing website?" },
    { id: "existingPlatform", label: "Current platform" },
    { id: "existingHost", label: "Current host" },
    { id: "existingCmsAccess", label: "CMS access" },
    { id: "formsNeeded", label: "Forms / CTAs needed" },
    { id: "bookingTool", label: "Booking tool" },
    { id: "crm", label: "CRM / email platform" },
    { id: "hasGa4", label: "Google Analytics ID" },
    { id: "hasGbp", label: "Google Business Profile" },
    { id: "trackingPixels", label: "Ad pixels" },
  ]},
  { id: "assets", title: "Assets & Launch", fields: [
    { id: "hasPhotos", label: "Professional photos?" },
    { id: "hasExistingCopy", label: "Existing written content?" },
    { id: "socialProfiles", label: "Social profiles" },
    { id: "anythingElse", label: "Anything else" },
  ]},
];

// ── Submission Drawer ──────────────────────────────────

function buildRawText(data: Record<string, string>, companyName: string): string {
  const lines: string[] = [`CLIENT INTAKE — ${companyName.toUpperCase()}`, ""];
  for (const sec of REVIEW_SECTIONS) {
    const answered = sec.fields.filter(f => data[f.id]?.trim());
    if (answered.length === 0) continue;
    lines.push(`── ${sec.title.toUpperCase()} ──`);
    for (const f of answered) {
      lines.push(`${f.label}:`);
      lines.push(data[f.id].trim());
      lines.push("");
    }
  }
  return lines.join("\n").trim();
}

function SubmissionDrawer({ intake, onClose, onStatusChange }: {
  intake: ClientIntake;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/intakes/${intake.id}`)
      .then(r => r.json())
      .then(full => {
        setData((full.submissionData as Record<string, string>) ?? {});
        setLoading(false);
      });
  }, [intake.id]);

  async function markReviewed() {
    await fetch(`/api/admin/intakes/${intake.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "reviewed" }),
    });
    onStatusChange(intake.id, "reviewed");
  }

  function copyAll() {
    if (!data) return;
    navigator.clipboard.writeText(buildRawText(data, intake.companyName));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const rawText = data ? buildRawText(data, intake.companyName) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl" style={{ height: "88vh" }}>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <span className="text-sm font-semibold text-white">{intake.companyName}</span>
            <span className="text-xs text-white/30 ml-3">
              {intake.submittedAt ? format(new Date(intake.submittedAt), "MMM d, yyyy 'at' h:mm a") : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {intake.assetDriveUrl && (
              <a
                href={intake.assetDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" /> Drive
              </a>
            )}
            {!loading && data && (
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors font-medium"
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
              </button>
            )}
            {intake.status !== "reviewed" && (
              <button
                onClick={markReviewed}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors font-medium"
              >
                <Eye className="w-3.5 h-3.5" /> Mark reviewed
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body — raw text */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : !data || Object.keys(data).length === 0 ? (
            <p className="text-sm text-white/30 text-center py-12">No submission data found.</p>
          ) : (
            <pre className="text-sm text-white/80 font-mono whitespace-pre-wrap leading-relaxed">{rawText}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Intake Row ─────────────────────────────────────────

function IntakeRow({ intake, onDelete, onStatusChange }: {
  intake: ClientIntake;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/intake/${intake.token}`;
  const meta = STATUS_META[intake.status];
  const StatusIcon = meta.icon;

  function copyLink() {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (!confirm(`Delete intake for ${intake.companyName}? This cannot be undone.`)) return;
    await fetch(`/api/admin/intakes/${intake.id}`, { method: "DELETE" });
    onDelete(intake.id);
  }

  return (
    <>
      <div className="border border-white/8 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
        <div className="flex items-center gap-4 p-4">
          {/* Company */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{intake.companyName}</span>
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border", meta.color)}>
                <StatusIcon className="w-3 h-3" />
                {meta.label}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-white/10 text-white/30">
                {intake.formType === "ecommerce" ? "Ecommerce" : "Service"}
              </span>
            </div>
            {intake.contactEmail && (
              <p className="text-xs text-white/30 mt-0.5 truncate">{intake.contactEmail}</p>
            )}
          </div>

          {/* Date */}
          <span className="text-xs text-white/30 hidden sm:block shrink-0">
            {format(new Date(intake.createdAt), "MMM d, yyyy")}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Copy link */}
            <button
              onClick={copyLink}
              title="Copy form link"
              className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Open form */}
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open form"
              className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Asset drive */}
            {intake.assetDriveUrl && (
              <a
                href={intake.assetDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Google Drive"
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
              </a>
            )}

            {/* View submission */}
            {intake.status === "submitted" || intake.status === "reviewed" ? (
              <button
                onClick={() => setShowSubmission(true)}
                title="View submission"
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Expand */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              title="Delete"
              className="p-1.5 rounded-lg border border-white/10 text-red-400/40 hover:text-red-400 hover:border-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-white/8 px-4 pb-4 pt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-white/20 shrink-0" />
              <span className="text-xs text-white/30 font-mono truncate">{formUrl}</span>
              <button onClick={copyLink} className="text-white/30 hover:text-white transition-colors shrink-0">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            {intake.assetDriveUrl && (
              <div className="flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5 text-white/20 shrink-0" />
                <a href={intake.assetDriveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-seed-400 hover:text-seed-300 truncate transition-colors">
                  {intake.assetDriveUrl}
                </a>
              </div>
            )}
            {intake.notes && (
              <p className="text-xs text-white/40 pl-5">{intake.notes}</p>
            )}
          </div>
        )}
      </div>

      {showSubmission && (
        <SubmissionDrawer
          intake={intake}
          onClose={() => setShowSubmission(false)}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────

export default function IntakesPage() {
  const [intakes, setIntakes] = useState<ClientIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<"all" | "sent" | "submitted" | "reviewed">("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/intakes");
    const data = await res.json();
    setIntakes(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleCreated(intake: ClientIntake) {
    setIntakes(prev => [intake, ...prev]);
    setShowCreate(false);
  }

  function handleDelete(id: string) {
    setIntakes(prev => prev.filter(i => i.id !== id));
  }

  function handleStatusChange(id: string, status: string) {
    setIntakes(prev => prev.map(i => i.id === id ? { ...i, status: status as ClientIntake["status"] } : i));
  }

  const filtered = filter === "all" ? intakes : intakes.filter(i => i.status === filter);
  const counts = {
    all: intakes.length,
    sent: intakes.filter(i => i.status === "sent").length,
    submitted: intakes.filter(i => i.status === "submitted").length,
    reviewed: intakes.filter(i => i.status === "reviewed").length,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Client Intakes</h1>
          <p className="text-sm text-white/40 mt-0.5">Generate onboarding links for new clients</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Intake
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-lg border border-white/8 w-fit">
        {(["all", "sent", "submitted", "reviewed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
              filter === f ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            {f} {counts[f] > 0 && <span className="ml-1 opacity-60">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">{filter === "all" ? "No intakes yet. Create one to get started." : `No ${filter} intakes.`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(intake => (
            <IntakeRow
              key={intake.id}
              intake={intake}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
