import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Mail,
  PhoneCall,
  Shield,
  Users,
  HardDrive,
  Settings,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Scale,
  Stethoscope,
  Truck,
  Laptop,
  UserPlus,
  FolderOpen,
  Globe,
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
  title: "Google Workspace Support New Jersey | SeedTech — Google Workspace Management for NJ",
  description:
    "SeedTech provides Google Workspace support for New Jersey businesses — setup, migration, user management, security configuration, and ongoing administration. Call (914) 362-8889.",
  alternates: { canonical: "/google-workspace-support-new-jersey" },
  openGraph: {
    title: "Google Workspace Support New Jersey — SeedTech",
    description:
      "Google Workspace setup, migration, and management for NJ businesses. Gmail, Drive, Calendar, Meet — configured, secured, and managed by SeedTech.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Google Workspace Support New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const workspaceServices = [
  {
    icon: Mail,
    title: "Gmail & email management",
    body: "Professional email on your domain, email routing, shared mailboxes, distribution groups, email signatures, and spam/phishing filtering. We configure Gmail the way a business needs it — not the way Google defaults it.",
  },
  {
    icon: FolderOpen,
    title: "Google Drive & shared drives",
    body: "Shared drive structure, permissions, file organization, and storage management. We set up Drive so your team can collaborate without creating chaos — clear ownership, proper access controls, and no orphaned files.",
  },
  {
    icon: Users,
    title: "User provisioning & management",
    body: "New hire onboarding — Google account creation, group memberships, Drive access, and Calendar delegation. Departures — account suspension, data transfer, and access revocation. Consistent every time.",
  },
  {
    icon: Shield,
    title: "Security & compliance configuration",
    body: "MFA enforcement, login alerts, session management, mobile device policies, and DLP rules. We configure Google Workspace security settings that most admins don't know exist.",
  },
  {
    icon: Cloud,
    title: "Migration to Google Workspace",
    body: "Email, contacts, calendars, and files migrated from Microsoft 365, Exchange, or other platforms. We handle the migration with minimal disruption — your team keeps working while data moves in the background.",
  },
  {
    icon: Settings,
    title: "Admin console management",
    body: "Organizational units, security policies, app access controls, Chrome management, and audit logging. We manage the Google Admin console so you don't need to learn it.",
  },
];

const securityChecklist = [
  "MFA enforced on every account — no exceptions",
  "Advanced phishing and malware protection enabled",
  "Login alerts for suspicious access patterns",
  "Mobile device management policies active",
  "Third-party app access reviewed and restricted",
  "OAuth token management and revocation policies",
  "Admin accounts use separate credentials with enhanced security",
  "Google Vault retention policies for compliance",
  "Shared drive permissions audited quarterly",
  "Employee offboarding revokes all access immediately",
];

const comparison = [
  { selfManaged: "Default security settings — most features disabled", managed: "Enterprise security configuration from day one" },
  { selfManaged: "No MFA enforcement — optional at best", managed: "MFA required on every account, hardware keys supported" },
  { selfManaged: "Ad-hoc user creation and inconsistent permissions", managed: "Standardized onboarding with proper group and drive access" },
  { selfManaged: "Former employees with active accounts", managed: "Immediate offboarding — access revoked within hours" },
  { selfManaged: "Shared drives are a disorganized mess", managed: "Structured shared drives with clear ownership and permissions" },
  { selfManaged: "No one monitors the admin console", managed: "Ongoing management and quarterly security reviews" },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Secure email communication, client matter shared drives with restricted access, and Google Vault retention for legal hold requirements.",
  },
  {
    icon: Stethoscope,
    title: "Medical & dental practices",
    body: "HIPAA-configured Google Workspace with BAA, encrypted email, mobile device management, and audit logging for patient communication.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Mobile-first Workspace configuration for drivers and field staff. Chrome device management, shared calendars for dispatch, and offline access for unreliable connectivity.",
  },
  {
    icon: Building2,
    title: "Small businesses & startups",
    body: "Cost-effective collaboration platform with professional email. We get growing teams productive on Google Workspace quickly — proper setup from day one, not retrofitted later.",
  },
];

const faqs = [
  {
    q: "Can you migrate us from Microsoft 365 to Google Workspace?",
    a: "Yes. We handle full migrations from Microsoft 365, Exchange, and other platforms — email, contacts, calendars, and files. The migration runs in the background while your team continues working. Typical migration takes 1-2 weeks depending on data volume.",
  },
  {
    q: "Is Google Workspace HIPAA compliant?",
    a: "Google Workspace can be configured for HIPAA compliance with a Business Plus or Enterprise plan and a signed BAA (Business Associate Agreement). We configure the security settings, DLP rules, and audit logging required for HIPAA — the compliance configuration is detailed and specific.",
  },
  {
    q: "How much does Google Workspace support cost?",
    a: "Google Workspace management is included in SeedCare plans. Migration projects and initial setup are scoped and quoted separately based on the number of users and data volume. Google Workspace licensing is billed directly by Google.",
  },
  {
    q: "Can you help us get more out of Google Workspace?",
    a: "Absolutely. Most businesses use Gmail and Drive but ignore Google Sites, Forms, Chat, Spaces, AppSheet, and other tools included in their license. We can train your team and configure advanced features you're already paying for.",
  },
  {
    q: "What if some of our team prefers Microsoft and some prefers Google?",
    a: "We can configure hybrid environments where Google Workspace handles email and collaboration while specific users or departments use Microsoft tools. We recommend picking one platform as primary, but we support mixed environments when needed.",
  },
  {
    q: "Do you manage Chromebooks and Chrome OS devices?",
    a: "Yes. Google Workspace integrates with Chrome Enterprise for device management. We configure policies, deploy apps, manage updates, and enforce security settings on Chromebooks and Chrome OS devices.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Google Workspace Support New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Google Workspace Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Google Workspace setup, migration, security configuration, and ongoing management for New Jersey businesses.",
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
    { "@type": "ListItem", position: 2, name: "Google Workspace Support New Jersey", item: "https://seedtechllc.com/google-workspace-support-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function GoogleWorkspaceSupportNJPage() {
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
            <span className="text-light-base/60">Google Workspace Support New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="emerald" className="mb-6">
            <Globe className="w-3.5 h-3.5 mr-1.5" /> Google Workspace — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Google Workspace Support for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Google Workspace is powerful — but most businesses run it with default settings,
              inconsistent permissions, and security features that have never been turned on.
              That&apos;s not a platform problem. It&apos;s a management problem.
            </p>
            <p>
              SeedTech provides Google Workspace setup, migration, security configuration,
              and ongoing management for businesses across New Jersey. We make Workspace
              work the way your business needs it to — secure, organized, and properly managed.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Workspace Review <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — What we manage */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Manage"
          title="Google Workspace Services — Setup to Ongoing Admin"
          description="We handle the setup, migration, security, and day-to-day management of your Google Workspace environment."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaceServices.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <card.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Security checklist */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> Workspace Security
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Google Workspace Security — What We Configure
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            Google Workspace has dozens of security settings that most businesses never touch.
            Here&apos;s what we configure and enforce across every client environment.
          </p>
          <div className="text-left space-y-3 mt-8">
            {securityChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl liquid-glass p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                <p className="text-body-sm text-light-base/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 3 — Self-managed vs SeedTech comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="Self-Managed Workspace vs. SeedTech Managed"
          description="There's a significant gap between 'we have Google Workspace' and 'our Google Workspace is properly managed.'"
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Self-Managed Workspace</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech Managed Workspace</p>
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

      {/* Section 4 — Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Google Workspace for New Jersey's Key Industries"
          description="Different industries need different Workspace configurations. We tailor setup, security, and policies to your compliance and operational requirements."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Google Workspace Support Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides Google Workspace setup and management for businesses across
            New Jersey — from startups in Morristown to established firms in Morris,
            Somerset, and Essex Counties.
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
        <SectionHeader title="Google Workspace — Frequently Asked Questions" align="left" />
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
            <Link href="/microsoft-it-solutions-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Microsoft IT Solutions NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Microsoft 365 setup and management.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Complete IT management at flat-rate pricing.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Security beyond the Workspace admin console.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See how your Workspace environment stacks up.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Google Workspace — Properly Set Up and Managed"
          description="Gmail, Drive, Calendar, Meet — configured, secured, and managed by a team that knows Workspace inside and out. Start with a free review."
          primaryLabel="Free Workspace Review"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
