import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  Stethoscope,
  Target,
  TrendingUp,
  Truck,
  Wrench,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AnimatedH1, GradientOrb, GridPattern, LiquidGlassPill } from "@/components/kit";
import { SalesRepCalculator } from "./SalesRepCalculator";

const heroQuickFacts = [
  {
    title: "What you sell",
    body: "Recurring managed IT built around support, security, backup, and planning.",
  },
  {
    title: "Why it closes",
    body: "A real monthly business need with a cleaner story than reactive break-fix support.",
  },
  {
    title: "Who to target",
    body: "SMBs in construction, trucking, law, medical, and other uptime-sensitive verticals.",
  },
  {
    title: "Compensation model",
    body: "Current ladder runs 15% to 20%, based on total seat count and collected recurring revenue.",
  },
];

const plans = [
  {
    name: "SeedCare Essentials",
    price: "$110/user/mo",
    summary: "Foundational support and protection.",
    fit: "Best for smaller teams moving off reactive IT.",
  },
  {
    name: "SeedCare Plus",
    badge: "Best default",
    price: "$130/user/mo",
    summary: "The safest default for growing SMBs.",
    fit: "Best for companies that want a real partner, not just tickets answered.",
  },
  {
    name: "SeedCare Pro",
    price: "$160/user/mo",
    summary: "Strategic partnership tier.",
    fit: "Best for owners who want planning, accountability, and higher-touch support.",
  },
];

const industries = [
  {
    icon: Wrench,
    title: "Construction / Trades",
    prompt: "Downtime, field devices, and office-to-field handoff problems.",
    tier: "Usually Plus",
  },
  {
    icon: Truck,
    title: "Trucking / Logistics",
    prompt: "Dispatch continuity, communication, and device support issues.",
    tier: "Plus + add-ons",
  },
  {
    icon: Building2,
    title: "Law Firms",
    prompt: "Security, responsiveness, and professional client-facing support.",
    tier: "Often Pro",
  },
  {
    icon: Stethoscope,
    title: "Medical / Dental",
    prompt: "Scheduling disruption, reliability, and secure systems.",
    tier: "Often Pro",
  },
];

const roleColumns = [
  {
    icon: Target,
    title: "Your role",
    items: [
      "Prospect target verticals",
      "Qualify interest",
      "Book discovery meetings",
    ],
  },
  {
    icon: BriefcaseBusiness,
    title: "Our role",
    items: [
      "Scope the deal",
      "Bring technical depth",
      "Help close and deliver",
    ],
  },
  {
    icon: TrendingUp,
    title: "Shared win",
    items: [
      "Better-fit accounts",
      "Stronger retention",
      "Recurring commission over time",
    ],
  },
];

const faqs = [
  {
    question: "Do I need IT experience?",
    answer:
      "You do not need to be the technician. You do need to sell consultatively and understand the business value. SeedTech supports the technical side.",
  },
  {
    question: "Do I have to close the deal myself?",
    answer:
      "No. You can run full-cycle or focus on sourcing and qualifying. If you generate and warm the opportunity, SeedTech can support the close.",
  },
  {
    question: "How is commission paid?",
    answer:
      "Commission is paid on collected monthly recurring revenue and can run for up to 12 months while the client remains active and paying.",
  },
  {
    question: "Are the services sold on long contracts?",
    answer:
      "SeedCare is typically sold month-to-month, which makes the sale easier while still keeping the client relationship durable.",
  },
];

export function SalesRepPage() {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-dark-base py-24 md:py-28">
        <GradientOrb color="seed" size="xl" className="-right-40 -top-32 opacity-20" />
        <GradientOrb color="blue" size="lg" className="-left-24 top-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <LiquidGlassPill variant="seed">Sales Reps</LiquidGlassPill>
              <LiquidGlassPill variant="default">Recurring Managed IT</LiquidGlassPill>
              <LiquidGlassPill variant="default">Up to 12 Months of Payout</LiquidGlassPill>
            </div>

            <AnimatedH1 highlightWords={["recurring", "income"]} className="mb-6 max-w-4xl">
              Turn qualified conversations into recurring income
            </AnimatedH1>

            <p className="max-w-3xl text-body-lg leading-relaxed text-white/60">
              SeedTech helps small businesses move from reactive IT headaches to proactive support, backup,
              security, and planning. You bring the relationships and opportunities. We help scope, support,
              and deliver.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-glowSeed"
              >
                Use the Commission Calculator
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#brief"
                className="inline-flex items-center justify-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
              >
                See the Quick Brief
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {heroQuickFacts.map((fact) => (
                <div key={fact.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-seed-300">{fact.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{fact.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section id="calculator" theme="light" className="py-14 md:py-16">
        <SectionHeader
          eyebrow="Compensation"
          title="Estimate client value and expected payout"
          description="Adjust seats, plan, and add-ons to see the client investment alongside the corresponding commission estimate."
          theme="light"
          className="mb-10"
        />
        <SalesRepCalculator />
      </Section>

      <Section id="brief" className="py-16 md:py-20">
        <SectionHeader
          eyebrow="Quick Brief"
          title="What you sell, who you target, and how the role works"
          description="Enough to tell a serious rep whether this is worth a conversation."
          className="mb-12"
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-dark-elevated p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-400">The offer</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={[
                      "rounded-2xl border p-5",
                      plan.badge
                        ? "border-seed-500/30 bg-seed-500/10"
                        : "border-white/[0.08] bg-dark-base",
                    ].join(" ")}
                  >
                    {plan.badge && (
                      <span className="inline-flex rounded-full bg-gradient-brand px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="mt-3 font-display text-2xl text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm font-medium text-seed-300">{plan.price}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{plan.summary}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{plan.fit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-dark-elevated p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-400">How the role works</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {roleColumns.map((column) => (
                  <div key={column.title} className="rounded-2xl border border-white/[0.08] bg-dark-base p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-seed-500/10 text-seed-400">
                      <column.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-white">{column.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/65">
                      {column.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                Strong performers can grow beyond commission-only into a larger account-growth or client-management role as their book matures.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-dark-elevated p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-seed-400">Fastest targets</p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-dark-base">
              {industries.map((industry) => (
                <div key={industry.title} className="flex items-start gap-3 px-4 py-4 not-last:border-b not-last:border-white/[0.08]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-seed-500/10 text-seed-400">
                    <industry.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl text-white">{industry.title}</h3>
                      <span className="rounded-full border border-seed-500/25 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-seed-300">
                        {industry.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{industry.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section theme="light" className="py-14 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-dark-base/10 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(10,10,15,0.35)] md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-seed-600">Next step</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-[1.05] text-dark-base">
              If you know how to open doors and build trust, let&apos;s talk.
            </h2>
            <p className="mt-4 text-body-lg leading-relaxed text-dark-base/65">
              SeedTech is built around recurring IT relationships and a sales motion that does not require you to be the technician.
            </p>

            <div className="mt-7 flex flex-col gap-4">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-glowSeed"
              >
                Use the Calculator
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-base/10 bg-dark-base px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
              >
                Book a Sales Conversation
                <PhoneCall className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="FAQ"
              title="The practical questions"
              description="Just the objections that matter most."
              theme="light"
              align="left"
              className="mb-6 max-w-none"
            />
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-dark-base/10 bg-white p-5 shadow-[0_30px_80px_-50px_rgba(10,10,15,0.35)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-[1.55rem] leading-tight text-dark-base">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-dark-base/40 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-body leading-relaxed text-dark-base/65">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}