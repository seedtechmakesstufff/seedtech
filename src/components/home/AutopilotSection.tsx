"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, BarChart3, FileText, LayoutDashboard } from "lucide-react";
import auditAnimation from "@/../public/lotties/audit-card-animation.json";
import { AnimatedH2 } from "@/components/kit";

function PingPongLottie({ animationData, className }: { animationData: object; className?: string }) {
  const ref = useRef<LottieRefCurrentProps>(null);
  const mounted = useRef(true);

  return (
    <Lottie
      lottieRef={ref}
      animationData={animationData}
      loop={false}
      autoplay
      className={className}
      onDOMLoaded={() => {
        mounted.current = true;
      }}
      onComplete={() => {
        if (!mounted.current) return;
        const anim = ref.current?.animationItem;
        if (!anim) return;
        const newDir = anim.playDirection === 1 ? -1 : 1;
        // Use goToAndPlay to eliminate the pause — jump to the
        // correct boundary frame and play in the new direction instantly
        anim.setDirection(newDir as 1 | -1);
        if (newDir === -1) {
          anim.goToAndPlay(anim.totalFrames - 1, true);
        } else {
          anim.goToAndPlay(0, true);
        }
      }}
    />
  );
}

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
  image: string;
  lottie?: object;
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
    miniTitle: "AI SEARCH VISIBILITY INTELLIGENCE",
    image: "/img/seed graphics/seo_graphic.webp",
    heading: (
      <>
        SEE WHERE AI SEARCH{" "}
        <span className="text-seed-400">SURFACES YOUR BRAND</span>
      </>
    ),
    description:
      "Track how your brand appears across ChatGPT, Perplexity, Google AI features, Gemini, and Copilot. SEO Autopilot helps you monitor mentions, source visibility, and content patterns so you can create pages that are more discoverable, more credible, and easier for modern search systems to cite.",
    bullets: [
      "Brand and citation monitoring across 5 AI platforms",
      "AI visibility scoring by page",
      "Recommendations to improve source-readiness",
      "Mention sentiment and trend tracking",
    ],
    stat: "5",
    statLabel: "AI platforms monitored",
  },
  {
    id: "audits",
    icon: <BarChart3 className="w-5 h-5" />,
    miniTitle: "WEEKLY SEO INTELLIGENCE",
    image: "/img/seo-autopilot/seo_audit_card_2x.webp",
    lottie: auditAnimation,
    heading: (
      <>
        WEEKLY SEO INTELLIGENCE,{" "}
        <span className="text-seed-400">WITHOUT THE SPREADSHEETS</span>
      </>
    ),
    description:
      "SEO Autopilot runs recurring checks across your site to surface technical issues, content gaps, keyword movement, and health trends — so you can act on first-party search data instead of guessing what changed.",
    bullets: [
      "25+ recurring SEO and content checks",
      "Keyword trend tracking over time",
      "Site health score with week-over-week change",
      "Competitor and gap monitoring",
    ],
    stat: "25+",
    statLabel: "automated checks per cycle",
  },
  {
    id: "content",
    icon: <FileText className="w-5 h-5" />,
    miniTitle: "SEARCH-READY CONTENT ENGINE",
    image: "/img/seo-autopilot/seo_create_content_card_2x.webp",
    heading: (
      <>
        CONTENT BUILT TO INFORM, RANK,{" "}
        <span className="text-seed-400">AND EARN CITATIONS</span>
      </>
    ),
    description:
      "SEO Autopilot helps you create content that is easier for people to trust and easier for search systems to understand — using structured briefs, clear formatting, internal link recommendations, and source-ready page architecture.",
    bullets: [
      "Topic clusters and content gap mapping",
      "Briefs and drafts shaped by search intent",
      "Internal linking built in — not an afterthought",
      "Authority and trust signals review driven towards E-E-A-T",
    ],
    stat: "Search-ready",
    statLabel: "content structured for discoverability",
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    miniTitle: "9 SEO WORKSTREAMS IN ONE PLATFORM",
    image: "/img/seo-autopilot/seo_dashboard_card_2x.webp",
    heading: (
      <>
        ONE COMMAND CENTER FOR{" "}
        <span className="text-seed-400">YOUR SEO OPERATIONS</span>
      </>
    ),
    description:
      "See rankings, audits, insights, content opportunities, citations, and strategy in one place. SEO Autopilot gives your team a clear operating view of what is happening, what needs attention, and what to publish next — powered by Search Console-led, first-party search data.",
    bullets: [
      "Unified dashboard for rankings, audits, and insights",
      "Weekly digest delivered automatically",
      "Strategy recommendations in plain English",
      "Competitor and opportunity monitoring",
    ],
    stat: "9",
    statLabel: "SEO workstreams in one platform",
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
        {pillar.lottie ? (
          <PingPongLottie
            animationData={pillar.lottie}
            className="w-full h-full drop-shadow-2xl"
          />
        ) : (
          <Image
            src={pillar.image}
            alt={pillar.miniTitle}
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            sizes="160px"
          />
        )}
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
          <AnimatedH2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            highlightWords={["Didn't."]}
          >
            Search Changed. The Fundamentals Didn&apos;t.
          </AnimatedH2>
          <p className="mt-4 text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            Search is changing fast, but the fundamentals still matter. SEO Autopilot turns search data, site context, audits, internal linking, and content workflows into one operating system — so your team can improve visibility with structure, consistency, and clear next steps.
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
                  {active.lottie ? (
                    <PingPongLottie
                      animationData={active.lottie}
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <Image
                      src={active.image}
                      alt={active.miniTitle}
                      fill
                      className="object-contain object-bottom"
                      sizes="(max-width: 1024px) 240px, 320px"
                    />
                  )}
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
