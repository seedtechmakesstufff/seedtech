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
    title: "Straight Answers",
    body: "We try to be clear about scope, timelines, and what will actually help. That matters more than overselling.",
  },
  {
    icon: Zap,
    title: "Responsive Support",
    body: "When something needs attention, businesses need a team that responds and follows through.",
  },
  {
    icon: Users,
    title: "Long-Term Reliability",
    body: "Our goal is not to win a project and disappear. It is to become a dependable part of how your business runs.",
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
            A Reliable Technology Partner for Small and Mid-Size Businesses
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed">
            SeedTech works with businesses that want fewer technology headaches, clearer communication, and a partner that stays involved. We support the systems companies rely on every day and build websites that are meant to help the business, not just decorate it.
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
              Built to Be a Dependable Partner
            </AnimatedH2>
            <p className="text-body text-light-base/60 leading-relaxed mb-5">
              SeedTech was built around a simple idea: small and mid-size businesses should be able to get reliable support without juggling multiple vendors or chasing people down for answers.
            </p>
            <p className="text-body text-light-base/60 leading-relaxed mb-8">
              We work best when we can stay involved, understand how the business operates, and help make technology less disruptive day to day. That applies to both ongoing IT support and the websites and systems companies rely on to communicate and work.
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
                    We want to catch issues early, keep systems maintained, and reduce the number of things your team has to react to during the workday.
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
                    We build websites to support the business: clearer messaging, better next steps, and fewer gaps between the site and the way your team actually works.
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
          description="Let&apos;s talk about what your business needs and whether we&apos;re the right long-term fit."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="See Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
