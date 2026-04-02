import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Eye,
  Headphones,
  MessageSquare,
  Radar,
  Repeat,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  AnimatedH1,
  CTABanner,
  GradientOrb,
  GradientText,
  GridPattern,
  LiquidGlassPill,
} from "@/components/kit";

export const generateMetadata = buildMetadata("/services/managed-it/why-seedtech");

const sectionOneCards = [
  {
    icon: Headphones,
    title: "Fast help when something breaks",
    body: "When your team runs into a problem, they need a clear path back to work — not delays, confusion, or endless back-and-forth.",
  },
  {
    icon: Repeat,
    title: "Fewer repeat problems",
    body: "If the same issue keeps coming back, it usually means the real cause was never addressed.",
  },
  {
    icon: MessageSquare,
    title: "Clear communication",
    body: "You should know what is happening, what was done, and what comes next.",
  },
  {
    icon: Radar,
    title: "Proactive monitoring",
    body: "Many issues should be caught early instead of being discovered only after they affect your team.",
  },
  {
    icon: Users,
    title: "Support from people who know your setup",
    body: "You should not have to re-explain your business every time you ask for help.",
  },
  {
    icon: ClipboardList,
    title: "A real plan, not just quick fixes",
    body: "Good IT support does not just patch problems. It improves the environment over time.",
  },
];

const sectionFourCards = [
  {
    icon: Eye,
    title: "We know your environment",
    body: "We learn your users, devices, workflows, vendors, and systems so support feels smoother and more informed.",
  },
  {
    icon: MessageSquare,
    title: "We keep communication simple",
    body: "No confusing language, no guessing what is happening, and no unnecessary runaround.",
  },
  {
    icon: UserCheck,
    title: "We take ownership",
    body: "We do not want issues bouncing around without a clear path forward.",
  },
  {
    icon: Workflow,
    title: "We work to improve things over time",
    body: "Good IT support is not just about fixing today’s issue. It is about making your environment more stable going forward.",
  },
];

const faqs = [
  {
    q: "What makes SeedTech different?",
    a: "We focus on proactive support, clear communication, and long-term stability. That means we do more than just respond to issues — we work to catch problems early, solve them properly, and reduce repeat issues over time.",
  },
  {
    q: "Do you only fix problems after they happen?",
    a: "No. We use monitoring, maintenance, patching, and security tools to help identify many issues early. Not everything can be prevented, but proactive support helps reduce downtime and improve response.",
  },
  {
    q: "What if the same issue keeps happening?",
    a: "Recurring issues are usually a sign that the real problem has not been fully addressed. We work to identify the cause and recommend or implement a better long-term fix whenever possible.",
  },
  {
    q: "Will we have to keep re-explaining our setup?",
    a: "No. Part of our job is learning your environment so support feels smoother and more informed. We want your team to feel like they are working with people who know the business, not starting over every time.",
  },
  {
    q: "Can you support a growing business?",
    a: "Yes. Our support model is built around monitoring, documentation, automation, and clear ownership so we can stay organized and responsive as clients grow.",
  },
  {
    q: "What happens if we switch to SeedTech?",
    a: "We begin with an assessment, learn your environment, and build a rollout plan around your team and needs. The goal is to make the transition clear, organized, and low-disruption.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
    { "@type": "ListItem", position: 3, name: "Why SeedTech", item: "https://seedtechllc.com/services/managed-it/why-seedtech" },
  ],
};

export default function WhySeedTechPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-light-base/30">
            <Link href="/" className="transition-colors hover:text-light-base/50">
              Home
            </Link>
            <span>/</span>
            <Link href="/services/managed-it" className="transition-colors hover:text-light-base/50">
              Managed IT
            </Link>
            <span>/</span>
            <span className="text-light-base/60">Why SeedTech</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            Why Businesses Choose SeedTech
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support That Feels Clear, Proactive, and Personal</AnimatedH1>
          <div className="mb-10 max-w-2xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Technology support should make your business easier to run — not harder to manage.</p>
            <p>
              At SeedTech, we focus on keeping your systems running smoothly, helping your team
              quickly when issues come up, and looking for ways to prevent the same problems from
              happening again.
            </p>
            <p>
              You get support from people who know your environment, communicate clearly, and take
              ownership from start to finish.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free IT Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              See Plans & Pricing
            </Link>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader
          eyebrow="What Businesses Actually Need"
          title="Good IT Support Should Do More Than Just Put Out Fires"
          description="Most businesses are not looking for more complexity. They want technology that works, support that responds, and fewer interruptions to the workday."
          theme="light"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectionOneCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <card.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="How SeedTech Works"
          title="We Focus on Fixing It Right"
          description="When something goes wrong, our goal is not just to get it working for the moment. Our goal is to reduce the chance of the same issue coming back."
        />
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-body-lg leading-relaxed text-light-base/60">
            We always start by helping your team get moving again as quickly as possible.
          </p>
          <p className="text-body-lg leading-relaxed text-light-base/60">
            From there, we look at why the issue happened in the first place. That could mean
            outdated hardware, poor configuration, inconsistent setup, missing documentation, or a
            larger gap in process.
          </p>
          <p className="text-body-lg leading-relaxed text-light-base/60">
            Whenever possible, we recommend or implement a better long-term solution — not just a
            temporary patch.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Fewer recurring issues",
              "Less downtime",
              "Better stability over time",
              "A smoother experience for your team",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-seed-500/15 bg-white/[0.03] p-5 text-body-sm text-light-base/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section theme="light">
        <SectionHeader
          eyebrow="Proactive by Design"
          title="We Do Our Best to Catch Problems Early"
          description="The best IT issue is the one your team never has to notice."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            SeedTech uses monitoring, maintenance, patching, security tools, and automation to
            help spot issues early and keep systems healthy in the background.
          </p>
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            That does not mean every problem can be prevented. But it does mean many issues can be
            caught sooner, handled faster, and documented more clearly.
          </p>
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            And when something cannot be prevented, we focus on what needs to change so it is less
            likely to happen again.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Why Clients Stay"
          title="Support That Feels More Personal"
          description="A big part of good IT support is not having to start from scratch every time."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sectionFourCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-seed-500/15 bg-white/[0.03] p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-500/10">
                <card.icon className="h-5 w-5 text-seed-400" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-white">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-light-base/55">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section theme="light">
        <SectionHeader
          eyebrow="Built for Growing Businesses"
          title="Structured to Support You as You Grow"
          description="Good IT support is not about having the biggest team. It is about having the right systems, the right process, and clear ownership."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            SeedTech is built around proactive monitoring, automation, documentation, and direct
            accountability.
          </p>
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            That helps us stay responsive, reduce unnecessary handoffs, and support businesses in a
            way that feels organized and consistent.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Quicker response",
              "Less confusion",
              "Better follow-through",
              "A support experience that feels steady, not scattered",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-black/[0.05] bg-white p-5 text-body-sm text-dark-base/70 shadow-cardLight">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-seed-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            When We Can Prevent It, We Do. When We Can’t, We Work to Keep It From Happening Again.
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Not every issue can be caught ahead of time. Hardware fails. Vendors have outages.
              People click things they should not click.
            </p>
            <p>What matters is how your IT partner responds.</p>
            <p>
              At SeedTech, we focus on resolving the issue, understanding what caused it, and
              putting better safeguards, processes, or recommendations in place where it makes
              sense. That way support is not just reactive — it becomes part of making your
              business more stable over time.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="mb-8 font-display text-heading text-white md:text-heading-lg">
            We show up, we learn your environment, and <GradientText as="span">we work to keep things running smoothly.</GradientText>
          </blockquote>
          <p className="text-body-sm text-light-base/40">
            Support should feel clear, familiar, and dependable — not frustrating.
          </p>
        </div>
      </Section>

      <Section theme="light">
        <SectionHeader title="Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <h3 className="mb-3 font-display text-card-title text-dark-base">{faq.q}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <CTABanner
          title="IT Support That Feels Clear, Proactive, and Personal"
          description="Technology support should make your business easier to run — not harder to manage."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="See Plans & Pricing"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
