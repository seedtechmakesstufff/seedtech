import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  HardDrive,
  ShieldCheck,
  DatabaseBackup,
  AlertTriangle,
  Flame,
  Bug,
  Trash2,
  ServerCrash,
  Eye,
  FileCheck,
  Timer,
  PhoneCall,
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

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Backup & Disaster Recovery New Jersey | SeedTech — Business Data Protection for NJ",
  description:
    "SeedTech provides backup and disaster recovery for New Jersey businesses — monitored cloud backup, image-level recovery, and tested DR plans. Don't lose your data.",
  alternates: { canonical: "/backup-disaster-recovery-new-jersey" },
  openGraph: {
    title: "Backup & Disaster Recovery New Jersey — SeedTech",
    description:
      "Monitored cloud backup and disaster recovery for NJ businesses. File-level, image-level, and tested recovery plans — included in SeedCare plans.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Backup & Disaster Recovery New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const scenarios = [
  {
    icon: Bug,
    title: "Ransomware encrypts your files",
    body: "Every file on every connected drive is locked. Without a clean backup, your options are pay the ransom or start over.",
  },
  {
    icon: Flame,
    title: "Fire or water damage",
    body: "Physical disasters don't care about your server room. If your backups live on the same site as your servers, they're gone too.",
  },
  {
    icon: Trash2,
    title: "Accidental deletion",
    body: "Someone deletes a critical folder, purges their recycle bin, or overwrites a shared file. Without versioned backup, it's gone permanently.",
  },
  {
    icon: ServerCrash,
    title: "Hardware failure",
    body: "Drives fail. Controllers die. Power surges fry boards. A server that's been running for 5 years can stop working on any given Tuesday.",
  },
];

const backupStack = [
  {
    icon: DatabaseBackup,
    title: "File-level cloud backup",
    body: "Individual files and folders backed up to the cloud with 30-day retention (Essentials) or longer. Restore a single file or an entire folder from any point in the retention window.",
  },
  {
    icon: HardDrive,
    title: "Image-level backup",
    body: "Full system image backup captures everything — OS, applications, settings, data. If a server dies, we can restore the entire machine to new hardware or a cloud instance. Available on SeedCare Pro.",
  },
  {
    icon: Eye,
    title: "Backup monitoring",
    body: "Backups fail silently. A job that hasn't run in weeks won't announce itself. We monitor every backup job through NinjaOne and get alerted immediately when something stops working.",
  },
  {
    icon: Timer,
    title: "Recovery time objectives",
    body: "How fast can you be back online? We define recovery time objectives (RTO) and recovery point objectives (RPO) based on your operations — so when it matters, there's a documented plan.",
  },
  {
    icon: FileCheck,
    title: "DR testing & documentation",
    body: "A disaster recovery plan that hasn't been tested is just a document. SeedCare Pro includes quarterly DR testing so you know the plan actually works before you need it.",
  },
  {
    icon: ShieldCheck,
    title: "Ransomware-safe recovery",
    body: "Cloud backups are isolated from your production environment. If ransomware encrypts your local files, your backup copies remain clean and recoverable.",
  },
];

const tierComparison = [
  { feature: "Cloud backup", essentials: "30-day file backup", plus: "50 GB cloud backup", pro: "Unlimited image backup" },
  { feature: "Backup monitoring", essentials: "✅", plus: "✅", pro: "✅" },
  { feature: "File-level restore", essentials: "✅", plus: "✅", pro: "✅" },
  { feature: "Full image restore", essentials: "—", plus: "—", pro: "✅" },
  { feature: "DR plan documentation", essentials: "—", plus: "Basic", pro: "Comprehensive" },
  { feature: "Quarterly DR testing", essentials: "—", plus: "—", pro: "✅" },
];

const faqs = [
  {
    q: "What's the difference between backup and disaster recovery?",
    a: "Backup is a copy of your data. Disaster recovery is the documented, tested plan for getting your entire business back online after a major incident — including infrastructure, applications, and connectivity. Most businesses have some form of backup. Very few have a real DR plan.",
  },
  {
    q: "How often are backups taken?",
    a: "Backup frequency depends on the tier and the data type. File-level backups run daily at minimum. Image-level backups (Pro tier) can be configured for more frequent intervals based on your RPO requirements.",
  },
  {
    q: "Can you recover from ransomware using backups?",
    a: "In most cases, yes — if the backups are monitored and verified. Cloud backups are isolated from your production environment, so ransomware can't encrypt them. The key is having recent, clean backups — which requires active monitoring.",
  },
  {
    q: "What happens if our backup has been failing?",
    a: "If you're a SeedCare client, we'd already know — backup jobs are monitored 24/7 and we're alerted on failures. If you're not currently monitored, our assessment will check backup status as a first priority.",
  },
  {
    q: "How long does it take to restore from a backup?",
    a: "A single file can be restored in minutes. A full server image restore depends on the size and infrastructure — typically a few hours. We define RTOs during onboarding so expectations are clear before an incident occurs.",
  },
  {
    q: "Do you support both cloud and on-premises backup?",
    a: "Our primary backup platform is NinjaOne cloud backup, which provides off-site, ransomware-safe storage. For clients with specific requirements, we can also configure hybrid approaches with local backup targets.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Backup & Disaster Recovery New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Backup and Disaster Recovery",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Monitored cloud backup and disaster recovery services for New Jersey businesses — file-level, image-level, tested DR plans, and ransomware-safe recovery.",
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
    { "@type": "ListItem", position: 2, name: "Backup & Disaster Recovery New Jersey", item: "https://seedtechllc.com/backup-disaster-recovery-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function BackupDRNJPage() {
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
            <span className="text-light-base/60">Backup & Disaster Recovery New Jersey</span>
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
            <DatabaseBackup className="w-3.5 h-3.5 mr-1.5" /> Backup & DR — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Backup & Disaster Recovery for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your backup is probably failing and no one is checking. That&apos;s not an
              exaggeration — it&apos;s what we find in the majority of assessments we run for
              new clients across New Jersey.
            </p>
            <p>
              SeedTech provides monitored cloud backup and disaster recovery planning for
              businesses that can&apos;t afford to lose data or spend days recovering from an
              incident.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Backup Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — What happens without DR */}
      <Section theme="light">
        <SectionHeader
          eyebrow="When Data Disappears"
          title="What Happens When You Lose Data Without a Recovery Plan"
          description="These aren't hypothetical scenarios. They happen to businesses in New Jersey every week — and most aren't prepared."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {scenarios.map((card) => (
            <div key={card.title} className="rounded-2xl border border-red-100 bg-red-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <card.icon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Backup stack */}
      <Section>
        <SectionHeader
          eyebrow="How We Protect Your Data"
          title="Backup & Recovery That's Monitored, Tested, and Ready"
          description="SeedTech uses NinjaOne Backup to provide cloud-based backup with active monitoring. Think of it as a time machine for your business — one that someone is actually watching."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {backupStack.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Backup vs DR */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Know the Difference
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Backup ≠ Disaster Recovery
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60 text-left">
            <p>
              <strong className="text-dark-base">Backup</strong> is a copy of your data. It answers the question:
              &quot;Can I get this file back?&quot;
            </p>
            <p>
              <strong className="text-dark-base">Disaster recovery</strong> is the documented, tested plan for getting your
              entire business back online after a major incident. It answers: &quot;How long until
              my team can work again?&quot;
            </p>
            <p>
              Most businesses we assess have some form of backup running. Almost none have a real
              DR plan — and fewer still have tested it.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 4 — SeedCare tier comparison */}
      <Section>
        <SectionHeader
          eyebrow="By SeedCare Tier"
          title="Backup & Recovery Features by Plan"
          description="Every SeedCare plan includes monitored cloud backup. Higher tiers add image-level recovery, comprehensive DR documentation, and quarterly testing."
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl liquid-glass overflow-hidden">
            <div className="grid grid-cols-4 border-b border-white/[0.06] px-6 py-3">
              <p className="text-xs font-semibold text-light-base/40 uppercase tracking-wider">Feature</p>
              <p className="text-xs font-semibold text-light-base/60 uppercase tracking-wider">Essentials</p>
              <p className="text-xs font-semibold text-seed-400 uppercase tracking-wider">Plus</p>
              <p className="text-xs font-semibold text-light-base/60 uppercase tracking-wider">Pro</p>
            </div>
            {tierComparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 px-6 py-4 ${i < tierComparison.length - 1 ? "border-b border-white/[0.03]" : ""}`}>
                <p className="text-body-sm text-light-base/70 font-medium">{row.feature}</p>
                <p className="text-body-sm text-light-base/40">{row.essentials}</p>
                <p className="text-body-sm text-seed-400/80">{row.plus}</p>
                <p className="text-body-sm text-light-base/40">{row.pro}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/services/managed-it/plans" className="text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors">
            Full plan comparison & pricing →
          </Link>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Backup & Disaster Recovery Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech protects business data across New Jersey — from medical practices in
            Morristown to trucking operations in Hopatcong. Your data is backed up, monitored,
            and recoverable.
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
        <SectionHeader title="Backup & Disaster Recovery — Frequently Asked Questions" align="left" />
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
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Proactive IT with backup included.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Prevent the incidents that require recovery.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Systems down? Immediate response.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free Backup Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Find out if your backups are actually running.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Is Your Business Data Protected?"
          description="Most businesses find out their backups aren't working after a disaster. Find out now — start with a free backup assessment."
          primaryLabel="Free Backup Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
