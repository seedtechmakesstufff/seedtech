import { Stethoscope, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";

export const metadata = {
  title: "Technology & Websites for Medical Practices — SeedTech",
  description:
    "SeedTech builds patient-friendly websites, appointment integrations, and HIPAA-aware IT infrastructure for medical clinics and healthcare providers.",
};

export default function MedicalPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Stethoscope className="w-3.5 h-3.5 inline mr-1.5" />
            Medical Practices
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Medical", "Practices"]} delay={0.15}>
            Technology & Websites for Medical Practices
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            Healthcare providers need reliable technology to manage patient communications, protect sensitive data, and maintain a professional online presence.
            SeedTech helps clinics and practices build secure digital infrastructure.
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
          title="Technology for Healthcare Providers"
          description="Secure, reliable technology built around the unique compliance and operational needs of medical practices."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Patient-Friendly Websites", body: "Clean, accessible websites that make it easy for patients to learn about your practice, find locations, and book appointments." },
            { title: "Appointment Integrations", body: "Connect your website with scheduling platforms like Zocdoc, SimplePractice, or custom booking systems." },
            { title: "HIPAA-Aware Infrastructure", body: "IT systems configured with patient data protection in mind — access controls, encrypted storage, and audit logging." },
            { title: "Secure Email Systems", body: "Business email with encryption and access controls that keep patient communications protected." },
            { title: "IT Support for Clinics", body: "Proactive monitoring and responsive help desk support for medical offices — so your team stays focused on patients, not technology." },
            { title: "Cybersecurity & Compliance", body: "Security policies and technical controls that support your practice in meeting data protection and compliance requirements." },
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
          title="Ready to Protect Your Practice&apos;s Technology?"
          description="Get a free technology and website audit for your medical practice or clinic."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
