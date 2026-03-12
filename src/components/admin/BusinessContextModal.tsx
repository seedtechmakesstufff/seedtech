"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  X,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

/* ── Types ── */

interface BusinessContext {
  companyName: string;
  tagline: string;
  location: string;
  domain: string;
  primaryService: string;
  secondaryServices: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
  toneOfVoice: string;
  customInstructions: string;
  updatedAt: string;
}

/* ── Modal Component ── */

export function BusinessContextModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [context, setContext] = useState<BusinessContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* Load on open */
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSaved(false);
    fetch("/api/admin/settings/business-context")
      .then((r) => r.json())
      .then((data) => {
        setContext(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  /* Save */
  const save = useCallback(async () => {
    if (!context) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings/business-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      const data = await res.json();
      setContext(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    }
    setSaving(false);
  }, [context]);

  /* Field helpers */
  const updateField = (field: keyof BusinessContext, value: string) => {
    if (!context) return;
    setContext({ ...context, [field]: value });
  };

  const updateArrayField = (field: keyof BusinessContext, value: string) => {
    if (!context) return;
    setContext({ ...context, [field]: value.split("\n").filter(Boolean) });
  };

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-dark-elevated border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col">
        {/* ── Header (pinned) ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-seed-500/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-seed-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Business Context</h2>
              <p className="text-xs text-white/40">
                What the AI knows about your business — used for blog generation &amp; SEO content.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Content (scrollable) ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white/30" />
            </div>
          ) : context ? (
            <>
              {/* Company basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput
                  label="Company Name"
                  value={context.companyName}
                  onChange={(v) => updateField("companyName", v)}
                />
                <FieldInput
                  label="Domain"
                  value={context.domain}
                  onChange={(v) => updateField("domain", v)}
                />
                <FieldInput
                  label="Location"
                  value={context.location}
                  onChange={(v) => updateField("location", v)}
                />
                <FieldInput
                  label="Tagline"
                  value={context.tagline}
                  onChange={(v) => updateField("tagline", v)}
                />
              </div>

              {/* Services */}
              <FieldInput
                label="Primary Service"
                value={context.primaryService}
                onChange={(v) => updateField("primaryService", v)}
              />
              <FieldTextarea
                label="Other Services"
                hint="One per line"
                value={context.secondaryServices.join("\n")}
                onChange={(v) => updateArrayField("secondaryServices", v)}
                rows={4}
              />

              {/* Audience */}
              <FieldTextarea
                label="Target Audience"
                value={context.targetAudience}
                onChange={(v) => updateField("targetAudience", v)}
                rows={2}
              />

              {/* USPs */}
              <FieldTextarea
                label="Unique Selling Points"
                hint="One per line"
                value={context.uniqueSellingPoints.join("\n")}
                onChange={(v) => updateArrayField("uniqueSellingPoints", v)}
                rows={5}
              />

              {/* Tone */}
              <FieldTextarea
                label="Tone of Voice"
                hint="Describe how the AI should write"
                value={context.toneOfVoice}
                onChange={(v) => updateField("toneOfVoice", v)}
                rows={3}
              />

              {/* Custom instructions */}
              <FieldTextarea
                label="Custom Instructions"
                hint="Linking strategy, topics to avoid, keywords to always include, etc."
                value={context.customInstructions}
                onChange={(v) => updateField("customInstructions", v)}
                rows={4}
              />

              {/* Last updated */}
              {context.updatedAt && (
                <p className="text-xs text-white/20 text-right">
                  Last saved: {new Date(context.updatedAt).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <div className="py-16 text-center text-white/40 text-sm">
              Failed to load business context.
            </div>
          )}
        </div>

        {/* ── Footer (pinned) ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] shrink-0 bg-dark-elevated">
          <p className="text-xs text-white/25 hidden sm:block">
            Changes take effect on the next AI generation.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            {saved && (
              <span className="text-sm text-green-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || loading || !context}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving…" : "Save Context"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Field Components ── */

function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">
        {label}
        {hint && <span className="text-white/25 font-normal ml-1.5">— {hint}</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors resize-y"
      />
    </div>
  );
}
