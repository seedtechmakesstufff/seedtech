import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
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
      "Build lists in Sprout",
      "Run call and email outreach",
      "Book qualified meetings",
    ],
  },
  {
    icon: BriefcaseBusiness,
    title: "Our role",
    items: [
      "Run discovery",
      "Scope the proposal",
      "Close, onboard, and support",
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
      "No. This role is built around outbound prospecting and qualified meeting generation. You will use Sprout to build lists and work call/email outreach, and SeedTech supports discovery, scoping, and close.",
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

const heroWorkSteps = [
  "Use Sprout to identify local SMB prospects that fit SeedTech's target verticals.",
  "Run structured outbound through call and email to generate qualified meetings.",
  "Hand warm opportunities into SeedTech's sales process while we scope and close.",
];

const heroCompTerms = [
  "Seat-based commission ladder from 15% to 20%.",
  "Paid on collected recurring revenue only, for up to 12 months.",
  "No technical delivery, onboarding, or support responsibility on your side.",
];

export function SalesRepPage() {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-dark-base py-18 md:py-22">
        <GradientOrb color="seed" size="xl" className="-right-40 -top-32 opacity-20" />
        <GradientOrb color="blue" size="lg" className="-left-24 top-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <LiquidGlassPill variant="seed">Sales Reps</LiquidGlassPill>
              <LiquidGlassPill variant="default">Recurring Managed IT</LiquidGlassPill>
              <LiquidGlassPill variant="default">Up to 12 Months of Payout</LiquidGlassPill>
            </div>

            <AnimatedH1 highlightWords={["recurring", "income"]} className="mb-6 max-w-4xl">
              Turn qualified conversations into recurring income
            </AnimatedH1>

            <p className="max-w-3xl text-body-lg leading-relaxed text-white/90">
              SeedTech helps small businesses move from reactive IT headaches to proactive support, backup,
              security, and planning. This role is about outbound prospecting, qualified meetings, and recurring managed IT revenue.
            </p>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90">
              <span className="font-medium text-white">Why reps care:</span> earn recurring commission for outbound SMB meetings that turn into managed IT clients. No IT delivery required. SeedTech scopes, closes, and supports the client.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/work-with-seedtech/apply"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-glowSeed"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
              >
                See the Payout Calculator
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-seed-300">How the role actually works</p>
                  <ol className="mt-4 space-y-4">
                    {heroWorkSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-seed-500/12 text-xs font-semibold text-seed-300">
                          0{index + 1}
                        </span>
                        <p className="pt-1 text-sm leading-relaxed text-white/90">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-seed-300">Compensation terms</p>
                  <ul className="mt-4 space-y-3">
                    {heroCompTerms.map((term) => (
                      <li key={term} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="calculator" theme="light" className="scroll-mt-24 py-14 md:scroll-mt-28 md:py-16">
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
          description="Enough to tell a serious rep whether this is worth an application."
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
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{plan.summary}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{plan.fit}</p>
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
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/80">
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
              <p className="mt-5 text-sm leading-relaxed text-white/75">
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
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{industry.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section theme="light" className="py-14 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-dark-base/10 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(10,10,15,0.35)] md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-seed-600">Apply now</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-[1.05] text-dark-base">
              Review the role here. Apply on a dedicated page.
            </h2>
            <p className="mt-4 text-body-lg leading-relaxed text-dark-base/70">
              Once you are interested, move straight into the application flow. Upload your resume, add your core details, and submit without losing the context of the role page.
            </p>

            <div className="mt-7 space-y-3 rounded-2xl border border-dark-base/10 bg-light-base p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-600">Application flow</p>
              <p className="text-sm leading-relaxed text-dark-base/70">1. Open the dedicated application page.</p>
              <p className="text-sm leading-relaxed text-dark-base/70">2. Upload your resume and core contact details.</p>
              <p className="text-sm leading-relaxed text-dark-base/70">3. Add optional context about your outbound background and submit.</p>
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/work-with-seedtech/apply"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-glowSeed"
              >
                Go To Application
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-base/10 bg-dark-base px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
              >
                Review the Calculator
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="mb-6 max-w-none text-left">
              <p className="text-eyebrow uppercase tracking-widest text-seed-600">FAQ</p>
              <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,3rem)] leading-[1.05] text-dark-base">
                The practical questions
              </h2>
              <p className="mt-4 text-body-lg leading-relaxed text-dark-base/60">
                Just the objections that matter most.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-dark-base/10 bg-white p-5 shadow-[0_30px_80px_-50px_rgba(10,10,15,0.35)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-[1.55rem] leading-tight text-dark-base">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-dark-base/40 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-body leading-relaxed text-dark-base/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}