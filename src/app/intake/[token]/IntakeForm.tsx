"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, FolderOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────

interface IntakeMeta {
  id: string;
  companyName: string;
  assetDriveUrl: string | null;
  status: string;
}

type FormData = Record<string, string>;

// ── Form Sections ──────────────────────────────────────

const SECTIONS = [
  {
    id: "identity",
    title: "Business Identity",
    subtitle: "Basic info that feeds your site's SEO and structured data.",
    fields: [
      { id: "legalName", label: "Legal business name", type: "text", required: true },
      { id: "preferredName", label: "What name goes on the website?", hint: "DBA or preferred name", type: "text", required: true },
      { id: "contactName", label: "Your name & role", type: "text", required: true },
      { id: "contactEmail", label: "Best email to reach you", type: "email", required: true },
      { id: "phone", label: "Phone number", type: "text", required: true },
      { id: "address", label: "Physical address", hint: 'Or "Remote / Online only"', type: "text", required: true },
      { id: "primaryCity", label: "City/metro you primarily serve", hint: "e.g. Austin, TX", type: "text", required: true },
      { id: "serviceAreas", label: "All service areas", hint: "Cities, counties, regions, states", type: "textarea", required: true },
      { id: "domain", label: "Website domain (existing or desired)", type: "text", required: true },
      { id: "yearFounded", label: "Year founded", type: "text", required: true },
      { id: "employees", label: "Number of employees", type: "select", options: ["1", "2–5", "6–15", "16–50", "50+"], required: true },
      { id: "industry", label: "Industry / vertical", hint: "e.g. HVAC, Law Firm, Landscaping", type: "text", required: true },
    ],
  },
  {
    id: "what_you_do",
    title: "What You Do",
    subtitle: "Tell us about your business in your own words — this becomes the foundation for all your copy.",
    fields: [
      { id: "oneLiner", label: "Describe your business in ONE sentence", hint: 'e.g. "We install and repair HVAC systems for homeowners in Austin"', type: "text", required: true },
      { id: "primaryService", label: "Primary / flagship service", hint: "The one thing you're best known for", type: "text", required: true },
      { id: "allServices", label: "List all services you offer", hint: "One per line", type: "textarea", required: true },
      { id: "notDo", label: "What do you NOT do?", hint: 'e.g. "No residential, no emergency calls"', type: "textarea", required: true },
      { id: "problemSolved", label: "What problem do you solve for customers?", type: "textarea", required: true },
      { id: "sellsProducts", label: "Do you sell physical products?", type: "select", options: ["No", "Yes", "Both products and services"], required: true },
      { id: "products", label: "If yes, list your key products", type: "textarea", required: false },
    ],
  },
  {
    id: "customer",
    title: "Your Ideal Customer",
    subtitle: "Who are you trying to reach? Be specific — vague answers produce generic copy.",
    fields: [
      { id: "idealCustomer", label: "Describe your ideal customer in detail", hint: "Industry, size, role, location, situation", type: "textarea", required: true },
      { id: "badFit", label: "Who is NOT a good fit?", type: "textarea", required: true },
      { id: "buyingTrigger", label: "Why do people hire you? (primary trigger)", hint: 'e.g. "Their current contractor flaked", "Emergency situation"', type: "textarea", required: true },
      { id: "objections", label: "What objections do customers have before hiring you?", type: "textarea", required: true },
      { id: "postHireQuotes", label: "What do customers say after working with you?", hint: "Real testimonial language if you have it", type: "textarea", required: false },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Plans",
    subtitle: "Helps us write copy that matches your sales process.",
    fields: [
      { id: "pricingModel", label: "How is your business priced?", type: "select", options: ["Project-based", "Monthly retainer", "Hourly", "Per-unit", "Tiered plans", "Custom quote"], required: true },
      { id: "hasNamedPlans", label: "Do you have named plans or tiers?", type: "select", options: ["Yes", "No"], required: true },
      { id: "planDetails", label: "If yes, list your plan names and what each includes", type: "textarea", required: false },
      { id: "startingPrice", label: "Starting price or typical range", hint: 'e.g. "$500–$2,000 project" or "from $150/mo"', type: "text", required: false },
      { id: "showPricing", label: "Should pricing be shown on the website?", type: "select", options: ["Yes, show prices", "Show ranges only", "No, drive to contact"], required: true },
      { id: "contractTerms", label: "Contract terms?", hint: 'e.g. "Month-to-month", "Annual", "No contracts"', type: "text", required: false },
    ],
  },
  {
    id: "differentiators",
    title: "What Makes You Different",
    subtitle: "The most important section. Specific differentiators = compelling copy.",
    fields: [
      { id: "differentiators", label: "List 3–7 things that genuinely make you better or different", hint: 'Be specific. "30-minute response time" not "great service"', type: "textarea", required: true },
      { id: "proudResult", label: "A result you've delivered that you're most proud of", hint: "A specific outcome, stat, or story", type: "textarea", required: true },
      { id: "credentials", label: "Credentials, certifications, awards, or affiliations", hint: 'e.g. "Licensed & insured", "Google Partner", "BBB A+"', type: "textarea", required: false },
      { id: "customerLongevity", label: "How long is your typical customer relationship?", hint: 'e.g. "One-time project", "3–5 years average"', type: "text", required: false },
      { id: "guarantees", label: "Any guarantees or warranties?", type: "textarea", required: false },
    ],
  },
  {
    id: "brand",
    title: "Brand Voice & Style",
    subtitle: "How your site sounds is as important as how it looks.",
    fields: [
      { id: "brandVoice", label: "How should your website sound?", hint: "e.g. Professional, Approachable, Bold, Friendly, Technical, Serious", type: "textarea", required: true },
      { id: "wordsLove", label: "Words or phrases you love", type: "textarea", required: false },
      { id: "wordsHate", label: "Words or phrases to NEVER use", hint: 'e.g. "synergy", "elevate", "world-class"', type: "textarea", required: false },
      { id: "sitesLove", label: "3 websites you love the look or feel of", hint: "URLs + what you like about each (any industry)", type: "textarea", required: true },
      { id: "sitesHate", label: "Websites you do NOT want to look like", type: "textarea", required: false },
      { id: "colorPalette", label: "Preferred color palette", hint: 'e.g. "Navy and gold" or "We have a brand guide"', type: "text", required: false },
      { id: "hasBrandGuide", label: "Do you have existing brand guidelines?", type: "select", options: ["Yes — I'll share it", "No — we need one", "In progress"], required: true },
    ],
  },
  {
    id: "pages",
    title: "Pages & Site Structure",
    subtitle: "Help us plan the architecture of your site.",
    fields: [
      { id: "pagesNeeded", label: "Which pages do you need?", hint: "List each page type you want: Home, About, Services, Pricing, Contact, Blog, Portfolio, Testimonials, FAQ, Locations, Industries, Team, Careers, etc.", type: "textarea", required: true },
      { id: "servicePages", label: "List each service that needs its own page", hint: "One per line with a 1-sentence description", type: "textarea", required: true },
      { id: "industryPages", label: "Do you need industry-specific pages?", hint: 'e.g. "HVAC for restaurants", "IT for law firms"', type: "select", options: ["Yes", "No"], required: true },
      { id: "industryPageList", label: "If yes, list the industries", type: "textarea", required: false },
      { id: "locationPages", label: "Do you need location-specific pages?", type: "select", options: ["Yes — list cities below", "No"], required: true },
      { id: "locationList", label: "If yes, list the cities/locations", type: "textarea", required: false },
      { id: "wantBlog", label: "Do you need a blog?", type: "select", options: ["Yes — regular posts", "Yes — add it later", "No"], required: true },
      { id: "preservePages", label: "Any pages from your current site to preserve?", hint: "URLs + why they matter", type: "textarea", required: false },
    ],
  },
  {
    id: "about",
    title: "About & Team",
    subtitle: "Humanizes your brand and builds trust.",
    fields: [
      { id: "story", label: "How did the business start?", type: "textarea", required: true },
      { id: "mission", label: "What's your mission beyond profit?", type: "textarea", required: false },
      { id: "teamMembers", label: "Key team members to feature", hint: "Name, role, 1–2 sentences about them", type: "textarea", required: false },
      { id: "community", label: "Community involvement, sponsorships, or local ties", type: "textarea", required: false },
      { id: "notableClients", label: "Notable clients, industries, or project types (if shareable)", type: "textarea", required: false },
    ],
  },
  {
    id: "social_proof",
    title: "Social Proof",
    subtitle: "Testimonials and results are the most persuasive content on any service website.",
    fields: [
      { id: "testimonials", label: "Paste 3–5 of your best customer reviews", hint: "Include the reviewer's first name and company/context", type: "textarea", required: true },
      { id: "googleProfileUrl", label: "Google Business Profile link", type: "text", required: false },
      { id: "hasCaseStudies", label: "Do you have case studies or project highlights?", type: "select", options: ["Yes — adding to asset folder", "No — but I can describe some", "Not yet"], required: true },
      { id: "keyStats", label: "Key stats or results", hint: 'e.g. "200+ clients", "4.9 stars / 180 reviews", "saved clients avg $40k/yr"', type: "textarea", required: false },
    ],
  },
  {
    id: "seo",
    title: "SEO & Search",
    subtitle: "Feeds directly into your keyword research and content strategy.",
    fields: [
      { id: "targetKeywords", label: "What would your ideal customer Google to find you?", hint: "Brain dump — don't overthink it", type: "textarea", required: true },
      { id: "currentKeywords", label: "Keywords you currently rank for (if known)", type: "textarea", required: false },
      { id: "competitors", label: "Your top 3–5 competitors", hint: "Name + website URL for each", type: "textarea", required: true },
      { id: "competitorPositioning", label: "How do you position against them?", hint: 'e.g. "We\'re faster, they\'re bigger but slower to respond"', type: "textarea", required: true },
      { id: "hasGsc", label: "Do you have Google Search Console set up?", type: "select", options: ["Yes", "No", "Not sure"], required: true },
      { id: "hasGa4", label: "Do you have Google Analytics?", hint: "Include the Measurement ID (G-XXXXXXXX) if yes", type: "text", required: false },
      { id: "hasGbp", label: "Do you have a Google Business Profile?", type: "select", options: ["Yes, it's claimed", "Yes, unclaimed", "No"], required: true },
    ],
  },
  {
    id: "technical",
    title: "Technical & Integrations",
    subtitle: "Connects your site to your existing tools.",
    fields: [
      { id: "formsNeeded", label: "What forms do you need?", hint: "e.g. Contact, Quote request, Consultation booking, Newsletter, Callback", type: "textarea", required: true },
      { id: "bookingTool", label: "Booking or scheduling tool", hint: "e.g. Calendly, Acuity, none", type: "text", required: false },
      { id: "crm", label: "CRM or email marketing platform", hint: "e.g. HubSpot, Mailchimp, none", type: "text", required: false },
      { id: "runsAds", label: "Do you run Google Ads?", type: "select", options: ["Yes", "No", "Planning to"], required: true },
      { id: "trackingPixels", label: "Any ad tracking pixels to install?", hint: "Google Ads, Meta, LinkedIn — include IDs if known", type: "textarea", required: false },
      { id: "needsEcommerce", label: "Do you need ecommerce / online payments?", type: "select", options: ["Yes", "No", "Maybe later"], required: true },
      { id: "otherIntegrations", label: "Other tools or integrations to connect?", hint: "Live chat, review platforms, booking systems, etc.", type: "textarea", required: false },
    ],
  },
  {
    id: "assets",
    title: "Assets & Content",
    subtitle: "Point us to what you have. Upload files to the Google Drive folder below.",
    fields: [
      { id: "hasLogo", label: "Do you have a logo?", type: "select", options: ["Yes — uploading to asset folder", "No — need one", "In progress"], required: true },
      { id: "hasPhotos", label: "Do you have professional photos?", hint: "Team, work, location, etc.", type: "select", options: ["Yes — uploading", "No — use stock photos", "Photography planned"], required: true },
      { id: "hasExistingCopy", label: "Do you have existing written content?", hint: "Service descriptions, bios, brochures", type: "select", options: ["Yes — uploading", "No — SeedTech writes it", "Some of it"], required: true },
      { id: "currentWebsite", label: "Current website URL (if any)", type: "text", required: false },
      { id: "socialProfiles", label: "Existing social media profiles", hint: "LinkedIn, Instagram, Facebook, etc. — paste URLs", type: "textarea", required: false },
      { id: "marketingMaterials", label: "Other marketing materials to reference", hint: "Brochures, pitch decks, ads — describe or upload to asset folder", type: "textarea", required: false },
    ],
  },
  {
    id: "goals",
    title: "Goals & Launch",
    subtitle: "Help us prioritize what matters most.",
    fields: [
      { id: "primaryGoal", label: "What is the #1 goal of this website?", type: "select", options: ["Generate leads", "Book appointments", "Sell products", "Build credibility", "Rank on Google", "All of the above"], required: true },
      { id: "successIn90Days", label: "What does success look like in 90 days?", hint: "Specific and measurable if possible", type: "textarea", required: true },
      { id: "launchDate", label: "Target launch date", type: "text", required: true },
      { id: "hardDeadline", label: "Hard deadline (if any)", hint: "Event, campaign, etc.", type: "text", required: false },
      { id: "approver", label: "Who is approving the final site?", hint: "Name + email", type: "text", required: true },
      { id: "anythingElse", label: "Anything else we should know?", hint: "Constraints, sensitivities, things to be careful about", type: "textarea", required: false },
    ],
  },
];

// ── Field Component ────────────────────────────────────

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
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500 transition-colors";

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1">
        {field.label}
        {field.required && <span className="text-seed-400 ml-1">*</span>}
      </label>
      {field.hint && <p className="text-xs text-white/30 mb-2">{field.hint}</p>}

      {field.type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className={cn(base, "resize-none")}
        />
      ) : field.type === "select" ? (
        <select
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className={cn(base, "cursor-pointer")}
        >
          <option value="">Select…</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className={base}
        />
      )}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────

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
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        if (data.status === "submitted" || data.status === "reviewed") {
          setAlreadySubmitted(true);
        }
        setMeta(data);
      });
  }, [token]);

  function setField(id: string, val: string) {
    setFormData(prev => ({ ...prev, [id]: val }));
  }

  function validateSection(idx: number) {
    const section = SECTIONS[idx];
    return section.fields
      .filter(f => f.required)
      .every(f => (formData[f.id] || "").trim().length > 0);
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

  // ── Loading ──
  if (!meta && !notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    );
  }

  // ── Not found ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-white/40 text-sm">This link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // ── Already submitted ──
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <p className="text-white font-medium">Already submitted</p>
          <p className="text-white/40 text-sm">We've received your answers and will be in touch soon.</p>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto" />
          <h2 className="text-xl font-semibold text-white">You're all set!</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            We've received your onboarding answers. We'll review everything before your kick-off call.
          </p>
          {meta?.assetDriveUrl && (
            <a
              href={meta.assetDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-seed-400" />
              Upload your assets to Google Drive
              <ChevronRight className="w-4 h-4 text-white/30" />
            </a>
          )}
        </div>
      </div>
    );
  }

  const section = SECTIONS[currentSection];
  const isLast = currentSection === SECTIONS.length - 1;
  const canAdvance = validateSection(currentSection);
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/8">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30 font-medium tracking-wide uppercase">SeedTech</p>
            <p className="text-sm font-medium text-white">{meta?.companyName} — Website Onboarding</p>
          </div>
          <span className="text-xs text-white/30">{currentSection + 1} / {SECTIONS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-seed-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {SECTIONS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < currentSection ? "bg-seed-500" : i === currentSection ? "bg-seed-400" : "bg-white/10"
                )}
              />
            ))}
          </div>
          <h2 className="text-xl font-semibold text-white mt-4">{section.title}</h2>
          <p className="text-sm text-white/40 mt-1">{section.subtitle}</p>
        </div>

        {/* Fields */}
        <div className="space-y-6">
          {section.fields.map(field => (
            <Field
              key={field.id}
              field={field}
              value={formData[field.id] || ""}
              onChange={val => setField(field.id, val)}
            />
          ))}
        </div>

        {/* Asset drive callout */}
        {section.id === "assets" && meta?.assetDriveUrl && (
          <div className="mt-6 p-4 rounded-xl border border-seed-500/20 bg-seed-500/5">
            <div className="flex items-start gap-3">
              <FolderOpen className="w-5 h-5 text-seed-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Upload files to your Google Drive folder</p>
                <p className="text-xs text-white/40 mt-0.5 mb-2">Logos, photos, existing copy, brand guidelines — add them here.</p>
                <a
                  href={meta.assetDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-seed-400 hover:text-seed-300 transition-colors"
                >
                  Open Drive folder <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {/* Navigation */}
        <div className="flex gap-3 mt-10">
          {currentSection > 0 && (
            <button
              onClick={() => setCurrentSection(v => v - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={isLast ? handleSubmit : () => setCurrentSection(v => v + 1)}
            disabled={!canAdvance || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium transition-colors disabled:opacity-40"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : isLast ? (
              <><CheckCircle2 className="w-4 h-4" /> Submit</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
