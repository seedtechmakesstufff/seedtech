"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  Building2,
  Brain,
  Shield,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface OpenAIStatus {
  status: "connected" | "invalid" | "rate_limited" | "missing" | "error" | "untested";
  message: string;
  maskedKey?: string;
  model?: string;
  latencyMs?: number;
}

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

/* ── Helpers ── */

const STATUS_CONFIG = {
  connected: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Connected" },
  invalid: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Invalid Key" },
  rate_limited: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Rate Limited" },
  missing: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Not Configured" },
  error: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "Error" },
  untested: { icon: Info, color: "text-white/40", bg: "bg-white/[0.04] border-white/[0.08]", label: "Not Tested" },
};

/* ══════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  /* ── OpenAI State ── */
  const [openaiStatus, setOpenaiStatus] = useState<OpenAIStatus>({
    status: "untested",
    message: 'Click "Test Connection" to verify your API key.',
  });
  const [testingKey, setTestingKey] = useState(false);

  /* ── Business Context State ── */
  const [context, setContext] = useState<BusinessContext | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextSaving, setContextSaving] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);

  /* ── Load business context on mount ── */
  useEffect(() => {
    fetch("/api/admin/settings/business-context")
      .then((r) => r.json())
      .then((data) => {
        setContext(data);
        setContextLoading(false);
      })
      .catch(() => setContextLoading(false));
  }, []);

  /* ── Test OpenAI key ── */
  const testOpenAI = useCallback(async () => {
    setTestingKey(true);
    try {
      const res = await fetch("/api/admin/settings/test-openai", { method: "POST" });
      const data = await res.json();
      setOpenaiStatus(data);
    } catch {
      setOpenaiStatus({ status: "error", message: "Failed to reach the server." });
    }
    setTestingKey(false);
  }, []);

  /* ── Save business context ── */
  const saveContext = useCallback(async () => {
    if (!context) return;
    setContextSaving(true);
    setContextSaved(false);
    try {
      const res = await fetch("/api/admin/settings/business-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      const data = await res.json();
      setContext(data);
      setContextSaved(true);
      setTimeout(() => setContextSaved(false), 3000);
    } catch {
      // silent
    }
    setContextSaving(false);
  }, [context]);

  /* ── Update helpers ── */
  const updateField = (field: keyof BusinessContext, value: string) => {
    if (!context) return;
    setContext({ ...context, [field]: value });
  };

  const updateArrayField = (field: keyof BusinessContext, value: string) => {
    if (!context) return;
    setContext({ ...context, [field]: value.split("\n").filter(Boolean) });
  };

  const statusCfg = STATUS_CONFIG[openaiStatus.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-seed-400" />
          Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Manage integrations, AI configuration, and admin preferences.
        </p>
      </div>

      {/* ─── OpenAI API Key Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Key className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">OpenAI API Key</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Status badge */}
          <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", statusCfg.bg)}>
            <StatusIcon className={cn("w-5 h-5 shrink-0", statusCfg.color)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", statusCfg.color)}>
                {statusCfg.label}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{openaiStatus.message}</p>
            </div>
            {openaiStatus.latencyMs != null && (
              <span className="text-xs text-white/30 shrink-0">
                {openaiStatus.latencyMs}ms
              </span>
            )}
          </div>

          {/* Details */}
          {openaiStatus.status !== "untested" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {openaiStatus.maskedKey && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">API Key</p>
                  <p className="text-sm text-white font-mono">{openaiStatus.maskedKey}</p>
                </div>
              )}
              {openaiStatus.model && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">Model</p>
                  <p className="text-sm text-white">{openaiStatus.model}</p>
                </div>
              )}
              {openaiStatus.latencyMs != null && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">Latency</p>
                  <p className="text-sm text-white">{openaiStatus.latencyMs}ms</p>
                </div>
              )}
            </div>
          )}

          {/* Test button */}
          <button
            onClick={testOpenAI}
            disabled={testingKey}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            {testingKey ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {testingKey ? "Testing…" : "Test Connection"}
          </button>

          {/* Help text */}
          <p className="text-xs text-white/30">
            The API key is stored in <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code> on the server. 
            To change it, update the <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">OPENAI_API_KEY</code> variable and restart the dev server.
          </p>
        </div>
      </section>

      {/* ─── AI Business Context Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-seed-400" />
            <div>
              <h2 className="font-semibold text-white">AI Business Context</h2>
              <p className="text-xs text-white/40 mt-0.5">
                This is what the AI knows about SeedTech. Edit it to improve content generation.
              </p>
            </div>
          </div>
          {context?.updatedAt && (
            <span className="text-xs text-white/30 hidden sm:block">
              Last updated: {new Date(context.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {contextLoading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : context ? (
          <div className="p-6 space-y-6">
            {/* Company basics - 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              hint="Any additional rules — linking strategy, topics to avoid, keywords to always include, etc."
              value={context.customInstructions}
              onChange={(v) => updateField("customInstructions", v)}
              rows={4}
            />

            {/* Save button */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={saveContext}
                disabled={contextSaving}
                className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                {contextSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {contextSaving ? "Saving…" : "Save Context"}
              </button>
              {contextSaved && (
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-white/40 text-sm">
            Failed to load business context.
          </div>
        )}
      </section>

      {/* ─── Admin & Environment Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Shield className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">Admin & Environment</h2>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              label="Allowed Admin Emails"
              value={process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Configured server-side"}
              icon={<Shield className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Auth Provider"
              value="NextAuth — Credentials"
              icon={<Key className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="AI Model"
              value="GPT-4o (OpenAI)"
              icon={<Brain className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Blog Storage"
              value="File-based JSON (content/blog/)"
              icon={<Building2 className="w-4 h-4 text-white/40" />}
            />
          </div>

          <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-seed-400" />
              <p className="text-sm font-medium text-white">Environment Variables Status</p>
            </div>
            <div className="space-y-1.5">
              <EnvRow name="NEXTAUTH_URL" present />
              <EnvRow name="NEXTAUTH_SECRET" present />
              <EnvRow name="OPENAI_API_KEY" present />
              <EnvRow name="ADMIN_EMAILS" present />
              <EnvRow name="ADMIN_PASSWORD" present />
            </div>
          </div>

          <p className="text-xs text-white/30">
            Environment variables and admin credentials are managed in{" "}
            <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code>.
            Changes require a server restart to take effect.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── Reusable Field Components ── */

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
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors"
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
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label}
        {hint && <span className="text-white/30 font-normal ml-2">— {hint}</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors resize-y"
      />
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-white/40">{label}</p>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function EnvRow({ name, present }: { name: string; present: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {present ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-400" />
      )}
      <code className="text-white/60">{name}</code>
      <span className={cn("ml-auto", present ? "text-green-400/60" : "text-red-400/60")}>
        {present ? "Set" : "Missing"}
      </span>
    </div>
  );
}
