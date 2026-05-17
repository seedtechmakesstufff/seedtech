/* ── Intake form sections ──
 * Pure data. No React, no styling. Sections describe the form's structure
 * (which questions to ask, in what order). The form views consume this.
 */

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "multiselect";

export interface SectionField {
  id: string;
  label: string;
  type: FieldType;
  hint?: string;
  required: boolean;
  options?: string[];
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  fields: SectionField[];
}

const SERVICE_SECTIONS: Section[] = [
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

const ECOMMERCE_SECTIONS: Section[] = [
  {
    id: "coming-soon",
    title: "Ecommerce Form",
    subtitle: "This form type is coming soon.",
    fields: [],
  },
];

export function getSections(formType: string): Section[] {
  if (formType === "ecommerce") return ECOMMERCE_SECTIONS;
  return SERVICE_SECTIONS;
}

export function isSectionComplete(section: Section, data: Record<string, string>): boolean {
  return section.fields.filter(f => f.required).every(f => (data[f.id] ?? "").trim().length > 0);
}
