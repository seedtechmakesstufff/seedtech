import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { ArrowRight, Truck, HardHat, Scale, Stethoscope } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill } from "@/components/kit";
import { CTABanner } from "@/components/kit";

export const generateMetadata = buildMetadata("/industries", {
  title: "Industry Solutions",
  description:
    "SeedTech specializes in technology solutions for trucking, construction, law firms, and medical practices. Websites, IT support, and cybersecurity built for your industry.",
  canonical: "/industries",
});

const industries = [
  {
    icon: Truck,
    slug: "trucking",
    name: "Trucking & Logistics",
    headline: "Technology & Websites Built for Trucking Companies",
    summary:
      "Fleet recruiting websites, driver portals, dispatch integrations, and secure IT for logistics operations.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: HardHat,
    slug: "construction",
    name: "Construction & Rigging",
    headline: "Technology Solutions for Construction & Rigging Companies",
    summary:
      "Project showcase websites, bid portals, field communication systems, and secure cloud infrastructure.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Scale,
    slug: "law-firms",
    name: "Law Firms",
    headline: "Technology & Websites for Modern Law Firms",
    summary:
      "Attorney profile websites, case intake forms, secure document systems, and cybersecurity compliance.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Stethoscope,
    slug: "medical",
    name: "Medical Practices",
    headline: "Technology & Websites for Medical Practices",
    summary:
      "Patient-friendly websites, appointment integrations, HIPAA-aware infrastructure, and secure email.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export default function IndustriesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">Industry Solutions</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Industry"]} delay={0.15}>
            Built for Your Industry
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            We don&apos;t build generic websites or deploy cookie-cutter IT solutions.
            We specialize in four industries where reliability and professionalism matter most.
          </p>
        </div>
      </section>

      {/* Industry cards */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group rounded-3xl border border-white/[0.08] bg-dark-elevated p-8 flex flex-col gap-5 hover:border-white/[0.16] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${ind.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${ind.color}`} />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${ind.color}`}>
                    {ind.name}
                  </p>
                  <h2 className="font-display text-heading text-white leading-snug group-hover:text-seed-300 transition-colors">
                    {ind.headline}
                  </h2>
                </div>
                <p className="text-body text-light-base/50 leading-relaxed">{ind.summary}</p>
                <div className="mt-auto flex items-center gap-2 text-seed-400 text-sm font-medium">
                  View Solutions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Don&apos;t See Your Industry?"
          description="We work with businesses across all sectors. If you need reliable technology and a professional website, we can help."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
