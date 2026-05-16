"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, FolderOpen, Loader2, Maximize2, X, Check, Pencil, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntakeMeta {
  id: string;
  companyName: string;
  assetDriveUrl: string | null;
  status: string;
  formType: string;
  submissionData?: Record<string, string> | null;
}

type FormData = Record<string, string>;

interface SectionField {
  id: string;
  label: string;
  type: string;
  hint?: string;
  required: boolean;
  options?: string[];
}

const SERVICE_SECTIONS: { id: string; title: string; subtitle: string; fields: SectionField[] }[] = [
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
      { id: "billingContact", label: "Billing contact", hint: "Name, email, and mailing address for invoices", type: "textarea", required: true },
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
      { id: "testimonials", label: "Paste 2-3 of your best customer reviews", hint: "Include reviewer name and context if possible", type: "textarea", required: false },
    ],
  },
  {
    id: "brand",
    title: "Brand & Style",
    subtitle: "How your site should look and sound.",
    fields: [
      { id: "brandVoice", label: "How should your website sound?", hint: "e.g. Professional, Approachable, Bold, Conversational, Technical, Warm", type: "textarea", required: true },
      { id: "sitesLove", label: "3 websites you love the look or feel of", hint: "Paste URLs and note what you like about each — any industry is fine", type: "textarea", required: false },
      { id: "colorPalette", label: "Brand colors (if you have them)", hint: "e.g. Navy and gold, or we have a brand guide", type: "text", required: false },
      { id: "hasBrandGuide", label: "Do you have a logo / brand guidelines?", type: "select", options: ["Yes — uploading to Drive folder", "No — need one", "Logo only, no guidelines"], required: true },
      { id: "pricingModel", label: "How is your business priced?", type: "multiselect", options: ["Project-based", "Monthly retainer", "Hourly", "Per-unit / Per-job", "Tiered plans", "Custom quote only"], required: true },
      { id: "showPricing", label: "Should pricing appear on the website?", type: "select", options: ["Yes — show exact prices", "Show ranges only", "No — drive to contact"], required: true },
      { id: "startingPrice", label: "More details on your pricing, packages, and programs", hint: "e.g. what's included, price ranges, how you structure your offers", type: "textarea", required: false },
    ],
  },
  {
    id: "website",
    title: "Your Website",
    subtitle: "Pages, content, and what the site needs to say.",
    fields: [
      { id: "primaryGoal", label: "What is the #1 goal of this website?", type: "multiselect", options: ["Generate leads", "Book appointments", "Sell products / services online", "Build credibility & trust", "Rank on Google"], required: true },
      { id: "servicePages", label: "Services that each need their own page", hint: "One per line with a short description", type: "textarea", required: true },
      { id: "otherPages", label: "Other pages you want", hint: "e.g. About, Pricing, Blog, Portfolio, FAQ, Locations, Team, Contact", type: "textarea", required: false },
      { id: "story", label: "What do you want your customers to know about your business?", hint: "Share your background, values, what drives you, or anything that builds trust", type: "textarea", required: true },
      { id: "teamMembers", label: "Team members to feature", hint: "Name, role, and 1-2 sentences about each person", type: "textarea", required: false },
      { id: "competitors", label: "Your top 3-5 competitors", hint: "Name + website for each, and how you differ from them", type: "textarea", required: true },
    ],
  },
  {
    id: "tech",
    title: "Tech & SEO",
    subtitle: "Domain, hosting, tools, integrations, and search visibility.",
    fields: [
      { id: "hasDomain", label: "Do you have a domain name?", type: "select", options: ["Yes", "No — I need one"], required: true },
      { id: "domainName", label: "What is your domain name?", hint: "e.g. mycompany.com", type: "text", required: false },
      { id: "domainProvider", label: "Who is your domain provider / registrar?", hint: "e.g. GoDaddy, Namecheap, Google Domains, Squarespace", type: "text", required: false },
      { id: "hasExistingSite", label: "Do you have an existing website?", type: "select", options: ["Yes", "No"], required: true },
      { id: "existingPlatform", label: "What platform is your current site built on?", hint: "e.g. WordPress, Squarespace, Wix, Shopify, Webflow, custom", type: "text", required: false },
      { id: "existingHost", label: "Who is your current web host / server?", hint: "e.g. WP Engine, SiteGround, Bluehost, Vercel, GoDaddy Hosting", type: "text", required: false },
      { id: "existingCmsAccess", label: "Do you have admin / login access to the current site?", type: "select", options: ["Yes — I have full access", "Partial access", "No — I don't have access", "Not applicable"], required: false },
      { id: "formsNeeded", label: "What forms / calls-to-action do you need?", hint: "e.g. Contact form, Quote request, Book a call, Newsletter signup", type: "textarea", required: true },
      { id: "bookingTool", label: "Booking or scheduling tool", hint: "e.g. Calendly link, Acuity, none", type: "text", required: false },
      { id: "crm", label: "CRM or email platform", hint: "e.g. HubSpot, Mailchimp, none", type: "text", required: false },
      { id: "hasGa4", label: "Google Analytics ID (if you have one)", hint: "Looks like G-XXXXXXXX", type: "text", required: false },
      { id: "hasGbp", label: "Do you have a Google Business Profile?", type: "select", options: ["Yes, it's claimed and active", "Yes but it's not set up", "No", "I'm not sure"], required: true },
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
      { id: "anythingElse", label: "Anything else we should know?", hint: "Constraints, sensitivities, hard requirements", type: "textarea", required: false },
    ],
  },
];

const ECOMMERCE_SECTIONS = [
  {
    id: "coming-soon",
    title: "Ecommerce Form",
    subtitle: "This form type is coming soon.",
    fields: [] as SectionField[],
  },
];

function getSections(formType: string) {
  if (formType === "ecommerce") return ECOMMERCE_SECTIONS;
  return SERVICE_SECTIONS;
}

// ── Expandable Textarea ────────────────────────────────

function ExpandableTextarea({
  value,
  onChange,
  label,
  baseClass,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  baseClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className={cn(baseClass, "resize-none pr-10")}
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          title="Expand"
          className="absolute bottom-2 right-2 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: "70vh" }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              autoFocus
              value={value}
              onChange={e => onChange(e.target.value)}
              className="flex-1 p-4 text-sm text-gray-900 resize-none focus:outline-none rounded-b-2xl"
              placeholder="Start typing…"
            />
          </div>
        </div>
      )}
    </>
  );
}

// ── Multi-Select Field ─────────────────────────────────

function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
}) {
  // Fully controlled — derive all state from `value` prop so parent re-renders don't break layout
  const lines = value ? value.split("\n").filter(Boolean) : [];
  const selected = lines.filter(l => !l.startsWith("Other:"));
  const otherLine = lines.find(l => l.startsWith("Other:"));
  const otherChecked = !!otherLine;
  const otherText = otherLine ? otherLine.slice(7) : "";

  function emit(sel: string[], oc: boolean, ot: string) {
    const parts = [...sel, ...(oc ? [`Other: ${ot}`] : [])];
    onChange(parts.join("\n"));
  }

  function toggle(opt: string) {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    emit(next, otherChecked, otherText);
  }

  function toggleOther() {
    emit(selected, !otherChecked, otherText);
  }

  return (
    <div className="space-y-2.5">
      {(field.options ?? []).map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div className={cn(
            "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
            selected.includes(opt) ? "border-emerald-500 bg-emerald-500" : "border-gray-300 group-hover:border-emerald-400"
          )}>
            {selected.includes(opt) && <Check className="w-3 h-3 text-white" />}
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="sr-only" />
          </div>
          <span className="text-sm text-gray-800">{opt}</span>
        </label>
      ))}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className={cn(
          "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
          otherChecked ? "border-emerald-500 bg-emerald-500" : "border-gray-300 group-hover:border-emerald-400"
        )}>
          {otherChecked && <Check className="w-3 h-3 text-white" />}
          <input type="checkbox" checked={otherChecked} onChange={toggleOther} className="sr-only" />
        </div>
        <span className="text-sm text-gray-800">Other</span>
      </label>
      {otherChecked && (
        <input
          autoFocus
          value={otherText}
          onChange={e => emit(selected, true, e.target.value)}
          placeholder="Please describe…"
          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ml-8"
        />
      )}
    </div>
  );
}

// ── Review Field (inline editable) ────────────────────

function ReviewField({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const isEmpty = !value.trim();

  const base =
    "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  // Render multiselect values as comma-separated badges
  function renderValue() {
    if (!value.trim()) return <span className="text-gray-300 italic">Not answered</span>;
    if (field.type === "multiselect") {
      const parts = value.split("\n").filter(Boolean);
      return (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {parts.map(p => (
            <span key={p} className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">{p}</span>
          ))}
        </div>
      );
    }
    return <span className="text-gray-800 text-sm whitespace-pre-wrap">{value}</span>;
  }

  return (
    <div className="group rounded-xl border border-gray-100 bg-white px-4 py-3.5 hover:border-gray-200 transition-all">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-xs font-medium text-gray-500">
          {field.label}
          {field.required && !value.trim() && <span className="ml-1 text-red-400">Required</span>}
        </span>
        <button
          type="button"
          onClick={() => setEditing(v => !v)}
          className={cn(
            "flex items-center gap-1 text-xs font-medium transition-colors shrink-0",
            editing ? "text-emerald-600" : "text-gray-300 group-hover:text-gray-400 hover:text-emerald-500"
          )}
        >
          {editing ? <><X className="w-3 h-3" /> Done</> : <><Pencil className="w-3 h-3" /> Edit</>}
        </button>
      </div>

      {editing ? (
        <div className="mt-2">
          {field.type === "textarea" ? (
            <ExpandableTextarea value={value} onChange={onChange} label={field.label} baseClass={base} />
          ) : field.type === "multiselect" ? (
            <MultiSelectField field={field} value={value} onChange={onChange} />
          ) : field.type === "select" ? (
            <select value={value} onChange={e => onChange(e.target.value)} className={cn(base, "cursor-pointer")}>
              <option value="">Select…</option>
              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input type={field.type} value={value} onChange={e => onChange(e.target.value)} className={base} autoFocus />
          )}
        </div>
      ) : (
        <div className={cn("mt-0.5", isEmpty && "mt-1")}>
          {renderValue()}
        </div>
      )}
    </div>
  );
}

// ── Field ──────────────────────────────────────────────

function Field({
  field,
  value,
  onChange,
}: {
  field: SectionField;
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
        <ExpandableTextarea value={value || ""} onChange={onChange} label={field.label} baseClass={base} />
      ) : field.type === "multiselect" ? (
        <MultiSelectField field={field} value={value || ""} onChange={onChange} />
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

// ── Main Component ─────────────────────────────────────

export default function IntakeForm({ token }: { token: string }) {
  const [meta, setMeta] = useState<IntakeMeta | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");

  const draftKey = `intake-draft-${token}`;

  // Load saved draft from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const { formData: savedData, currentSection: savedSection } = JSON.parse(saved);
        if (savedData) setFormData(savedData);
        if (typeof savedSection === "number") setCurrentSection(savedSection);
      }
    } catch { /* ignore */ }
  }, [draftKey]);

  // Auto-save draft whenever formData or currentSection changes
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ formData, currentSection }));
    } catch { /* ignore */ }
  }, [formData, currentSection, draftKey]);

  useEffect(() => {
    fetch(`/api/intake/${token}`)
      .then(r => { if (!r.ok) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        setMeta(data);
      });
  }, [token]);

  function setField(id: string, val: string) {
    setFormData(prev => ({ ...prev, [id]: val }));
  }

  function validateSection(idx: number) {
    const sections = getSections(meta?.formType ?? "service");
    return sections[idx].fields.filter(f => f.required).every(f => (formData[f.id] || "").trim().length > 0);
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

  // Show read-only summary when already submitted or just submitted
  const isSubmittedState = submitted || (meta && (meta.status === "submitted" || meta.status === "reviewed"));
  if (isSubmittedState && meta) {
    const sections = getSections(meta.formType ?? "service");
    // Use in-memory formData if just submitted, otherwise use server-stored submissionData
    const answers: Record<string, string> = submitted ? formData : (meta.submissionData ?? {});
    return (
      <div className="flex h-screen bg-[#f5f5f7]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen">
          <div className="px-6 pt-7 pb-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
            <p className="text-base font-bold text-gray-900 truncate">{meta.companyName}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">Submitted</span>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {sections.map((s) => (
              <a key={s.id} href={`#section-${s.id}`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-medium">{s.title}</span>
              </a>
            ))}
          </nav>
          {meta.assetDriveUrl && (
            <div className="p-4 border-t border-gray-100">
              <a href={meta.assetDriveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <FolderOpen className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="font-medium">Upload to Drive</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
              </a>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col h-screen">
          <div className="shrink-0 bg-white border-b border-gray-100 px-8 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your answers are in!</h1>
                <p className="text-sm text-gray-400 mt-0.5">Here&apos;s everything you submitted. We&apos;ll review before your kick-off call.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-8 max-w-2xl space-y-10">
              {sections.map(sec => {
                const answered = sec.fields.filter(f => answers[f.id]?.trim());
                if (answered.length === 0) return null;
                return (
                  <div key={sec.id} id={`section-${sec.id}`}>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{sec.title}</h2>
                    <div className="space-y-4">
                      {answered.map(field => (
                        <div key={field.id} className="rounded-xl bg-white border border-gray-100 px-4 py-3.5">
                          <p className="text-xs font-medium text-gray-400 mb-1">{field.label}</p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{answers[field.id]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = getSections(meta?.formType ?? "service");
  const section = sections[currentSection];
  const isLast = currentSection === sections.length - 1;
  const canAdvance = validateSection(currentSection);

  // ── Review page ────────────────────────────────────────
  if (reviewing) {
    return (
      <div className="flex h-screen bg-[#f5f5f7]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen">
          <div className="px-6 pt-7 pb-6">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
            <p className="text-base font-bold text-gray-900 truncate">{meta?.companyName}</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setReviewing(false); setCurrentSection(i); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-emerald-100 text-emerald-600">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium">{s.title}</span>
              </button>
            ))}
          </nav>
          {meta?.assetDriveUrl && (
            <div className="p-4 border-t border-gray-100">
              <a href={meta.assetDriveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <FolderOpen className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="font-medium">Upload to Drive</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
              </a>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col h-screen">
          {/* Header */}
          <div className="shrink-0 bg-white border-b border-gray-100">
            <div className="px-8 py-5 flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Review your answers</h1>
                <p className="text-sm text-gray-400 mt-0.5">Everything looks good? Hit confirm below — or click any answer to edit it.</p>
              </div>
            </div>
          </div>

          {/* Scrollable answers */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-8 max-w-2xl space-y-10">
              {sections.map((sec, si) => (
                <div key={sec.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">{sec.title}</h2>
                    <button
                      type="button"
                      onClick={() => { setReviewing(false); setCurrentSection(si); }}
                      className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit section
                    </button>
                  </div>
                  <div className="space-y-4">
                    {sec.fields.map(field => {
                      const val = formData[field.id] || "";
                      return (
                        <ReviewField
                          key={field.id}
                          field={field}
                          value={val}
                          onChange={v => setField(field.id, v)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="px-8 py-4 flex gap-3 max-w-2xl">
              <button
                type="button"
                onClick={() => setReviewing(false)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Confirm &amp; Submit</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen">

          {/* Company label */}
          <div className="px-6 pt-7 pb-6">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
            <p className="text-base font-bold text-gray-900 truncate">{meta?.companyName}</p>
          </div>

          {/* Steps */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {sections.map((s, i) => {
              const done = validateSection(i);
              const active = i === currentSection;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSection(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : done
                      ? "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  )}
                >
                  {/* Step indicator */}
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all",
                    active ? "bg-emerald-500 text-white" :
                    done ? "bg-emerald-100 text-emerald-600" :
                    "bg-gray-100 text-gray-400"
                  )}>
                    {done && !active ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={cn("text-sm", active ? "font-semibold" : "font-medium")}>{s.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Drive link — pinned to bottom */}
          {meta?.assetDriveUrl && (
            <div className="p-4 border-t border-gray-100">
              <a
                href={meta.assetDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <FolderOpen className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="font-medium">Upload to Drive</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
              </a>
            </div>
          )}
        </aside>

        {/* ── Main column ── */}
        <div className="flex-1 min-w-0 flex flex-col h-screen">

          {/* Header */}
          <div className="shrink-0 bg-white border-b border-gray-100">
            <div className="px-8 py-5 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{section.title}</h1>
                <p className="text-sm text-gray-400 mt-1">{section.subtitle}</p>
              </div>
              <span className="text-xs font-medium text-gray-400 tabular-nums shrink-0 mt-1">
                {currentSection + 1} / {sections.length}
              </span>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-8 max-w-2xl space-y-8">
            {section.fields.map(field => (
              <Field key={field.id} field={field} value={formData[field.id] || ""} onChange={val => setField(field.id, val)} />
            ))}

            {section.id === "assets" && meta?.assetDriveUrl && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-start gap-3">
                <FolderOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upload your files to Google Drive</p>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">Logo, photos, existing copy, brand guidelines.</p>
                  <a href={meta.assetDriveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Open folder <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

      {/* ── Footer — scoped inside main column, never touches sidebar ── */}
      <div className="shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {/* Progress */}
        <div className="px-8 pt-3">
          <div className="flex gap-1.5 max-w-2xl">
            {sections.map((s, i) => (
              <div key={s.id} className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                i < currentSection ? "bg-emerald-500" :
                i === currentSection ? "bg-emerald-400" :
                "bg-gray-200"
              )} />
            ))}
          </div>
        </div>
        {/* Buttons */}
        <div className="px-8 py-4 flex gap-3 max-w-2xl">
          {currentSection > 0 && (
            <button
              onClick={() => setCurrentSection(v => v - 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
              onClick={isLast ? () => setReviewing(true) : () => setCurrentSection(v => v + 1)}
            disabled={!canAdvance || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : isLast ? (
              <><ClipboardList className="w-4 h-4" /> Review answers</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
