import { Scale, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";

export const metadata = {
  title: "Technology & Websites for Law Firms — SeedTech",
  description:
    "SeedTech builds attorney profile websites, case intake forms, and provides secure IT infrastructure and cybersecurity compliance for law firms.",
};

export default function LawFirmsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Scale className="w-3.5 h-3.5 inline mr-1.5" />
            Law Firms
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Modern", "Law", "Firms"]} delay={0.15}>
            Technology & Websites for Modern Law Firms
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            Law firms require professional digital presence, strong cybersecurity, and dependable IT infrastructure.
            SeedTech provides secure technology solutions designed specifically for legal practices.
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
          title="Technology for Legal Practices"
          description="Professional websites and secure infrastructure built for the unique demands of a law practice."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Attorney Profile Websites", body: "Professional, conversion-optimized websites that establish credibility and generate qualified client inquiries." },
            { title: "Case Intake Forms", body: "Secure online intake forms that capture new client information and integrate with your case management software." },
            { title: "Secure Document Systems", body: "Cloud-based document storage and sharing systems with access controls and audit trails for client files." },
            { title: "Cybersecurity Compliance", body: "Security policies and technical controls that align with bar association requirements and client data protection standards." },
            { title: "Email Protection", body: "Business-grade email with phishing protection, encryption, and archiving to protect privileged communications." },
            { title: "IT Support for Your Firm", body: "Responsive help desk and proactive monitoring so your attorneys and staff are never blocked by technology issues." },
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
          title="Ready to Secure Your Firm&apos;s Technology?"
          description="Get a free technology and website audit designed for legal practices."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
