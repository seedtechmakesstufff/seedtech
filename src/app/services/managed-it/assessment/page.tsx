import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Search,
  ShieldAlert,
  Server,
  Wifi,
  FileText,
  CheckCircle2,
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
  AnimatedH1,
  AnimatedH2,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

export const metadata: Metadata = {
  title: "Free IT Assessment | Network & Security Audit — SeedTech",
  description:
    "Get a free 45-60 minute IT assessment for your business. We evaluate your network, security, backup, and compliance posture — then deliver a clear action plan. Northern NJ.",
  openGraph: {
    title: "Free IT Assessment | SeedTech",
    description:
      "Free 45-60 minute IT assessment. We audit your network, security, and backups — then deliver a clear action plan.",
    url: "https://seedtechllc.com/services/managed-it/assessment",
    type: "website",
  },
  alternates: { canonical: "https://seedtechllc.com/services/managed-it/assessment" },
};

const auditAreas = [
  { icon: Server, title: "Infrastructure Review", body: "Full inventory of workstations, servers, network devices, and cloud services. We document what you have and flag what is outdated." },
  { icon: ShieldAlert, title: "Security Posture", body: "We check endpoint protection, firewall rules, password policies, MFA status, and attack surface. You will know exactly where you are exposed." },
  { icon: Wifi, title: "Network Health", body: "Assessment of bandwidth, Wi-Fi coverage, switch/router firmware, and VLAN segmentation. We identify bottlenecks and single points of failure." },
  { icon: FileText, title: "Backup & Recovery", body: "We verify your backup coverage, retention policies, and recovery time. If your backups would fail a real disaster, we will tell you." },
  { icon: ClipboardCheck, title: "Compliance Readiness", body: "Depending on your industry, we review alignment with frameworks like HIPAA, PCI-DSS, or CMMC. We flag gaps and recommend next steps." },
  { icon: Search, title: "Vendor & Licensing Audit", body: "We look at your Microsoft 365 licensing, ISP contracts, and any other vendors to identify waste or under-utilization." },
];

const processSteps = [
  { num: "01", title: "Schedule a Call", body: "Reach out through the form below or call us directly. We will find a time that works for your team — typically within 48 hours." },
  { num: "02", title: "Deep-Dive Assessment", body: "A 45-60 minute session covering infrastructure, security, backups, compliance, and vendor landscape. No sales pitch — just analysis." },
  { num: "03", title: "Written Report & Roadmap", body: "Within 5 business days, you get a detailed written report with prioritized findings and a clear action plan. Yours to keep, no strings attached." },
];

const faqs = [
  { q: "How long does the assessment take?", a: "The core session is 45-60 minutes. You will receive a written report within 5 business days. Total time investment from your team is about an hour." },
  { q: "Is this really free?", a: "Yes. No contracts, no obligations. We deliver a genuine assessment because when businesses see the gaps, they usually want help closing them." },
  { q: "Do you need access to our systems?", a: "For a thorough assessment, limited read-only access to your admin consoles helps. But we can do a significant portion based on conversation and documentation alone." },
  { q: "What if we decide not to use SeedTech?", a: "The report is yours. Use it with your current provider or another vendor. We would rather build trust than pressure you." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
    { "@type": "ListItem", position: 3, name: "Free Assessment", item: "https://seedtechllc.com/services/managed-it/assessment" },
  ],
};

export default function AssessmentPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services/managed-it" className="hover:text-light-base/50 transition-colors">Managed IT</Link>
            <span>/</span>
            <span className="text-light-base/60">Free Assessment</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Zero-Obligation IT Audit</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Free", "IT", "Assessment"]} className="mb-6 max-w-4xl">
            Get a Free IT Assessment for Your Business
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            In 45-60 minutes, we evaluate your infrastructure, security, backups, and compliance
            posture. You receive a written report with prioritized findings and a clear action plan —
            no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Schedule Your Free Assessment <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link href="tel:+19734320143" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200">
              <PhoneCall className="w-4 h-4" /> Call (973) 432-0143
            </Link>
          </div>
        </div>
      </section>

      {/* What We Audit */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Cover"
          title="A Thorough Look at Your Entire IT Environment"
          description="Our assessment covers six key areas to give you a complete picture of where you stand and where you are vulnerable."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditAreas.map((area) => (
            <div key={area.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center mb-4">
                <area.icon className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base mb-2">{area.title}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{area.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeader
          eyebrow="How It Works"
          title="Three Steps to Clarity"
          description="From first call to written report — here is exactly what to expect."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {processSteps.map((step) => (
            <LiquidGlassCard key={step.num} className="p-8 text-center">
              <div className="w-12 h-12 rounded-2xl liquid-glass-tinted-seed flex items-center justify-center mx-auto mb-5">
                <span className="font-display text-card-title text-white">{step.num}</span>
              </div>
              <h3 className="font-display text-card-title text-white mb-3">{step.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{step.body}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Urgency / Stats */}
      <Section theme="light">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow uppercase tracking-widest mb-4 text-seed-600">Why Now?</p>
          <AnimatedH2 className="font-display text-heading md:text-heading-lg text-dark-base mb-8">
            Most Businesses Don&apos;t Know Their Gaps Until It&apos;s Too Late
          </AnimatedH2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { stat: "60%", label: "of small businesses close within 6 months of a major cyberattack" },
              { stat: "43%", label: "of cyberattacks target small and mid-size businesses" },
              { stat: "51%", label: "of SMBs have no cybersecurity plan in place at all" },
            ].map((s) => (
              <div key={s.stat} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
                <p className="text-display font-display text-dark-base mb-2">{s.stat}</p>
                <p className="text-body-sm text-dark-base/50">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-body text-dark-base/60">
            A free assessment is the fastest way to find out where you are exposed —
            before a breach or outage forces the conversation.
          </p>
        </div>
      </Section>

      {/* What You Get */}
      <Section>
        <SectionHeader eyebrow="Deliverables" title="What You Walk Away With" />
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            "Detailed written report covering all six audit areas",
            "Prioritized list of vulnerabilities ranked by severity",
            "Clear action plan with recommended next steps",
            "Cost estimate for remediation (if applicable)",
            "No obligations — the report is yours to keep",
          ].map((item) => (
            <div key={item} className="flex items-start gap-4 p-4 liquid-glass rounded-xl">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-body-sm text-light-base/70">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader eyebrow="FAQ" title="Assessment Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Find Out Where You Stand"
          description="Schedule your free IT assessment today. No contracts, no obligations — just clarity."
          primaryLabel="Schedule Assessment"
          primaryHref="/contact"
          secondaryLabel="See Our Plans"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
