import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Headphones,
  Clock,
  Lock,
  Users,
  BarChart3,
  Zap,
  Monitor,
  Smartphone,
  Server,
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
  CheckList,
  AnimatedH1,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
export const generateMetadata = buildMetadata("/services/managed-it", {
  title: "Managed IT Services NJ | Proactive IT Support — SeedTech",
  description:
    "Proactive managed IT services in Northern New Jersey. Unlimited help desk, endpoint monitoring, cybersecurity & cloud backup. Per-user pricing, no contracts. Get a free quote.",
  ogTitle: "Managed IT Services NJ | Proactive IT Support — SeedTech",
  ogDescription:
    "Proactive managed IT services in Northern New Jersey. Unlimited help desk, endpoint monitoring, cybersecurity & cloud backup. Per-user pricing, no contracts.",
  canonical: "/services/managed-it",
});

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const features = [
  { icon: Headphones, title: "Unlimited Help Desk", body: "Remote support for every user on your team — no hourly billing. Call, email, or text." },
  { icon: Clock, title: "30-Minute Triage", body: "Critical issues triaged within 30 minutes. Most requests resolved same-day by someone who knows your environment." },
  { icon: Lock, title: "Cybersecurity Built In", body: "SentinelOne AI-driven endpoint security, antivirus management, patch management, and ransomware protection on every plan — always." },
  { icon: Users, title: "Per-User Pricing", body: "One flat rate per person covers one laptop and one desktop. Simple, predictable, no surprises." },
  { icon: BarChart3, title: "Transparent Reporting", body: "Monthly health reports covering tickets, response times, system status, and security posture. No black boxes." },
  { icon: Zap, title: "No Long-Term Contracts", body: "Month-to-month. We earn your business every billing cycle, not through lock-in or cancellation fees." },
];

const stackLayers = [
  { icon: Monitor, title: "NinjaOne RMM", body: "Central command — monitors device health and patches systems automatically, 24/7." },
  { icon: Shield, title: "SentinelOne", body: "AI-driven endpoint security that identifies and stops ransomware and zero-day threats instantly." },
  { icon: Server, title: "Cloud Backup", body: "Fast restore of individual files or entire system images. Your time machine when things go wrong." },
  { icon: Zap, title: "Custom Automation", body: "Advanced PowerShell scripts built for your specific environment to handle complex workflows and auto-remediation." },
  { icon: Smartphone, title: "Real-Time Alerting", body: "Critical alerts go straight to our technicians mobile devices — we often know about issues before you do." },
  { icon: PhoneCall, title: "Vendor Coordination", body: "We handle your ISPs, carriers, and software vendors so you never have to play phone tag again." },
];

const tiers = [
  {
    icon: Shield, name: "SeedCare Essentials", price: "$110", unit: "/user/mo",
    description: "Baseline protection for small teams.",
    features: ["Unlimited remote help desk", "Endpoint monitoring", "Patch management", "Antivirus (SentinelOne)", "30-day cloud backup"],
  },
  {
    icon: ShieldCheck, name: "SeedCare Plus", price: "$130", unit: "/user/mo",
    description: "Ops-ready coverage with proactive monitoring.", highlight: true,
    features: ["Everything in Essentials", "Up to 4 hrs/mo on-site", "Network monitoring", "50 GB cloud backup", "Vendor coordination", "Monthly health reports"],
  },
  {
    icon: ShieldPlus, name: "SeedCare Pro", price: "$160", unit: "/user/mo",
    description: "Full-service IT for growing organizations.",
    features: ["Everything in Plus", "Unlimited on-site support", "Unlimited cloud backup", "Quarterly vCIO sessions", "Hardware refresh planning", "Priority response"],
  },
];

const processSteps = [
  { step: "01", title: "Free Assessment", body: "We start with a 45-60 minute technical deep dive — users, devices, security posture, network, vendors. No commitment." },
  { step: "02", title: "Silent Deployment", body: "We push monitoring and security agents in the background during week 2. Zero disruption to your team." },
  { step: "03", title: "Go Live & Optimize", body: "Automations turn on, our techs get real-time alerts, and we fine-tune the experience with your team over 30 days." },
];

const faqs = [
  { q: "What does managed IT services include?", a: "Every SeedCare plan includes unlimited remote help desk, endpoint monitoring, patch management, antivirus management with SentinelOne, and cloud backup. Higher tiers add on-site support, network monitoring, vendor coordination, and strategic vCIO sessions." },
  { q: "How much does managed IT cost in New Jersey?", a: "SeedTech SeedCare plans start at $110 per user per month for Essentials, $130 for Plus, and $160 for Pro. Every plan is month-to-month with no long-term contracts. Use our pricing calculator for an instant quote." },
  { q: "What counts as a user or seat?", a: "One seat equals one person on your team. It covers all their devices — laptop, phone, monitors, peripherals. No device-counting headaches." },
  { q: "Do you require a long-term contract?", a: "No. Every SeedCare plan is month-to-month. We earn your business every billing cycle instead of locking you in. There are no cancellation fees." },
  { q: "How is SeedTech different from larger MSPs?", a: "You get people who know your environment — not whoever is free. We do not use L1/L2/L3 escalation tiers. The person who picks up your alert owns it through resolution. No ticket black holes, no revolving-door technicians." },
  { q: "How quickly can we get started?", a: "Most teams are fully onboarded within 5-10 business days. We follow a 4-week phased rollout — discovery, silent deployment, go-live, and optimization — designed to minimize disruption." },
  { q: "Do you support field workers and remote teams?", a: "Yes. Field crews get the same support as office staff, plus optional Mobile Device Management (MDM) for iOS, Android, and iPadOS devices at $12 per device per month." },
  { q: "What areas in New Jersey do you serve?", a: "SeedTech is based in Hopatcong, NJ and serves businesses throughout Northern New Jersey and the NYC metro area. Remote support is available nationwide." },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed IT Services",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "moliva@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Proactive managed IT services including unlimited help desk, endpoint monitoring, cybersecurity, cloud backup, and vendor coordination. Per-user pricing, no contracts.",
  offers: { "@type": "AggregateOffer", lowPrice: "110", highPrice: "160", priceCurrency: "USD", offerCount: "3" },
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
    { "@type": "ListItem", position: 2, name: "Services", item: "https://seedtechllc.com/services" },
    { "@type": "ListItem", position: 3, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ManagedITPage() {
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
            <Link href="/services" className="hover:text-light-base/50 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-light-base/60">Managed IT</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Managed IT Services in Northern NJ</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Services"]} className="mb-6 max-w-4xl">
            Proactive Managed IT Services for Growing Businesses
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            24/7 monitoring, unlimited help desk, and rapid on-site response — all for one flat
            monthly rate per user. No contracts, no hidden fees, no ticket limits.
            Trusted by small and mid-size businesses across New Jersey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200">
              Free IT Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <Section>
        <SectionHeader eyebrow="What's Included" title="Everything You Need, Nothing You Don't" description="Every SeedCare plan ships with the core protections your business needs — no nickel-and-diming, no surprise invoices." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <LiquidGlassCard key={f.title} className="p-7">
              <IconBox icon={f.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{f.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{f.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Why SeedTech */}
      <Section theme="light">
        <SectionHeader eyebrow="Why SeedTech" title="Built for Accountability, Not Volume" description="Most IT vendors wait for employees to report problems. At SeedTech, we monitor proactively — often resolving issues before your team ever notices." theme="light" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8">
            <h3 className="font-display text-card-title text-red-700 mb-5">Large Firms Operate in Tiers</h3>
            <ul className="space-y-3">
              {["No proactive monitoring — employees must report issues", "Submit a request and wait for a response", "Issue assigned to next available technician", "Fix applied after downtime already occurs"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-red-600/80">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8">
            <h3 className="font-display text-card-title text-emerald-700 mb-5">Our Structure is Simpler</h3>
            <ul className="space-y-3">
              {["Proactive monitoring — we often catch it before you do", "Fast response — no ticket queue, no waiting", "Handled by someone who knows your environment", "Downtime prevented, not just repaired"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-emerald-700/80">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-center text-body-lg text-dark-base/60 italic max-w-2xl mx-auto mb-6">
          &ldquo;You don&apos;t get &lsquo;whoever is free.&rsquo; You get people who know your environment.&rdquo;
        </p>
        <div className="text-center">
          <Link href="/services/managed-it/why-seedtech" className="inline-flex items-center gap-2 text-seed-600 font-medium text-sm hover:text-seed-700 transition-colors">
            Learn why our model works <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* Support Stack */}
      <Section>
        <SectionHeader eyebrow="The Stack" title="How We Keep You Running" description="Enterprise-grade tools, managed by people who know your environment. Every layer works together to detect, defend, and resolve — automatically." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackLayers.map((layer) => (
            <LiquidGlassCard key={layer.title} className="p-7">
              <IconBox icon={layer.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{layer.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{layer.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section theme="light">
        <SectionHeader eyebrow="How It Works" title="From Assessment to Fully Managed in 30 Days" description="A phased transition designed for zero disruption. We do the heavy lifting in the background." theme="light" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((s) => (
            <div key={s.step} className="relative">
              <span className="font-display text-[4rem] leading-none text-seed-600/15 absolute -top-2 -left-1">{s.step}</span>
              <div className="pt-14">
                <h3 className="font-display text-card-title text-dark-base mb-3">{s.title}</h3>
                <p className="text-body-sm text-dark-base/60 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/services/managed-it/onboarding" className="inline-flex items-center gap-2 text-seed-600 font-medium text-sm hover:text-seed-700 transition-colors">
            See the full onboarding timeline <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section>
        <SectionHeader eyebrow="SeedCare Plans" title="Choose Your Coverage" description="Three tiers to match your team size and support needs. All include unlimited remote help desk. Plans are month-to-month and can be mixed and matched." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <LiquidGlassCard key={tier.name} className={`p-6 flex flex-col ${tier.highlight ? "liquid-glass-tinted-seed" : ""}`}>
              {tier.highlight && <LiquidGlassPill variant="seed" size="sm" className="self-start mb-4">Most Popular</LiquidGlassPill>}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center">
                  <tier.icon className="w-5 h-5 text-seed-400" />
                </div>
                <h3 className="font-display text-card-title text-white">{tier.name}</h3>
              </div>
              <p className="text-body-sm text-light-base/50 mb-4">{tier.description}</p>
              <div className="mb-5">
                <span className="font-display text-heading text-seed-400">{tier.price}</span>
                <span className="text-body-sm text-light-base/40">{tier.unit}</span>
              </div>
              <CheckList theme="dark" items={tier.features} className="mb-6 flex-1" />
              <Link href="/services/managed-it/plans" className={`w-full text-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${tier.highlight ? "liquid-glass-tinted-seed liquid-glass-hover text-white" : "liquid-glass text-white"}`}>
                Compare Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </LiquidGlassCard>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <Link href="/services/managed-it/plans" className="text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors">Full plan comparison & pricing calculator →</Link>
          <Link href="/services/managed-it/mobile-device-management" className="text-light-base/40 hover:text-light-base/60 text-sm transition-colors">MDM add-on from $12/device/mo →</Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader eyebrow="FAQ" title="Common Questions About Managed IT" description="Everything you need to know before getting started with SeedCare." align="left" theme="light" />
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
        <CTABanner title="Ready to Simplify Your IT?" description="Get a custom quote in under 60 seconds — or schedule a free IT assessment with our team." primaryLabel="Get Instant Quote" primaryHref="/services/managed-it/plans" secondaryLabel="Free IT Assessment" secondaryHref="/services/managed-it/assessment" />
      </Section>
    </div>
  );
}
