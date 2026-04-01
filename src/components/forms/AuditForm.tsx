"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function AuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      industry: (form.elements.namedItem("industry") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      subject: "Free Website & Technology Audit Request",
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // Still show success to avoid blocking UX
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-seed-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-seed-400" />
        </div>
        <h3 className="font-display text-heading text-white">Audit Request Received</h3>
        <p className="text-body text-light-base/55 max-w-sm mx-auto">
          We&apos;ll review your information and be in touch within 24 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-body focus:outline-none focus:border-seed-500/50 focus:ring-1 focus:ring-seed-500/30 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-body-sm text-white/50 mb-2">Your Name *</label>
          <input name="name" required placeholder="Jane Smith" className={inputClass} />
        </div>
        <div>
          <label className="block text-body-sm text-white/50 mb-2">Business Email *</label>
          <input name="email" type="email" required placeholder="jane@company.com" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-body-sm text-white/50 mb-2">Phone Number</label>
          <input name="phone" type="tel" placeholder="(555) 000-0000" className={inputClass} />
        </div>
        <div>
          <label className="block text-body-sm text-white/50 mb-2">Your Website URL</label>
          <input name="website" type="url" placeholder="https://yourcompany.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-body-sm text-white/50 mb-2">Industry</label>
        <select name="industry" className={inputClass}>
          <option value="">Select your industry</option>
          <option value="trucking">Trucking & Logistics</option>
          <option value="construction">Construction & Rigging</option>
          <option value="law">Law Firm</option>
          <option value="medical">Medical Practice</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-body-sm text-white/50 mb-2">What&apos;s your biggest technology challenge?</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us a bit about your current setup and what's not working..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-seed-600 to-seed-500 text-white font-medium hover:shadow-glowSeed transition-all duration-200 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Request My Free Audit"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      <p className="text-center text-xs text-white/25">
        No spam. No sales calls unless you ask for one. Just your audit.
      </p>
    </form>
  );
}
