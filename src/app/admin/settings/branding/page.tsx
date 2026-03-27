"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ImageIcon, Upload, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function BrandingPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load current logo ──
  useEffect(() => {
    fetch("/api/admin/branding/logo")
      .then((r) => r.json())
      .then((d) => setLogoUrl(d.logoUrl ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Upload ──
  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("logo", file);
      const res = await fetch("/api/admin/branding/logo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setLogoUrl(data.logoUrl);
      showToast("success", "Logo uploaded successfully.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  // ── Delete ──
  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/branding/logo", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setLogoUrl(null);
      showToast("success", "Logo removed.");
    } catch {
      showToast("error", "Could not remove logo.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <ImageIcon className="w-7 h-7 text-seed-400" />
          Branding
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Upload your company logo. It will appear in all transactional emails sent from the
          platform.
        </p>
      </div>

      {/* Upload card */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Company Logo</h2>
          <p className="text-xs text-white/40 mt-0.5">
            PNG, JPEG, WebP, or SVG · Max 5 MB · Recommended: at least 400 px wide
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          {loading ? (
            <div className="flex items-center justify-center h-28 rounded-lg bg-dark-base border border-white/[0.06]">
              <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
            </div>
          ) : logoUrl ? (
            <div className="flex items-center gap-5 p-4 rounded-lg bg-dark-base border border-white/[0.06]">
              <div className="relative h-16 w-40 shrink-0">
                <Image
                  src={logoUrl}
                  alt="Company logo"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Logo uploaded</p>
                <p className="text-xs text-white/40 mt-0.5 truncate">{logoUrl}</p>
              </div>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Remove
              </button>
            </div>
          ) : null}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all
              ${dragOver
                ? "border-seed-400 bg-seed-500/[0.06]"
                : "border-white/[0.10] hover:border-seed-500/30 hover:bg-seed-500/[0.03]"
              }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-seed-400 animate-spin" />
                <p className="text-sm text-white/50">Uploading…</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/30" />
                <div className="text-center">
                  <p className="text-sm text-white/60">
                    <span className="text-seed-400 font-medium">Click to upload</span> or drag &amp; drop
                  </p>
                  <p className="text-xs text-white/30 mt-1">PNG, JPEG, WebP, SVG — max 5 MB</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      </section>

      {/* How it's used */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Where it&apos;s used</h2>
        </div>
        <ul className="divide-y divide-white/[0.04]">
          {[
            { label: "Contact form notification emails", note: "Sent to your team when someone submits the contact form" },
            { label: "Contact form auto-replies", note: "Sent to the person who submitted the contact form" },
            { label: "Quote notification emails", note: "Sent to your team when a quote flow is completed" },
            { label: "Quote auto-replies", note: "Sent to the prospective client after a quote submission" },
            { label: "Team invite emails", note: "Sent when you add a new team member" },
          ].map(({ label, note }) => (
            <li key={label} className="px-6 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0" />
              <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-white/35">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all
            ${toast.type === "success"
              ? "bg-dark-elevated border-green-500/20 text-green-400"
              : "bg-dark-elevated border-red-500/20 text-red-400"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
