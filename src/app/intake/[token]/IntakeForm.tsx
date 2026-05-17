/* ── IntakeForm orchestrator ──
 * State machine + API I/O. The three visual states live in their own files:
 *   - FormView   (currentView === "form")    user is filling out sections
 *   - ReviewView (currentView === "review")  user is reviewing before submit
 *   - SummaryView(currentView === "summary") submission complete + editable
 *
 * Persists draft state to localStorage so a refresh mid-form doesn't lose work.
 * The submitted summary view drives its own auto-save via PATCH.
 */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FormView } from "./FormView";
import { ReviewView } from "./ReviewView";
import { SummaryView } from "./SummaryView";
import { getSections } from "./sections";

interface IntakeMeta {
  id: string;
  companyName: string;
  assetDriveUrl: string | null;
  status: string;
  formType: string;
  submissionData?: Record<string, string> | null;
}

type View = "form" | "review" | "summary";

export default function IntakeForm({ token }: { token: string }) {
  const [meta, setMeta] = useState<IntakeMeta | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<View>("form");
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const draftKey = `intake-draft-${token}`;

  // Load saved draft on first render.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { formData?: Record<string, string>; currentSection?: number };
      if (parsed.formData) setFormData(parsed.formData);
      if (typeof parsed.currentSection === "number") setCurrentSection(parsed.currentSection);
    } catch {
      /* ignore */
    }
  }, [draftKey]);

  // Persist draft whenever the user changes anything.
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ formData, currentSection }));
    } catch {
      /* ignore */
    }
  }, [formData, currentSection, draftKey]);

  // Fetch the intake meta + any prior submission.
  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/intake/${token}`)
      .then((r) => {
        if (!r.ok) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data: IntakeMeta | null) => {
        if (cancelled || !data) return;
        setMeta(data);
        if (data.status === "submitted" || data.status === "reviewed") {
          setView("summary");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  function setField(id: string, val: string) {
    setFormData((prev) => ({ ...prev, [id]: val }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/intake/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submit failed");
      localStorage.removeItem(draftKey);
      setView("summary");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (notFound) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-white">
        <p className="text-gray-400 text-sm">This link is invalid or has expired.</p>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
      </div>
    );
  }

  const sections = getSections(meta.formType ?? "service");

  if (view === "summary") {
    const initialAnswers = (meta.submissionData ?? formData) as Record<string, string>;
    return (
      <SummaryView
        token={token}
        companyName={meta.companyName}
        assetDriveUrl={meta.assetDriveUrl}
        sections={sections}
        initialAnswers={initialAnswers}
      />
    );
  }

  if (view === "review") {
    return (
      <ReviewView
        companyName={meta.companyName}
        assetDriveUrl={meta.assetDriveUrl}
        sections={sections}
        formData={formData}
        onChangeField={setField}
        onBack={() => setView("form")}
        onEditSection={(idx) => {
          setCurrentSection(idx);
          setView("form");
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    );
  }

  return (
    <FormView
      companyName={meta.companyName}
      assetDriveUrl={meta.assetDriveUrl}
      sections={sections}
      currentSection={currentSection}
      formData={formData}
      onChangeField={setField}
      onChangeSection={setCurrentSection}
      onReview={() => setView("review")}
      submitting={submitting}
      error={error}
    />
  );
}
