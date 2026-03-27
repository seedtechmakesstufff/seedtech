"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, BarChart3, FileText, LayoutDashboard } from "lucide-react";

const glassStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  background:
    "linear-gradient(95deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 70%), rgba(255,255,255,0.07)",
  boxShadow:
    "0 1.5px 0 1px rgba(255,255,255,0.14) inset, 0 -1px 0 1px rgba(0,0,0,0.10) inset, 0 8px 32px 0 rgba(0,0,0,0.18), 0 2px 8px 0 rgba(0,0,0,0.12)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

interface PillarData {
  id: string;
  icon: React.ReactNode;
  miniTitle: string;
  heading: React.ReactNode;
  description: string;
  bullets: string[];
  stat: string;
  statLabel: string;
}

const pillars: PillarData[] = [
  {
    id: "citations",
    icon: <Brain className="w-5 h-5" />,
    miniTitle: "AI CITATION ENGINE",
    heading: (
      <>
        BE THE SOURCE <span className="text-seed-400">AI RECOMMENDS</span>
      </>
    ),
    description:
      "65% of searches now end with an AI-generated answer — no click required. SEO Autopilot tracks your brand across ChatGPT, Perplexity, Google AIO, Gemini, and Copilot so you know exactly when AI mentions you, what it says, and how to become the go-to source it cites.",
    bullets: [
      "Live citation monitoring across 5 AI engines",
      "AI Visibility scoring for every page (0–100)",
      "Content recommendations to increase citation rate",
      "Brand sentiment and mention tracking",
    ],
    stat: "5",
    statLabel: "AI engines monitored",
  },
  {
    id: "audits",
    icon: <BarChart3 className="w-5 h-5" />,
    miniTitle: "AUTOMATED AUDITS",
    heading: (
      <>
        WEEKLY SEO INTELLIGENCE,{" "}
        <span className="text-seed-400">ON AUTOPILOT</span>
      </>
    ),
    description:
      "Ranking on Google is harder than ever and AI is eating traffic. You need consistent data to know where you stand. SEO Autopilot crawls your entire site weekly, tracks every keyword position, and delivers a health score — so you're always making decisions based on real numbers, not guesses.",
    bullets: [
      "25+ on-page SEO checks every week",
      "Keyword position tracking with trend history",
      "Site health score with delta from prior week",
      "Competitor benchmarking and gap analysis",
    ],
    stat: "25+",
    statLabel: "automated checks weekly",
  },
  {
    id: "content",
    icon: <FileText className="w-5 h-5" />,
    miniTitle: "AI-FIRST CONTENT",
    heading: (
      <>
        CONTENT BUILT TO BE{" "}
        <span className="text-seed-400">CITED, NOT JUST RANKED</span>
      </>
    ),
    description:
      "The old playbook — stuff keywords, build links, wait — is dead. AI systems cite content that is structured, authoritative, and answers questions directly. SEO Autopilot scores your existing content and generates new blog posts engineered for the exact format AI platforms pull from.",
    bullets: [
      "E-E-A-T scoring (Experience, Expertise, Authority, Trust)",
      "Topic cluster maps with content gap analysis",
      "AI-first blog generation with citation structure",
      "Internal linking recommendations",
    ],
    stat: "50%",
    statLabel: "of score weighted to AI visibility",
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    miniTitle: "YOUR SEO DASHBOARD",
    heading: (
      <>
        MANAGE YOUR SEO{" "}
        <span className="text-seed-400">WITHOUT AN AGENCY</span>
      </>
    ),
    description:
      "Most businesses pay agencies thousands per month for reports they can't act on. SEO Autopilot gives you a 9-tab command center built into your own website — keywords, audits, insights, citations, competitors, and strategy — all in one place, explained in plain English.",
    bullets: [
      "9-tab dashboard: keywords, audits, insights, citations",
      "Weekly digest emailed to your inbox automatically",
      "AI Strategy Advisor with real-time recommendations",
      "Competitor content analysis and opportunity alerts",
    ],
    stat: "9",
    statLabel: "dashboard tabs in one platform",
  },
];

function MiniCard({
  pillar,
  isActive,
  onActivate,
}: {
  pillar: PillarData;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      className="group relative flex flex-col items-start text-left shrink-0 cursor-pointer focus:outline-none snap-start"
      style={{ width: 220, height: 260 }}
    >
      {/* Floating graphic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-[160px] h-[160px] pointer-events-none select-none">
        <Image
          src="/img/seed graphics/seo_graphic.webp"
          alt={pillar.miniTitle}
          fill
          className="object-contain object-bottom drop-shadow-2xl"
          sizes="160px"
        />
      </div>

      {/* Glass card — grows on active */}
      <motion.div
        animate={{ height: isActive ? 180 : 120 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="absolute inset-x-0 bottom-0 px-5 pb-5 flex flex-col justify-end gap-2"
        style={{
          ...glassStyle,
          borderColor: isActive
            ? "rgba(74, 222, 128, 0.30)"
            : "rgba(255, 255, 255, 0.12)",
        }}
      >
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-seed-400"
          >
            {pillar.icon}
          </motion.div>
        )}
        <p className="font-display text-[14px] md:text-[15px] font-bold text-white uppercase tracking-wider leading-snug w-full">
          {pillar.miniTitle}
        </p>
      </motion.div>
    </button>
  );
}

export function AutopilotSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = pillars[activeIdx];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">

        {/* Section header */}
        <div className="text-center mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-3">
            SEO Autopilot
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            SEO HAS CHANGED.{" "}
            <span className="text-seed-400">YOUR STRATEGY MUST TOO.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            AI now answers more searches than ever — before anyone clicks a link.
            Businesses that don&apos;t adapt lose visibility. SEO Autopilot is built for this shift.
          </p>
        </div>

        {/* Mini cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:justify-center">
          {pillars.map((pillar, i) => (
            <MiniCard
              key={pillar.id}
              pillar={pillar}
              isActive={activeIdx === i}
              onActivate={() => setActiveIdx(i)}
            />
          ))}
        </div>

        {/* Detail card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          style={{ ...glassStyle, borderRadius: 24, overflow: "visible" }}
        >
          <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch min-h-[300px]">

            {/* Text */}
            <div className="flex-1 px-8 py-10 lg:px-12 lg:py-14 z-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-5"
                >
                  {/* Stat pill */}
                  <div className="inline-flex items-baseline gap-2 self-start">
                    <span className="font-display text-3xl font-bold text-seed-400">
                      {active.stat}
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {active.statLabel}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-white leading-[1.12]">
                    {active.heading}
                  </h3>

                  <p className="text-sm md:text-[15px] text-white/45 leading-relaxed max-w-md">
                    {active.description}
                  </p>

                  {/* Bullets */}
                  <ul className="flex flex-col gap-2">
                    {active.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-seed-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services/seo-autopilot"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-seed-400 transition-colors duration-200 mt-1"
                  >
                    See How It Works
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image — overflows card */}
            <div className="relative w-full lg:w-[360px] shrink-0 flex items-end justify-center lg:justify-end pointer-events-none select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-[240px] h-[240px] lg:w-[320px] lg:h-[320px] lg:-mr-8 lg:-mb-8"
                >
                  <Image
                    src="/img/seed graphics/seo_graphic.webp"
                    alt="SEO Autopilot"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 1024px) 240px, 320px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

        {/* Bottom CTA link */}
        <div className="text-center mt-2">
          <Link
            href="/services/seo-autopilot"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-seed-400 transition-colors duration-200"
          >
            Explore the full SEO Autopilot platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
