"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  Send,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Inbox,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface DigestRun {
  id: string;
  jobType: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  resultSummary: string | null;
  errorMessage: string | null;
}

export function DigestTab() {
  const [recipients, setRecipients] = useState<string[] | null>(null);
  const [source, setSource] = useState<string>("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewSending, setPreviewSending] = useState(false);
  const [previewResult, setPreviewResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [runs, setRuns] = useState<DigestRun[] | null>(null);
  const [clearing, setClearing] = useState(false);

  const loadRecipients = useCallback(async () => {
    const r = await fetch("/api/admin/digest/recipients", { cache: "no-store" });
    const j = await r.json();
    setRecipients(j.recipients ?? []);
    setSource(j.source ?? "");
  }, []);

  const loadRuns = useCallback(async () => {
    const r = await fetch("/api/admin/digest/runs", { cache: "no-store" });
    const j = await r.json();
    setRuns(j.runs ?? []);
  }, []);

  useEffect(() => {
    void loadRecipients();
    void loadRuns();
  }, [loadRecipients, loadRuns]);

  const saveRecipients = async (next: string[]) => {
    setSaving(true);
    setSaveError(null);
    try {
      const r = await fetch("/api/admin/digest/recipients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: next }),
      });
      const j = await r.json();
      if (!r.ok) {
        setSaveError(j.error ?? "Save failed");
        return;
      }
      setRecipients(j.recipients);
      setSource("email_config");
    } finally {
      setSaving(false);
    }
  };

  const addRecipient = () => {
    const e = newEmail.trim();
    if (!e) return;
    if (recipients?.includes(e)) {
      setNewEmail("");
      return;
    }
    void saveRecipients([...(recipients ?? []), e]);
    setNewEmail("");
  };

  const removeRecipient = (email: string) => {
    void saveRecipients((recipients ?? []).filter((r) => r !== email));
  };

  const sendPreview = async () => {
    setPreviewSending(true);
    setPreviewResult(null);
    try {
      const r = await fetch("/api/admin/agents/weekly-digest/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const j = await r.json();
      setPreviewResult(r.ok ? { ok: true } : { ok: false, error: j.error ?? "Send failed" });
      // refresh run history to show the new manual run
      void loadRuns();
    } catch (e) {
      setPreviewResult({ ok: false, error: e instanceof Error ? e.message : "Send failed" });
    } finally {
      setPreviewSending(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm("Delete all digest run history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await fetch("/api/admin/digest/runs", { method: "DELETE" });
      setRuns([]);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipients */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Mail className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h2 className="font-semibold text-white">Digest recipients</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Who receives the Monday-morning autopilot summary.
              {source === "fallback" && (
                <span className="ml-2 text-yellow-300/70">Currently using fallback — add a recipient to override.</span>
              )}
            </p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {recipients == null ? (
            <div className="text-sm text-white/40 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {recipients.length === 0 && (
                  <p className="text-xs text-white/40">No recipients set.</p>
                )}
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 bg-dark-base border border-white/[0.08] rounded-lg pl-3 pr-2 py-1.5 text-sm text-white"
                  >
                    {email}
                    <button
                      onClick={() => removeRecipient(email)}
                      disabled={saving || source === "fallback"}
                      className="text-white/40 hover:text-red-300 disabled:opacity-40"
                      title={source === "fallback" ? "Add a recipient first" : "Remove"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                  placeholder="email@example.com"
                  className="flex-1 bg-dark-base border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-seed-500/40 focus:outline-none"
                />
                <button
                  onClick={addRecipient}
                  disabled={saving || !newEmail.trim()}
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Add
                </button>
              </div>
              {saveError && (
                <p className="text-xs text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> {saveError}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Send preview */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Send className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h2 className="font-semibold text-white">Send a preview now</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Triggers the digest for the active site and emails it to the recipients above.
            </p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-3 flex-wrap">
          <button
            onClick={sendPreview}
            disabled={previewSending}
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 transition-colors flex items-center gap-2"
          >
            {previewSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send digest preview
          </button>
          {previewResult?.ok && (
            <span className="text-sm text-green-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Sent
            </span>
          )}
          {previewResult && !previewResult.ok && (
            <span className="text-sm text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> {previewResult.error}
            </span>
          )}
          <Link
            href="/admin/inbox"
            className="ml-auto text-xs text-white/50 hover:text-seed-300 flex items-center gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5" /> Review pending items in the Inbox
          </Link>
        </div>
      </section>

      {/* Run history */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Clock className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h2 className="font-semibold text-white">Recent digest sends</h2>
            <p className="text-xs text-white/40 mt-0.5">Last 20 runs from cron + manual previews.</p>
          </div>
          <button
            onClick={clearHistory}
            disabled={clearing || !runs?.length}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors flex items-center gap-1.5"
          >
            {clearing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Clear history
          </button>
        </div>
        <div className="p-6">
          {runs == null ? (
            <div className="text-sm text-white/40 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : runs.length === 0 ? (
            <p className="text-sm text-white/40">No digest sends yet.</p>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {runs.map((r) => (
                <li key={r.id} className="py-2.5 flex items-center gap-3 text-xs">
                  {r.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  ) : r.status === "failed" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-white/30 shrink-0 animate-spin" />
                  )}
                  <span className="text-white">{new Date(r.startedAt).toLocaleString()}</span>
                  <span className="text-white/40">{r.jobType === "weekly_digest_manual" ? "manual" : "cron"}</span>
                  {r.durationMs != null && <span className="text-white/40">{Math.round(r.durationMs / 1000)}s</span>}
                  {r.errorMessage && <span className="text-red-300 truncate">{r.errorMessage}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
