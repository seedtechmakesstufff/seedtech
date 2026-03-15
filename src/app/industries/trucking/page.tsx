import { Truck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";

export const metadata = {
  title: "Technology & Websites for Trucking Companies — SeedTech",
  description:
    "SeedTech builds fleet recruiting websites, driver application portals, and provides IT support for trucking and logistics companies across New Jersey and nationwide.",
};

export default function TruckingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Truck className="w-3.5 h-3.5 inline mr-1.5" />
            Trucking & Logistics
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Trucking", "Companies"]} delay={0.15}>
            Technology & Websites Built for Trucking Companies
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            Trucking companies depend on reliable technology to manage logistics, compliance, dispatch operations, and recruiting.
            SeedTech helps trucking companies modernize their online presence while ensuring their IT systems remain secure and operational.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/free-audit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-seed-600 to-seed-500 text-white font-medium hover:shadow-glowSeed transition-all duration-200"
            >
              Get a Free Technology Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl liquid-glass text-white font-medium transition-all duration-200"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Key Services */}
      <Section>
        <SectionHeader
          eyebrow="What We Build"
          title="Technology Solutions for Trucking"
          description="From driver recruiting to dispatch integrations — we build and manage the technology that keeps your fleet running."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Fleet Recruiting Websites", body: "Mobile-first websites built to attract and convert driver applications. Integrated with your ATS and optimized for CDL-A job searches." },
            { title: "Driver Application Portals", body: "Custom online application flows that capture driver info, DOT history, and certifications — reducing paperwork and admin overhead." },
            { title: "Dispatch Software Integrations", body: "Connect your website and backend systems with dispatch platforms like Samsara, KeepTruckin, or custom APIs." },
            { title: "IT Support for Operations", body: "Proactive monitoring, help desk support, and cybersecurity for your office and remote dispatchers." },
            { title: "Cybersecurity Protection", body: "Protect sensitive DOT data, driver records, and financial information from breaches and ransomware." },
            { title: "Email & Communication Security", body: "Secure business email, phishing protection, and spam filtering for your entire organization." },
          ].map((item) => (
            <LiquidGlassCard key={item.title} className="p-6 flex flex-col gap-3">
              <CheckCircle2 className="w-5 h-5 text-seed-400" />
              <h3 className="font-display text-card-title text-white">{item.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{item.body}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Modernize Your Trucking Operation?"
          description="Get a free technology and website audit tailored to trucking companies."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="View Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
