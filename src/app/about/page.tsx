import { Shield, Globe, Zap, Heart, Users } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  GlassCard,
  CardTitle,
  Body,
  LiquidGlassPill,
  LiquidGlassCard,
  CTABanner,
  IconBox,
  CheckList,
  AnimatedH1,
  AnimatedH2,
} from "@/components/kit";

const values = [
  {
    icon: Heart,
    title: "We Give a Damn",
    body: "We're personally invested in every client's success. Your wins are our wins — and we treat every business like it's our own.",
  },
  {
    icon: Zap,
    title: "Speed Without Shortcuts",
    body: "Fast response times and quick turnarounds, but never at the expense of quality. We do things right the first time.",
  },
  {
    icon: Users,
    title: "Long-Term Partnerships",
    body: "We don't disappear after launch. Our clients stay with us for years because we're always showing up and leveling up their tech.",
  },
];

const stats = [
  { value: "200+", label: "Businesses Served" },
  { value: "99.9%", label: "Uptime Delivered" },
  { value: "15+", label: "Years of Experience" },
  { value: "48hr", label: "Avg. Issue Resolution" },
];

const whatWeDo = [
  "Managed IT support & monitoring",
  "Custom web development",
  "Cloud infrastructure & backups",
  "Cybersecurity & endpoint protection",
  "vCIO strategy consulting",
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 left-0 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">About SeedTech</LiquidGlassPill>
          <AnimatedH1 highlightWords={["SeedTech"]} className="mb-6 max-w-3xl">
            The Team Behind SeedTech
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed">
            We&apos;re a tight-knit crew of engineers, designers, and strategists based in New Jersey —
            passionate about helping businesses grow through technology done right.
          </p>
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

      {/* Story */}
      <Section theme="dark">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <LiquidGlassPill variant="default" className="mb-5">Our Story</LiquidGlassPill>
            <AnimatedH2
              className="font-display text-heading md:text-title text-white mb-6"
              highlightWords={["Mean", "It"]}
            >
              Built for Businesses That Mean It
            </AnimatedH2>
            <p className="text-body text-light-base/60 leading-relaxed mb-5">
              SeedTech was founded with a simple idea: small and mid-sized businesses deserve the same
              quality of technology support that enterprise companies get — without the enterprise price tag.
            </p>
            <p className="text-body text-light-base/60 leading-relaxed mb-8">
              We started by solving one problem at a time for local businesses in New Jersey. Now we support
              over 200 companies across the country with managed IT and custom web development
              that actually move the needle.
            </p>
            <CheckList theme="dark" items={whatWeDo} />
          </div>
          <div className="space-y-4">
            <LiquidGlassCard className="p-6">
              <div className="flex items-start gap-4">
                <IconBox icon={Shield} variant="gradient" />
                <div>
                  <CardTitle className="mb-1">Proactive, Not Reactive</CardTitle>
                  <Body className="text-light-base/55">
                    We monitor, patch, and protect your systems before problems reach you. Most issues
                    are resolved before you ever know they existed.
                  </Body>
                </div>
              </div>
            </LiquidGlassCard>
            <LiquidGlassCard className="p-6">
              <div className="flex items-start gap-4">
                <IconBox icon={Globe} variant="gradient" />
                <div>
                  <CardTitle className="mb-1">Built to Convert</CardTitle>
                  <Body className="text-light-base/55">
                    Every website we build is engineered for performance, SEO, and conversion —
                    not just aesthetics. We measure success in leads and revenue, not page views.
                  </Body>
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Our Values"
          title="How We Work"
          description="Three principles that guide every project, every client relationship, every day."
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <GlassCard key={v.title} theme="light" className="p-8">
              <IconBox icon={v.icon} variant="gradient" className="mb-5" />
              <CardTitle className="text-dark-base mb-3">{v.title}</CardTitle>
              <Body className="text-dark-base/60 leading-relaxed">{v.body}</Body>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Work With Us?"
          description="Let's talk about your technology goals. No hard sell — just an honest conversation."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="See Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
