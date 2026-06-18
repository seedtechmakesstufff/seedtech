"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FormGuard, useFormGuard } from "../FormGuard";
import { trackLead } from "@/lib/gtag";
import type { IntakeConfig, IntakeData, IntakeField } from "@/lib/intake/types";

// ─── reCAPTCHA helper ──────────────────────────────────────────────────────────

async function getToken(action: string): Promise<string> {
  try {
    const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!key || typeof window === "undefined" || !window.grecaptcha) return "";
    return await window.grecaptcha.execute(key, { action });
  } catch {
    return "";
  }
}

// ─── Shared input styles ───────────────────────────────────────────────────────

const cls = {
  input:
    "w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-seed-500/50 focus:ring-1 focus:ring-seed-500/30 transition-all",
  label: "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider",
  sub: "text-xs text-white/30 mt-1",
};

// ─── Field primitives ──────────────────────────────────────────────────────────

function FieldShell({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={cls.label}>{label}</label>
      {children}
      {hint && <p className={cls.sub}>{hint}</p>}
    </div>
  );
}

function Checks({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selected.includes(opt)
              ? "bg-seed-500/20 border-seed-500/40 text-seed-300"
              : "bg-white/[0.03] border-white/[0.08] text-white/45 hover:border-white/20 hover:text-white/65"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Radios({ options, value, onChange, cols = 2 }: { options: string[]; value: string; onChange: (v: string) => void; cols?: 1 | 2 }) {
  return (
    <div className={`grid gap-2 pt-1 ${cols === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
            value === opt
              ? "bg-seed-500/10 border-seed-500/30 text-white"
              : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:border-white/15 hover:text-white/65"
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt ? "border-seed-400" : "border-white/25"}`}>
            {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-seed-400" />}
          </div>
          <span className="text-xs">{opt}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Single field renderer ─────────────────────────────────────────────────────

function renderInput(
  field: IntakeField,
  data: IntakeData,
  set: (k: string, v: string) => void,
  setArr: (k: string, v: string[]) => void,
) {
  const strVal = (data[field.key] as string) ?? "";
  const arrVal = (data[field.key] as string[]) ?? [];

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={field.rows ?? 3}
          value={strVal}
          onChange={(e) => set(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={cls.input}
        />
      );
    case "select":
      return (
        <select value={strVal} onChange={(e) => set(field.key, e.target.value)} className={cls.input}>
          <option value="">Select…</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "radios":
      return <Radios options={field.options ?? []} value={strVal} onChange={(v) => set(field.key, v)} cols={field.cols ?? 2} />;
    case "checks":
      return <Checks options={field.options ?? []} selected={arrVal} onChange={(v) => setArr(field.key, v)} />;
    default:
      return (
        <input
          type={field.type}
          value={strVal}
          onChange={(e) => set(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={cls.input}
        />
      );
  }
}

// ─── Wizard ────────────────────────────────────────────────────────────────────

export function IntakeWizard({ config }: { config: IntakeConfig }) {
  const allFields = useMemo(
    () => config.steps.flatMap((s) => s.sections.flatMap((sec) => sec.fields)),
    [config],
  );
  const init = useMemo<IntakeData>(() => {
    const obj: IntakeData = {};
    for (const f of allFields) obj[f.key] = f.type === "checks" ? [] : "";
    return obj;
  }, [allFields]);

  const totalSteps = config.steps.length;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(init);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const guard = useFormGuard();

  const set = (k: string, v: string) => setData((prev) => ({ ...prev, [k]: v }));
  const setArr = (k: string, v: string[]) => setData((prev) => ({ ...prev, [k]: v }));

  const entityName = (data[config.entityNameKey] as string) ?? "";
  const requiredFields = allFields.filter((f) => f.required);

  function next() {
    if (step < totalSteps - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = requiredFields.find((f) => !String(data[f.key] ?? "").trim());
    if (missing) {
      setError(`${requiredFields.map((f) => f.label.replace(/\s*\*$/, "")).join(", ")} are required.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await getToken(config.recaptchaAction);
      const res = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken: token, ...guard.fields() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || "Submission failed.");
      }
      trackLead(config.leadSource, { email: (data.contactEmail as string) || "" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-5">
        <div className="w-16 h-16 rounded-full bg-seed-500/10 border border-seed-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-seed-400" />
        </div>
        <div>
          <h3 className="font-display text-heading text-white mb-2">Intake Received</h3>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Thanks, {(data.contactName as string)?.split(" ")[0] || "there"}. We&apos;ll review your submission for{" "}
            <span className="text-white/70">{entityName || "your project"}</span> and reach out within 1–2 business days.
          </p>
        </div>
        <p className="text-xs text-white/25 max-w-xs mx-auto">
          If you have logos, photos, or other files to share, feel free to email them to us — we&apos;ll connect them to your intake.
        </p>
      </div>
    );
  }

  const progress = ((step + 1) / totalSteps) * 100;
  const current = config.steps[step];
  const isLast = step === totalSteps - 1;

  return (
    <form onSubmit={isLast ? submit : (e) => { e.preventDefault(); next(); }} className="space-y-8">
      <FormGuard started={guard.started} />

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-0.5">
              Step {step + 1} of {totalSteps}
            </p>
            <h2 className="font-display text-subheading text-white">{current.title}</h2>
            <p className="text-xs text-white/45 mt-0.5">{current.description}</p>
          </div>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-seed-600 to-seed-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step fields */}
      <div className="liquid-glass rounded-2xl p-6 md:p-8 space-y-6">
        {current.sections.map((section, si) => {
          const visible = section.fields.filter((f) => (f.showIf ? f.showIf(data) : true));
          if (visible.length === 0) return null;
          return (
            <div key={si} className="space-y-5">
              {section.heading && (
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pb-1 border-b border-white/[0.06]">{section.heading}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {visible.map((field) => (
                  <div key={field.key} className={field.half ? "" : "sm:col-span-2"}>
                    <FieldShell label={field.label} hint={field.hint}>
                      {renderInput(field, data, set, setArr)}
                    </FieldShell>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-seed-600 to-seed-500 text-white text-sm font-medium hover:shadow-glowSeed transition-all disabled:opacity-60"
        >
          {loading ? "Submitting…" : isLast ? "Submit Intake" : "Continue"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-center text-xs text-white/20">Your information is kept private and used only to scope your project.</p>
    </form>
  );
}
