import { buildMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Zap, Heart, Users, Rocket, ShoppingCart, SquareTerminal, MonitorSmartphone, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GlassCard,
  CardTitle,
  Body,
  LiquidGlassCard,
  IconBox,
  AnimatedH2,
} from "@/components/kit";
import { VideoLocationPill } from "@/components/about/VideoLocationPill";

export const generateMetadata = buildMetadata("/about", {
  title: "About Us",
  description:
    "SeedTech is a technology company built for businesses that want fewer headaches, clearer communication, and a partner that stays involved. Based in New Jersey & California.",
  canonical: "/about",
});

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

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/img/seed graphics/about/about_hero.webp"
          alt="About SeedTech"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold tracking-wide text-white">
            About Us
          </h1>
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

      {/* Statement */}
      <section className="bg-dark-base py-24 md:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedH2
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-white leading-[1.05]"
          >
            SeedTech works with businesses that want fewer technology headaches, clearer communication, and a partner that stays involved. We support the systems companies rely on every day and build websites that are meant to help the business, not just decorate it.
          </AnimatedH2>
        </div>
      </section>

      {/* Video */}
      <section className="bg-dark-base pb-24 md:pb-32">
        <VideoLocationPill />
        <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
      </section>

      {/* Owners */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Matt */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/img/seed graphics/about/matt_oliva_3x.webp"
                  alt="Matt Oliva, Co-founder of SeedTech"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white tracking-wide">Matt Oliva</p>
                <p className="text-sm text-white/50 mt-1">CEO &amp; Director of Managed IT</p>
              </div>
            </div>

            {/* Sam */}
            <div className="flex flex-col gap-4 md:mt-12">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/img/seed graphics/about/sam_swaynos_3x.webp"
                  alt="Sam Swaynos, Co-founder of SeedTech"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white tracking-wide">Sam Swaynos</p>
                <p className="text-sm text-white/50 mt-1">Co-Owner &amp; Product Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
            Ready to go deeper?
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/services/managed-it"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="w-4 h-4 text-seed-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Managed IT Support — proactive monitoring, helpdesk, and infrastructure
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/services/seedtech-platform"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4 text-seed-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  SeedTech Platform — fast-launch websites for service businesses
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/services/ecommerce-development"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Ecommerce — Shopify, BigCommerce, and custom storefronts
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/services/custom-development"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <SquareTerminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Custom Development — SaaS, portals, internal tools, and web apps
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>
          </div>

          <p className="text-center text-sm text-white/25 mt-8">
            Not sure where to start?{" "}
            <Link href="/contact" className="text-seed-400/70 hover:text-seed-400 transition-colors">
              Contact us and we&apos;ll point you in the right direction.
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
