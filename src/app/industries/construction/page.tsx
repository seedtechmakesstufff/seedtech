import { HardHat, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";

export const metadata = {
  title: "Technology Solutions for Construction & Rigging Companies — SeedTech",
  description:
    "SeedTech builds project showcase websites, bid submission portals, and provides IT support for construction and rigging companies in New Jersey and nationwide.",
};

export default function ConstructionPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">
            <HardHat className="w-3.5 h-3.5 inline mr-1.5" />
            Construction & Rigging
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Construction", "Rigging", "Companies"]} delay={0.15}>
            Technology Solutions for Construction & Rigging Companies
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            Construction companies need reliable technology to support project management, field operations, and client acquisition.
            SeedTech helps construction firms build professional websites and maintain secure, dependable IT systems.
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
          title="Technology for Construction Firms"
          description="From project showcases to jobsite technology — we build and manage what your operation needs to win more business."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Project Showcase Websites", body: "Professional portfolio sites that showcase your completed work and help you win more bids from commercial and residential clients." },
            { title: "Bid Submission Portals", body: "Custom portals that streamline the bid process — collect project specs, timelines, and client info in one place." },
            { title: "Field Communication Systems", body: "Tools and integrations that keep your office and field teams in sync — from daily reports to document sharing." },
            { title: "Secure Cloud Infrastructure", body: "Cloud storage, backups, and remote access systems that protect your drawings, contracts, and client data." },
            { title: "Jobsite Technology Support", body: "IT support for tablets, laptops, and connected devices used on job sites — so downtime never delays a project." },
            { title: "Cybersecurity for Contractors", body: "Protect sensitive contract data, insurance certificates, and client communications from breaches." },
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
          title="Ready to Build a Stronger Online Presence?"
          description="Get a free technology and website audit for your construction or rigging company."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="View Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
