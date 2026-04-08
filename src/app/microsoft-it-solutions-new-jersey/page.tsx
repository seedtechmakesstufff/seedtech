import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Monitor,
  PhoneCall,
  Shield,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Scale,
  Stethoscope,
  Truck,
  Mail,
  Laptop,
  Server,
  FolderOpen,
  Lock,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CardTitle,
  Body,
  AnimatedH1,
} from "@/components/kit";
import { TrustedBySection } from "@/components/home/TrustedBySection";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Microsoft IT Solutions New Jersey | SeedTech — Microsoft 365 & Azure Support for NJ",
  description:
    "SeedTech provides Microsoft IT solutions for New Jersey businesses — Microsoft 365, Azure, Exchange, Teams, SharePoint, Entra ID, Intune, and ongoing management. Call (914) 362-8889.",
  alternates: { canonical: "/microsoft-it-solutions-new-jersey" },
  openGraph: {
    title: "Microsoft IT Solutions New Jersey — SeedTech",
    description:
      "Microsoft 365, Azure, Exchange, Teams, SharePoint — deployed, secured, and managed for NJ businesses by SeedTech.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Microsoft IT Solutions New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const microsoftServices = [
  {
    icon: Mail,
    title: "Microsoft 365 & Exchange Online",
    body: "Professional email with Exchange Online, shared mailboxes, distribution lists, mail flow rules, and anti-phishing configuration. We manage the entire M365 email environment — not just the initial setup.",
  },
  {
    icon: Monitor,
    title: "Microsoft Teams deployment",
    body: "Teams setup, channel structure, external access policies, meeting configurations, and Teams Phone integration. We configure Teams for how your business actually communicates — not how Microsoft demos it.",
  },
  {
    icon: FolderOpen,
    title: "SharePoint & OneDrive",
    body: "SharePoint sites, document libraries, permissions, and OneDrive configuration. Structured file management with proper access controls — so your team collaborates without creating a permissions nightmare.",
  },
  {
    icon: Lock,
    title: "Entra ID & identity management",
    body: "Azure Active Directory (Entra ID) for user identity, single sign-on (SSO), conditional access policies, and MFA enforcement. We manage who can access what, from where, on which devices.",
  },
  {
    icon: Laptop,
    title: "Intune & device management",
    body: "Microsoft Intune for mobile device management (MDM) and endpoint management. Company-owned and BYOD policies, app deployment, compliance rules, and remote wipe capabilities.",
  },
  {
    icon: Server,
    title: "Azure cloud services",
    body: "Azure virtual machines, storage, networking, and hybrid identity. For businesses that need cloud infrastructure beyond SaaS — we deploy, monitor, and manage Azure environments.",
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: "Conditional access policies",
    body: "Block logins from risky locations, require MFA for admin accounts, enforce compliant devices, and restrict access by application. Fine-grained access control that goes far beyond a simple password.",
  },
  {
    icon: Lock,
    title: "MFA & passwordless authentication",
    body: "Microsoft Authenticator, FIDO2 keys, and Windows Hello. We configure and enforce modern authentication methods that are more secure and easier for your team to use.",
  },
  {
    icon: Mail,
    title: "Advanced email threat protection",
    body: "Microsoft Defender for Office 365 — anti-phishing, safe attachments, safe links, and impersonation protection. Layered email security that catches what basic spam filters miss.",
  },
  {
    icon: HardDrive,
    title: "Data loss prevention (DLP)",
    body: "Policies that prevent sensitive data — credit card numbers, SSNs, client information — from being shared via email, Teams, or SharePoint. Compliance-ready data protection.",
  },
];

const comparison = [
  { selfManaged: "Default security settings — conditional access disabled", managed: "Conditional access, DLP, and threat protection configured" },
  { selfManaged: "MFA optional — most users skip it", managed: "MFA enforced with modern authentication methods" },
  { selfManaged: "No device management — any device accesses company data", managed: "Intune policies enforce device compliance" },
  { selfManaged: "Former employees retain access for weeks", managed: "Automated offboarding — access revoked immediately" },
  { selfManaged: "License management is a mess — overpaying for unused seats", managed: "License optimization — right plan for each user role" },
  { selfManaged: "SharePoint is a disorganized document dump", managed: "Structured sites with proper permissions and governance" },
];

const licensing = [
  {
    tier: "Microsoft 365 Business Basic",
    price: "$6/user/mo",
    best: "Email + Teams + basic cloud apps",
    note: "Web-only Office apps, no desktop installs",
  },
  {
    tier: "Microsoft 365 Business Standard",
    price: "$12.50/user/mo",
    best: "Full Office desktop apps + email + Teams",
    note: "Most common for SMBs",
  },
  {
    tier: "Microsoft 365 Business Premium",
    price: "$22/user/mo",
    best: "Everything + Intune + advanced security",
    note: "Required for proper device management",
  },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "SharePoint for matter management, Teams for client collaboration, Exchange with advanced encryption, and conditional access for compliance requirements.",
  },
  {
    icon: Stethoscope,
    title: "Medical & dental practices",
    body: "HIPAA-configured Microsoft 365 with BAA, encrypted email, Intune device management for mobile access to EHR systems, and audit logging.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Teams for dispatch communication, SharePoint for document management across locations, and Intune for managing mobile devices in the field.",
  },
  {
    icon: Building2,
    title: "Professional services",
    body: "Full M365 suite with SharePoint project sites, Teams channels per client, Exchange shared mailboxes per department, and OneDrive for individual file storage.",
  },
];

const faqs = [
  {
    q: "Can you migrate us to Microsoft 365 from another platform?",
    a: "Yes. We handle migrations from Google Workspace, on-premises Exchange, and other email platforms. Email, contacts, calendars, and files are migrated with minimal disruption — your team keeps working while data moves in the background.",
  },
  {
    q: "What's the difference between Microsoft 365 and Office 365?",
    a: "Microsoft rebranded Office 365 to Microsoft 365 and added security and device management features. Microsoft 365 Business Premium includes Intune and advanced threat protection — features that were previously enterprise-only. We recommend Business Premium for most SMBs.",
  },
  {
    q: "Do you help us choose the right Microsoft licensing?",
    a: "Yes. Microsoft licensing is confusing — there are dozens of plans and add-ons. We audit your current licenses, identify waste, and recommend the right tier for each user based on their actual needs. Most businesses are either overpaying or under-protected.",
  },
  {
    q: "Can you set up a hybrid environment with on-premises Active Directory?",
    a: "Yes. We deploy and manage hybrid identity with Azure AD Connect (Entra Connect), synchronizing your on-premises Active Directory with Entra ID in the cloud. This is common for businesses with legacy applications that require on-prem AD.",
  },
  {
    q: "Is Microsoft 365 management included in SeedCare plans?",
    a: "User management, security configuration, and day-to-day M365 administration are included in SeedCare plans. Migration projects and initial deployment are scoped and quoted separately. Microsoft licensing is billed directly by Microsoft.",
  },
  {
    q: "Can you manage both our Microsoft and Google environments?",
    a: "Yes. Some businesses run Microsoft 365 for email and Office apps alongside Google services. We manage mixed environments, though we generally recommend consolidating to one platform when possible for security and simplicity.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Microsoft IT Solutions New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Microsoft IT Solutions",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Microsoft 365, Azure, Exchange, Teams, SharePoint, Entra ID, and Intune deployment and management for New Jersey businesses.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Microsoft IT Solutions New Jersey", item: "https://seedtechllc.com/microsoft-it-solutions-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function MicrosoftITSolutionsNJPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-base/60">Microsoft IT Solutions New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Cloud className="w-3.5 h-3.5 mr-1.5" /> Microsoft Solutions — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Microsoft IT Solutions for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Microsoft 365 is the backbone of most business environments — but most
              businesses are barely scratching the surface of what they&apos;re paying for.
              Default security settings, unused features, and no governance. That&apos;s not
              a Microsoft problem. It&apos;s a management problem.
            </p>
            <p>
              SeedTech deploys, secures, and manages Microsoft environments for businesses
              across New Jersey. Microsoft 365, Exchange, Teams, SharePoint, Entra ID,
              Intune, and Azure — configured for how your business actually works.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free M365 Review <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              <PhoneCall className="h-4 w-4" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      {/* Section 1 — Microsoft services */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Manage"
          title="Microsoft Platform Services — Deployed and Managed"
          description="From Exchange email to Azure infrastructure — we handle the full Microsoft stack for your business."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {microsoftServices.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <card.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Security features */}
      <Section>
        <SectionHeader
          eyebrow="Microsoft Security"
          title="Enterprise Security — Configured for SMBs"
          description="Microsoft Business Premium includes powerful security features that most businesses never enable. We configure and enforce them all."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {securityFeatures.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Self-managed vs SeedTech comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="Self-Managed Microsoft vs. SeedTech Managed"
          description="Having Microsoft 365 licenses doesn't mean your environment is properly configured. Here's the difference."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Self-Managed M365</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech Managed M365</p>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < comparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.selfManaged}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.managed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Licensing guide */}
      <Section>
        <SectionHeader
          eyebrow="Licensing"
          title="Microsoft 365 Licensing — Simplified"
          description="Microsoft licensing is confusing. Here's the reality for most SMBs — three plans that matter."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {licensing.map((plan) => (
            <LiquidGlassCard key={plan.tier} className="p-7 text-center">
              <p className="text-xs font-semibold text-light-base/40 uppercase tracking-wider mb-2">{plan.tier}</p>
              <p className="font-display text-heading text-white mb-2">{plan.price}</p>
              <p className="text-body-sm text-seed-400 font-medium mb-3">{plan.best}</p>
              <p className="text-body-sm text-light-base/40">{plan.note}</p>
            </LiquidGlassCard>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-body-sm text-light-base/40 mb-4">
            We audit your current licenses and recommend the right tier for each user — no overpaying, no under-protection.
          </p>
          <Link href="/services/managed-it/plans" className="text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors">
            See SeedCare plans & pricing →
          </Link>
        </div>
      </Section>

      {/* Section 5 — Industries */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Microsoft Solutions for New Jersey's Key Industries"
          description="Different industries have different Microsoft configuration requirements. We build environments tailored to your compliance and operational needs."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <card.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Microsoft IT Solutions Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech deploys and manages Microsoft environments for businesses across
            New Jersey — from law firms in Morristown running Exchange and SharePoint to
            logistics companies in Hopatcong using Teams and Intune.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge",
              "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph",
              "Morris County", "Somerset County", "Essex County", "Union County",
            ].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Microsoft IT Solutions — Frequently Asked Questions" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/google-workspace-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Google Workspace Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Google Workspace setup and management.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Complete IT management at flat-rate pricing.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Security beyond the M365 admin center.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See how your Microsoft environment stacks up.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Microsoft 365 — Properly Deployed and Managed"
          description="Exchange, Teams, SharePoint, Entra ID, Intune — configured, secured, and managed by a team that knows the Microsoft stack. Start with a free review."
          primaryLabel="Free M365 Review"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
