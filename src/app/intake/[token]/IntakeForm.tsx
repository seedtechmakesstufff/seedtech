"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, FolderOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntakeMeta {
  id: string;
  companyName: string;
  assetDriveUrl: string | null;
  status: string;
}

type FormData = Record<string, string>;

const SECTIONS = [
  {
    id: "business",
    title: "Your Business",
    subtitle: "The basics that feed your site's copy, SEO, and structured data.",
    fields: [
      { id: "legalName", label: "Legal business name", type: "text", required: true },
      { id: "preferredName", label: "Name to display on the website", hint: "DBA or preferred name if different", type: "text", required: true },
      { id: "contactName", label: "Your name & role", type: "text", required: true },
      { id: "contactEmail", label: "Best email to reach you", type: "email", required: true },
      { id: "phone", label: "Phone number", type: "text", required: true },
      { id: "address", label: "Physical address", hint: "Or \"Remote / Online only\"", type: "text", required: true },
      { id: "serviceAreas", label: "Cities / regions you serve", hint: "e.g. Austin TX, surrounding Hill Country", type: "textarea", required: true },
      { id: "industry", label: "Industry / vertical", hint: "e.g. HVAC, Law Firm, Landscaping", type: "text", required: true },
      { id: "oneLiner", label: "Describe your business in one sentence", hint: "e.g. We install and repair HVAC systems for homeowners in Austin", type: "text", required: true },
      { id: "allServices", label: "All services you offer", hint: "One per line", type: "textarea", required: true },
      { id: "notDo", label: "What do you NOT do?", hint: "e.g. No residential, no emergency calls", type: "textarea", required: false },
      { id: "currentWebsite", label: "Current website URL (if any)", type: "text", required: false },
    ],
  },
  {
    id: "customers",
    title: "Your Customers",
    subtitle: "Who you serve and why they choose you — the core of all your copy.",
    fields: [
      { id: "idealCustomer", label: "Describe your ideal customer", hint: "Who they are, their situation, what they need", type: "textarea", required: true },
      { id: "buyingTrigger", label: "Why do people hire you?", hint: "What triggers the decision — e.g. their current provider failed them", type: "textarea", required: true },
      { id: "differentiators", label: "What genuinely makes you different or better?", hint: "Be specific. \"30-minute response time\" beats \"great customer service\"", type: "textarea", required: true },
      { id: "proudResult", label: "Best result you have delivered for a client", hint: "A specific outcome, stat, or before/after story", type: "textarea", required: true },
      { id: "credentials", label: "Credentials, certifications, or awards", hint: "e.g. Licensed & insured, Google Partner, BBB A+", type: "textarea", required: false },
      { id: "testimonials", label: "Paste 2-3 of your best customer reviews", hint: "Include reviewer name and context if possible", type: "textarea", required: true },
    ],
  },
  {
    id: "brand",
    title: "Brand & Style",
    subtitle: "How your site should look and sound.",
    fields: [
      { id: "brandVoice", label: "How should your website sound?", hint: "e.g. Professional, Approachable, Bold, Conversational, Technical, Warm", type: "textarea", required: true },
      { id: "sitesLove", label: "3 websites you love the look or feel of", hint: "Paste URLs and note what you like about each — any industry is fine", type: "textarea", required: true },
      { id: "colorPalette", label: "Brand colors (if you have them)", hint: "e.g. Navy and gold, or we have a brand guide", type: "text", required: false },
      { id: "hasBrandGuide", label: "Do you have a logo / brand guidelines?", type: "select", options: ["Yes — uploading to Drive folder", "No — need one", "Logo only, no guidelines"], required: true },
      { id: "pricingModel", label: "How is your business priced?", type: "select", options: ["Project-based", "Monthly retainer", "Hourly", "Per-unit / Per-job", "Tiered plans", "Custom quote only"], required: true },
      { id: "showPricing", label: "Should pricing appear on the website?", type: "select", options: ["Yes — show exact prices", "Show ranges only", "No — drive to contact"], required: true },
      { id: "startingPrice", label: "Starting price or typical range", hint: "e.g. Projects from $500 or from $150/mo", type: "text", required: false },
    ],
  },
  {
    id: "website",
    title: "Your Website",
    subtitle: "Pages, content, and what the site needs to say.",
    fields: [
      { id: "primaryGoal", label: "What is the #1 goal of this website?", type: "select", options: ["Generate leads", "Book appointments", "Sell products / services online", "Build credibility & trust", "Rank on Google", "All of the above"], required: true },
      { id: "servicePages", label: "Services that each need their own page", hint: "One per line with a short description", type: "textarea", required: true },
      { id: "otherPages", label: "Other pages you want", hint: "e.g. About, Pricing, Blog, Portfolio, FAQ, Locations, Team, Contact", type: "textarea", required: false },
      { id: "story", label: "How did the business start?", hint: "A short origin story for the About page", type: "textarea", required: true },
      { id: "teamMembers", label: "Team members to feature", hint: "Name, role, and 1-2 sentences about each person", type: "textarea", required: false },
      { id: "competitors", label: "Your top 3-5 competitors", hint: "Name + website for each, and how you differ from them", type: "textarea", required: true },
    ],
  },
  {
    id: "tech",
    title: "Tech & SEO",
    subtitle: "Tools, integrations, and search visibility.",
    fields: [
      { id: "targetKeywords", label: "What would your ideal customer Google to find you?", hint: "Brain dump — don't overthink it", type: "textarea", required: true },
      { id: "formsNeeded", label: "What forms / calls-to-action do you need?", hint: "e.g. Contact form, Quote request, Book a call, Newsletter signup", type: "textarea", required: true },
      { id: "bookingTool", label: "Booking or scheduling tool", hint: "e.g. Calendly link, Acuity, none", type: "text", required: false },
      { id: "crm", label: "CRM or email platform", hint: "e.g. HubSpot, Mailchimp, none", type: "text", required: false },
      { id: "hasGa4", label: "Google Analytics ID (if you have one)", hint: "Looks like G-XXXXXXXX", type: "text", required: false },
      { id: "hasGbp", label: "Do you have a Google Business Profile?", type: "select", options: ["Yes, it's claimed and active", "Yes but it's not set up", "No"], required: true },
      { id: "trackingPixels", label: "Any ad pixels to install?", hint: "Google Ads, Meta, LinkedIn — include IDs if known", type: "textarea", required: false },
    ],
  },
  {
    id: "assets",
    title: "Assets & Launch",
    subtitle: "What you have, what you need, and when you want to go live.",
    fields: [
      { id: "hasPhotos", label: "Do you have professional photos?", hint: "Team headshots, location, work/project photos", type: "select", options: ["Yes — uploading to Drive folder", "No — please use stock photos", "Photography is planned"], required: true },
      { id: "hasExistingCopy", label: "Do you have existing written content?", hint: "Service descriptions, bios, brochures — upload to Drive", type: "select", options: ["Yes — uploading to Drive folder", "No — SeedTech writes everything", "Some of it"], required: true },
      { id: "socialProfiles", label: "Social media profiles", hint: "Paste URLs for LinkedIn, Instagram, Facebook, etc.", type: "textarea", required: false },
      { id: "launchDate", label: "Target launch date", type: "text", required: true },
      { id: "approver", label: "Who approves the final site?", hint: "Name + email of the decision maker", type: "text", required: true },
      { id: "anythingElse", label: "Anything else we should know?", hint: "Constraints, sensitivities, hard requirements", type: "textarea", required: false },
    ],
  },
];

function Field({
  field,
  value,
  onChange,
}: {
  field: (typeof SECTIONS)[0]["fields"][0];
  value: string;
  onChange: (val: string) => void;
}) {
  const base =
    "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {field.label}
        {field.required && <span className="text-emerald-600 ml-1">*</span>}
      </label>
      {field.hint && <p className="text-xs text-gray-400 mb-2">{field.hint}</p>}
      {field.type === "textarea" ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={4} className={cn(base, "resize-none")} />
      ) : field.type === "select" ? (
        <select value={value || ""} onChange={e => onChange(e.target.value)} className={cn(base, "cursor-pointer")}>
          <option value="">Select…</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={field.type} value={value || ""} onChange={e => onChange(e.target.value)} className={base} />
      )}
    </div>
  );
}

export default function IntakeForm({ token }: { token: string }) {
  const [meta, setMeta] = useState<IntakeMeta | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/intake/${token}`)
      .then(r => { if (!r.ok) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        if (data.status === "submitted" || data.status === "reviewed") setAlreadySubmitted(true);
        setMeta(data);
      });
  }, [token]);

  function setField(id: string, val: string) {
    setFormData(prev => ({ ...prev, [id]: val }));
  }

  function validateSection(idx: number) {
    return SECTIONS[idx].fields.filter(f => f.required).every(f => (formData[f.id] || "").trim().length > 0);
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
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!meta && !notFound) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-6 h-6 text-gray-300 animate-spin" /></div>;
  }

  if (notFound) {
    return <div className="min-h-screen bg-white flex items-center justify-center p-6"><p className="text-gray-400 text-sm">This link is invalid or has expired.</p></div>;
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-gray-900 font-medium">Already submitted</p>
          <p className="text-gray-400 text-sm">We&apos;ve received your answers and will be in touch soon.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">You&apos;re all set!</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We&apos;ve received your onboarding answers. We&apos;ll review everything before your kick-off call.
          </p>
          {meta?.assetDriveUrl && (
            <a href={meta.assetDriveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm hover:bg-gray-100 transition-colors">
              <FolderOpen className="w-4 h-4 text-emerald-500" />
              Upload your assets to Google Drive
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </a>
          )}
        </div>
      </div>
    );
  }

  const section = SECTIONS[currentSection];
  const isLast = currentSection === SECTIONS.length - 1;
  const canAdvance = validateSection(currentSection);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Step bars */}
        <div className="flex gap-1 px-4 pt-4">
          {SECTIONS.map((s, i) => (
            <div key={s.id} className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < currentSection ? "bg-emerald-500" : i === currentSection ? "bg-emerald-400" : "bg-gray-200"
            )} />
          ))}
        </div>
        {/* Section title */}
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-4 flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{section.title}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{section.subtitle}</p>
          </div>
          <span className="text-xs text-gray-300 tabular-nums shrink-0">{currentSection + 1} / {SECTIONS.length}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {section.fields.map(field => (
            <Field key={field.id} field={field} value={formData[field.id] || ""} onChange={val => setField(field.id, val)} />
          ))}

          {section.id === "assets" && meta?.assetDriveUrl && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
              <div className="flex items-start gap-3">
                <FolderOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload files to your Google Drive folder</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">Logo, photos, existing copy, brand guidelines.</p>
                  <a href={meta.assetDriveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    Open Drive folder <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>

      {/* Pinned bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex gap-3">
          {currentSection > 0 && (
            <button onClick={() => setCurrentSection(v => v - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={isLast ? handleSubmit : () => setCurrentSection(v => v + 1)}
            disabled={!canAdvance || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : isLast ? (
              <><CheckCircle2 className="w-4 h-4" /> Submit</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
