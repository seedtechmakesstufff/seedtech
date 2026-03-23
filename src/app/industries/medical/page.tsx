import { Stethoscope, CheckCircle2, ArrowRight, Search, Brain, FileText, BarChart3, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Technology & Websites for Medical Practices — SeedTech",
  description:
    "SeedTech builds patient-friendly websites, appointment integrations, and HIPAA-aware IT infrastructure for medical clinics and healthcare providers.",
};

export default function MedicalPage() {
  return (
    <div>
      <ServiceJsonLd
        name="IT Services for Medical Practices"
        description="HIPAA-compliant managed IT, EHR integrations, telemedicine support, cybersecurity, and custom websites for medical practices and healthcare providers."
        url="https://seedtechllc.com/industries/medical"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: "Medical", url: "/industries/medical" },
        ]}
      />
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
            { title: "Secure Email Systems", body: "Secure business email — through Microsoft 365 or Google Workspace — with encryption and access controls that keep patient communications protected." },
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

      {/* SEO Autopilot */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Built-In SEO"
          title="Your website comes with an"
          titleHighlight="SEO command center."
          description="Every SeedTech site includes our proprietary SEO Autopilot system — live keyword rankings, AI-powered content generation, and automated search engine optimization. No agency retainer. No third-party subscriptions."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Search,
              title: "Live Keyword Rankings",
              body: "See where your practice ranks on Google for terms like \"dermatologist near me\" or \"primary care doctor Hopatcong NJ\" — updated in real time from Search Console.",
            },
            {
              icon: Brain,
              title: "AI SEO Advisor",
              body: "Ask any question — \"How do I rank for pediatric urgent care?\" — and get specific, data-backed recommendations using your actual traffic and ranking data.",
            },
            {
              icon: FileText,
              title: "AI Blog Writer",
              body: "Generate SEO-optimized patient education content — procedure explainers, health tips, provider spotlights. Publish in minutes, not weeks.",
            },
            {
              icon: BarChart3,
              title: "Performance Audits",
              body: "One-click Core Web Vitals and PageSpeed audits. Know exactly what Google sees when it evaluates your site — and what to fix first.",
            },
            {
              icon: Zap,
              title: "Instant Indexing",
              body: "New provider profile or service page? One click notifies search engines instantly via IndexNow — no waiting for crawlers to discover it.",
            },
            {
              icon: Sparkles,
              title: "Your Practice, Your Voice",
              body: "The AI knows your specialties, providers, patient demographics, and compliance requirements. You control the business context that drives every recommendation.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">{item.title}</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <p className="text-body-sm text-dark-base/45 leading-relaxed">
            Most medical practice websites are static brochures. Yours comes with a full SEO engine — keyword tracking that replaces $300/mo tools, an AI strategist that replaces agency retainers, and a content system that turns one keyword into a published article in minutes.
          </p>
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
