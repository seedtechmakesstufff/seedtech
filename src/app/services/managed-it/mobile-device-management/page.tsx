import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  Smartphone,
  Lock,
  AppWindow,
  ShieldCheck,
  BarChart3,
  Wifi,
  Tablet,
  CheckCircle2,
  HelpCircle,
  Truck,
  Building,
  Briefcase,
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
  AnimatedH1,
  AnimatedH2,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { mdmAddon } from "@/lib/plans";

export const generateMetadata = buildMetadata("/services/managed-it/mobile-device-management");

const capabilities = [
  { icon: Lock, title: "Remote Lock & Wipe", body: "Lost or stolen device? Lock it instantly or wipe all company data remotely. Protect sensitive information even when hardware is compromised." },
  { icon: AppWindow, title: "App Deployment & Control", body: "Push approved apps to devices automatically. Block unauthorized installations. Ensure every device has the tools it needs — nothing more." },
  { icon: ShieldCheck, title: "Security & Compliance Policies", body: "Enforce password requirements, encryption, screen lock timeouts, and OS update policies. Stay compliant with industry frameworks automatically." },
  { icon: BarChart3, title: "Inventory & Reporting", body: "Real-time dashboard showing every managed device, its status, installed apps, OS version, and compliance state. Full visibility at a glance." },
  { icon: Wifi, title: "Wi-Fi & VPN Configuration", body: "Pre-configure Wi-Fi networks and VPN profiles so devices connect securely to company resources without manual user setup." },
  { icon: Tablet, title: "Multi-Platform Support", body: "Full support for iOS, iPadOS, and Android. Manage phones, tablets, and ruggedized field devices from a single console." },
];

const useCases = [
  { icon: Truck, title: "Field Crews & Drivers", body: "Secure tablets and phones for technicians, delivery drivers, and field workers. Push job apps, enforce GPS policies, and wipe devices instantly if lost on-site." },
  { icon: Building, title: "Office & Hybrid Teams", body: "Manage BYOD and company-issued phones. Separate personal and corporate data with containerization. Enforce security without invading personal space." },
  { icon: Briefcase, title: "Executives & Sales", body: "Protect high-value devices carrying sensitive client data, CRM access, and email. Ensure encryption, remote wipe capability, and compliance at all times." },
];

const faqs = [
  { q: "What devices are supported?", a: "We support iOS, iPadOS, and Android devices. This includes iPhones, iPads, Samsung, Google Pixel, and ruggedized devices from manufacturers like Zebra and Honeywell." },
  { q: "Can I add MDM to any SeedCare plan?", a: "Yes. MDM is a $12/device/month add-on available on all three SeedCare tiers. There is no minimum device count." },
  { q: "Do employees need to do anything?", a: "Enrollment is simple — we send a link or QR code. The employee taps to enroll and the device is configured automatically within minutes." },
  { q: "What about personal devices (BYOD)?", a: "We use containerization to separate work data from personal data. We can manage and wipe corporate data without touching personal photos, messages, or apps." },
  { q: "How fast can a lost device be wiped?", a: "Immediately. A remote wipe command can be issued from the console and executes as soon as the device connects to any network — typically within seconds." },
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
    { "@type": "ListItem", position: 3, name: "Mobile Device Management", item: "https://seedtechllc.com/services/managed-it/mobile-device-management" },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mobile Device Management (MDM)",
  provider: {
    "@type": "Organization",
    name: "SeedTech LLC",
    url: "https://seedtechllc.com",
  },
  description: "Mobile device management for iOS, iPadOS, and Android. Remote lock/wipe, app deployment, compliance policies, and reporting.",
  areaServed: { "@type": "State", name: "New Jersey" },
  offers: {
    "@type": "Offer",
    price: "12",
    priceCurrency: "USD",
    unitText: "per device per month",
  },
};

export default function MDMPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services/managed-it" className="hover:text-light-base/50 transition-colors">Managed IT</Link>
            <span>/</span>
            <span className="text-light-base/60">Mobile Device Management</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">SeedCare Add-On</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Mobile", "Device", "Management"]} className="mb-6 max-w-4xl">
            Mobile Device Management for Small Business
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-4">
            Secure and manage every phone and tablet in your fleet. Remote lock &amp; wipe, app
            deployment, compliance enforcement, and full visibility — from a single console.
          </p>
          <div className="flex items-baseline gap-3 mb-10">
            <span className="text-title font-display text-white">${mdmAddon.pricePerDevice}</span>
            <span className="text-body text-light-base/40">/device/month</span>
            <span className="text-body-sm text-light-base/30 ml-2">• No minimum • No contract</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Add MDM to Your Plan <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link href="/services/managed-it/plans" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200">
              See All SeedCare Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Capabilities"
          title="Everything You Need to Manage Mobile Devices"
          description="From security enforcement to app deployment — full lifecycle management for every device in your fleet."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center mb-4">
                <cap.icon className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base mb-2">{cap.title}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{cap.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Use Cases */}
      <Section>
        <SectionHeader
          eyebrow="Use Cases"
          title="Built for Real-World Teams"
          description="Whether your team is in the office, on the road, or in the field — MDM keeps every device secure and productive."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc) => (
            <LiquidGlassCard key={uc.title} className="p-8">
              <IconBox icon={uc.icon} className="text-seed-400 mb-5" />
              <h3 className="font-display text-card-title text-white mb-3">{uc.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{uc.body}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Platforms */}
      <Section theme="light">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow uppercase tracking-widest mb-4 text-seed-600">Supported Platforms</p>
          <AnimatedH2 className="font-display text-heading md:text-heading-lg text-dark-base mb-8">
            iOS • iPadOS • Android
          </AnimatedH2>
          <p className="text-body text-dark-base/60 max-w-xl mx-auto mb-8">
            Manage iPhones, iPads, Samsung Galaxy, Google Pixel, and ruggedized devices from
            manufacturers like Zebra and Honeywell — all from one dashboard.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "iPhone & iPad", desc: "Full Apple MDM with supervised mode, DEP, and VPP support" },
              { name: "Android Enterprise", desc: "Work profiles, fully managed, and dedicated device modes" },
              { name: "Ruggedized Devices", desc: "Zebra, Honeywell, and other field-grade hardware" },
            ].map((p) => (
              <div key={p.name} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
                <Smartphone className="w-6 h-6 text-seed-600 mb-3 mx-auto" />
                <h3 className="font-display text-card-title text-dark-base mb-2">{p.name}</h3>
                <p className="text-body-sm text-dark-base/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Quick Features List */}
      <Section>
        <SectionHeader eyebrow="At a Glance" title="MDM Features Included" />
        <div className="max-w-2xl mx-auto space-y-3">
          {mdmAddon.features.map((f) => (
            <div key={f} className="flex items-center gap-4 p-4 liquid-glass rounded-xl">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <p className="text-body-sm text-light-base/70">{f}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader eyebrow="FAQ" title="MDM Questions, Answered" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 mt-0.5 shrink-0 text-seed-600" />
                {faq.q}
              </h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Secure Every Device in Your Fleet"
          description="Add MDM to any SeedCare plan for $12/device/month. No minimums, no contracts."
          primaryLabel="Build Your Quote"
          primaryHref="/contact"
          secondaryLabel="See All Plans"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
