import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedH1, GradientOrb, GridPattern, LiquidGlassPill } from "@/components/kit";
import { SalesRepCalculator } from "./SalesRepCalculator";
import { FaqAccordion } from "./FaqAccordion";
import { SalesRepGate } from "./SalesRepGate";

const workSteps = [
  {
    n: "01",
    text: "Build prospect lists in Sprout targeting local SMBs in construction, trucking, law, and medical.",
  },
  {
    n: "02",
    text: "Run structured outbound through call and email to generate qualified meetings.",
  },
  {
    n: "03",
    text: "Hand off warm opportunities — SeedTech runs discovery, scopes, closes, and supports.",
  },
];

const compTerms = [
  "Commission 15–20% based on seat count",
  "Paid on collected MRR, up to 12 months",
  "No technical responsibility on your side",
];

const roleColumns = [
  {
    title: "Your role",
    items: ["Prospect, outbound & lead discovery", "Present proposals & close deals", "Own onboarding, implementation & client management"],
  },
  {
    title: "SeedTech backs you",
    items: ["Tech scoping & specs for your proposals", "Hands-on implementation & deployment", "Resolves client technical support tickets"],
  },
  {
    title: "The result",
    highlight: true,
    items: ["You're the client's go-to contact", "Support handles tickets behind the scenes", "Recurring commission on every renewal"],
  },
];

const industries = [
  { title: "Construction / Trades", tier: "Plus", prompt: "Downtime, field devices, and office-to-field coordination." },
  { title: "Trucking / Logistics", tier: "Plus", prompt: "Dispatch continuity, communication, and device support." },
  { title: "Law Firms", tier: "Pro", prompt: "Security, reliability, and professional client-facing support." },
  { title: "Medical / Dental", tier: "Pro", prompt: "Scheduling disruption, reliability, and secure systems." },
];

const faqs = [
  {
    question: "Do I need IT experience?",
    answer:
      "No technical background required. You need to be able to have a consultative conversation about business pain — downtime, reliability, communication — not configure servers. SeedTech handles all technical scoping and delivery. We'll give you what you need to speak confidently in front of a prospect.",
  },
  {
    question: "Am I responsible for closing the deal?",
    answer:
      "You'll be in the room for every step — discovery, proposal presentation, and signature. Early on, SeedTech will close alongside you so you can get comfortable with the process. The goal is for you to own the close independently over time. You prospect and build the relationship; we back you up technically until you've got it.",
  },
  {
    question: "What does my role look like after a client signs?",
    answer:
      "You become their primary point of contact — the client manager. If they have a question, concern, or need something changed, they reach out to you. You loop in SeedTech support as needed. You're not resolving technical issues yourself, but you're the face of the relationship and accountable for client satisfaction.",
  },
  {
    question: "How is commission paid?",
    answer:
      "Commission is paid monthly based on each client's active, paying recurring revenue. The rate scales with your book of business — starting at 15% and climbing to 20% as you close more seats. Payouts continue for up to 12 months per active client.",
  },
  {
    question: "Are clients on long contracts?",
    answer:
      "SeedCare is typically sold month-to-month. That makes the initial sale easier and lowers buyer friction — no multi-year commitment required. Long-term retention comes from delivering a great experience, not locking clients in.",
  },
  {
    question: "Is there a path to a full-time role?",
    answer:
      "Yes. Reps who consistently bring on quality accounts — clients with 10–15+ seats — are on a clear path to a W2 position at SeedTech. You'd earn a base salary while continuing to sell and collect commission. It's not guaranteed from day one, but it's the goal for reps who perform.",
  },
];

export function SalesRepPage() {
  return (
    <div className="pt-20">

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-base pb-24 pt-20 md:pb-32 md:pt-28">
        <GradientOrb color="seed" size="xl" className="-right-40 -top-32 opacity-20" />
        <GradientOrb color="blue" size="lg" className="-left-24 top-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <LiquidGlassPill variant="seed">Sales Reps</LiquidGlassPill>
            <LiquidGlassPill variant="default">Recurring Managed IT</LiquidGlassPill>
            <LiquidGlassPill variant="default">Up to 12 Months of Payout</LiquidGlassPill>
          </div>

          <AnimatedH1 highlightWords={["recurring", "income"]} className="mb-6">
            Turn qualified conversations into recurring income
          </AnimatedH1>

          <p className="max-w-xl text-lg leading-relaxed text-white/90">
            Earn recurring commission connecting local businesses to SeedTech&apos;s managed IT. No tech delivery —
            we scope, close, and support every client.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/work-with-seedtech/apply"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-8 py-4 text-sm font-semibold text-white transition-all duration-200 hover:shadow-glowSeed"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl liquid-glass px-8 py-4 text-sm font-semibold text-white transition-all duration-200"
            >
              See the Payout Calculator
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. How It Works ─────────────────────────────────── */}
      <section className="bg-dark-raised py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-seed-400">How it works</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-white">
            Three steps. No IT required.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {workSteps.map((step) => (
              <div key={step.n} className="flex gap-5">
                <span className="mt-0.5 font-display text-2xl leading-none text-seed-500/50">{step.n}</span>
                <p className="text-base leading-relaxed text-white/90">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {compTerms.map((term) => (
              <div
                key={term}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-dark-elevated px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-seed-400" />
                <p className="text-sm leading-relaxed text-white">{term}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3–5. Gated content ─────────────────────────────── */}
      <SalesRepGate>

      {/* ── 3. Calculator ───────────────────────────────────── */}
      <section id="calculator" className="scroll-mt-20 bg-dark-base py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-seed-400">Compensation</p>
          <h2 className="mt-3 max-w-lg font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-white">
            Estimate your payout
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/80">
            Adjust seats, plan, and add-ons to see exactly what each deal could earn you.
          </p>
          <div className="mt-10">
            <SalesRepCalculator />
          </div>
        </div>
      </section>

      {/* ── 4. The Role ─────────────────────────────────────── */}
      <section className="bg-dark-raised py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-seed-400">The role</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-white">
            What you do. What we do.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {roleColumns.map((col) => (
              <div
                key={col.title}
                className={[
                  "rounded-3xl border p-6",
                  col.highlight
                    ? "border-seed-500/25 bg-seed-500/10"
                    : "border-white/[0.08] bg-dark-elevated",
                ].join(" ")}
              >
                <h3 className="font-display text-2xl text-white">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <div key={ind.title} className="rounded-3xl border border-white/[0.08] bg-dark-elevated p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-xl text-white">{ind.title}</h4>
                  <span className="rounded-full border border-seed-500/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-seed-300">
                    {ind.tier}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/80">{ind.prompt}</p>
              </div>
            ))}
          </div>

          {/* Growth path callout */}
          <div className="mt-6 rounded-3xl border border-seed-500/20 bg-seed-500/10 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-seed-400">Long-term path</p>
                <h3 className="mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                  Build a book. Earn a salary.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  For reps who consistently bring on quality accounts — clients with 10–15+ seats — we open the door to a full W2 position at SeedTech. You keep selling, keep earning commission, and gain the stability of a base salary. It&apos;s the path from independent rep to core team member.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-seed-500/30 bg-seed-500/10 px-6 py-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-seed-400">Target</p>
                <p className="mt-1 font-display text-3xl text-white">10–15</p>
                <p className="text-xs text-white/70">seats per account</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Apply + FAQ ──────────────────────────────────── */}
      <section className="bg-[#f5f5f7] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">

            {/* Apply card */}
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_60px_rgba(0,0,0,0.08)] md:p-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-seed-600">Ready to apply?</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dark-base">
                Apply in minutes.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-dark-base/70">
                No cover letter required. Upload your resume, add your outbound background, and submit.
              </p>

              <ol className="mt-6 space-y-3">
                {[
                  "Open the application page",
                  "Upload resume and contact details",
                  "Add outbound context and submit",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-dark-base">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-seed-500/10 text-xs font-semibold text-seed-600">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/work-with-seedtech/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-8 py-4 text-sm font-semibold text-white transition-all duration-200 hover:shadow-glowSeed"
                >
                  Go to Application
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dark-base/15 px-8 py-4 text-sm font-semibold text-dark-base transition-all duration-200 hover:bg-dark-base/[0.05]"
                >
                  Back to Calculator
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-seed-600">FAQ</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-dark-base">
                Common questions.
              </h2>
              <div className="mt-8">
                <FaqAccordion faqs={faqs} />
              </div>
            </div>

          </div>
        </div>
      </section>

      </SalesRepGate>

    </div>
  );
}


