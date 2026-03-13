import Link from "next/link";
import { ArrowRight, Search, FileText, Target } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  GradientText,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CardTitle,
  Body,
  CheckList,
  GlassCard,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

const channels = [
  {
    icon: Search,
    label: "SEO",
    title: "Search Engine Optimization",
    description:
      "Rank higher in Google for the searches that matter to your business. Local, national, and technical SEO.",
    features: ["Keyword research & strategy", "On-page & technical SEO", "Local SEO & Google Business", "Content optimization", "Link building"],
  },
  {
    icon: FileText,
    label: "Content",
    title: "Content Strategy",
    description:
      "Content that earns trust, builds authority, and drives organic traffic. Blog posts, landing pages, and more.",
    features: ["Content calendar planning", "Blog & article writing", "Landing page copy", "Email newsletters", "Social media content"],
  },
  {
    icon: Target,
    label: "Paid Ads",
    title: "Paid Advertising",
    description:
      "Google and Meta ads managed for maximum ROI. We optimize every campaign around your actual business metrics.",
    features: ["Google Search & Display ads", "Meta (Facebook/Instagram) ads", "Retargeting campaigns", "A/B testing", "Conversion tracking"],
  },
];

const stats = [
  { value: "3×", label: "Average Traffic Growth" },
  { value: "Top 3", label: "Local Rankings Achieved" },
  { value: "60%", label: "Avg. Cost-Per-Lead Reduction" },
  { value: "45+", label: "Active Marketing Clients" },
];

export default function MarketingPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 left-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Digital Marketing</LiquidGlassPill>
          <h1 className="font-display text-title md:text-display text-white leading-[1.05] mb-6 max-w-3xl">
            Data-Driven{" "}
            <GradientText as="span">Marketing</GradientText>
          </h1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            SEO, content strategy, and paid advertising that compounds over time — built around
            your actual business goals, not vanity metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden"
            >
              Get a Free Strategy Call <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200"
            >
              See Our Results
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <LiquidGlassCard key={stat.label} className="p-6 text-center">
              <p className="font-display text-stat-number text-white mb-1">{stat.value}</p>
              <p className="text-body-sm text-light-base/50">{stat.label}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Channels */}
      <Section theme="dark">
        <SectionHeader
          eyebrow="What We Offer"
          title="Full-Funnel Marketing"
          description="From organic search to paid acquisition — we manage every channel that moves your business forward."
        />
        <div className="space-y-6">
          {channels.map((ch) => (
            <LiquidGlassCard key={ch.title} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <IconBox icon={ch.icon} variant="gradient" />
                    <LiquidGlassPill variant="seed" size="sm">{ch.label}</LiquidGlassPill>
                  </div>
                  <h3 className="font-display text-subheading text-white mb-3">{ch.title}</h3>
                  <Body className="text-light-base/60 leading-relaxed">{ch.description}</Body>
                </div>
                <CheckList theme="dark" items={ch.features} />
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How It Works"
          title="Strategy First, Always"
          description="We start with your goals — not a template. Every campaign is built from scratch around what makes your business grow."
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Discovery & Audit", body: "We audit your current SEO, ads, and content. We find the gaps and the quick wins before we spend a dollar." },
            { step: "02", title: "Strategy & Build", body: "We build your custom marketing roadmap — channels, content plan, ad targets, and KPIs that tie directly to revenue." },
            { step: "03", title: "Execute & Optimize", body: "We launch, measure, and iterate every week. Monthly reports keep you in the loop with no jargon — just results." },
          ].map((item) => (
            <GlassCard key={item.step} theme="light" className="p-8">
              <span className="font-display text-stat-number text-seed-600/20 block mb-4">{item.step}</span>
              <CardTitle className="text-dark-base mb-3">{item.title}</CardTitle>
              <Body className="text-dark-base/60 leading-relaxed">{item.body}</Body>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Grow Your Visibility?"
          description="Let's build a marketing strategy as unique as your business. Free consultation, zero commitment."
          primaryLabel="Get a Free Strategy Call"
          primaryHref="/contact"
          secondaryLabel="See Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
