"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Layers,
  Smartphone,
  Mail,
  Zap,
  Rocket,
  FileText,
  BarChart3,
  Headphones,
  CheckCircle2,
} from "lucide-react";

// ─── Shared glass style ────────────────────────────────────────────────────────

const cardGlassStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  background:
    "linear-gradient(95deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 70%), rgba(255,255,255,0.07)",
  boxShadow:
    "0 1.5px 0 1px rgba(255,255,255,0.14) inset, 0 -1px 0 1px rgba(0,0,0,0.10) inset, 0 8px 32px 0 rgba(0,0,0,0.18), 0 2px 8px 0 rgba(0,0,0,0.12)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

// ─── Data ──────────────────────────────────────────────────────────────────────

interface WebPillar {
  id: string;
  icon: React.ReactNode;
  miniTitle: string;
  heading: React.ReactNode;
  description: string;
  bullets: string[];
  stat: string;
  statLabel: string;
}

const pillars: WebPillar[] = [
  {
    id: "implementation",
    icon: <Globe className="w-5 h-5 text-seed-400" />,
    miniTitle: "CUSTOM IMPLEMENTATION",
    heading: (
      <>
        CUSTOM WEBSITE IMPLEMENTATION{" "}
        <span className="text-seed-400">ON THE SEEDTECH PLATFORM</span>
      </>
    ),
    description:
      "Your site is built from scratch on the SeedTech Platform infrastructure — not adapted from a theme or template. Every page, section, and layout is implemented to match your business, brand, and goals.",
    bullets: [
      "Built around your services and business context",
      "Custom page templates and section layouts",
      "Consistent brand implementation throughout",
      "Production-ready from day one",
    ],
    stat: "Custom",
    statLabel: "built for your business — not a template",
  },
  {
    id: "architecture",
    icon: <Layers className="w-5 h-5 text-blue-400" />,
    miniTitle: "PAGE ARCHITECTURE",
    heading: (
      <>
        CORE PAGE ARCHITECTURE{" "}
        <span className="text-seed-400">BASED ON YOUR BUSINESS</span>
      </>
    ),
    description:
      "We define your site's page structure based on your services, audience, and goals — before a single line of code is written. Every page has a clear purpose, defined content hierarchy, and a logical place in your site's navigation.",
    bullets: [
      "Pages defined by your service structure",
      "Clear information hierarchy per page",
      "Navigation designed for your user flow",
      "Scalable structure that grows with your business",
    ],
    stat: "Structured",
    statLabel: "pages planned around your offer",
  },
  {
    id: "responsive",
    icon: <Smartphone className="w-5 h-5 text-violet-400" />,
    miniTitle: "MOBILE RESPONSIVE",
    heading: (
      <>
        MOBILE-RESPONSIVE{" "}
        <span className="text-seed-400">ON EVERY DEVICE</span>
      </>
    ),
    description:
      "Every layout, section, and interaction is tested and refined across mobile, tablet, and desktop. No broken components, no compressed text — responsive from the ground up, not applied as an afterthought.",
    bullets: [
      "Mobile-first implementation approach",
      "Tested across all common viewport sizes",
      "Touch-friendly navigation and form inputs",
      "Consistent visual experience on all devices",
    ],
    stat: "All",
    statLabel: "devices supported at launch",
  },
  {
    id: "forms",
    icon: <Mail className="w-5 h-5 text-emerald-400" />,
    miniTitle: "CONTACT & LEAD FORMS",
    heading: (
      <>
        CONTACT AND LEAD-CAPTURE FORMS{" "}
        <span className="text-seed-400">BUILT IN</span>
      </>
    ),
    description:
      "Lead forms are set up and connected from day one — not bolted on after launch. Submissions route to your preferred inbox or CRM, with validation and spam protection already in place.",
    bullets: [
      "Custom contact and inquiry forms",
      "Lead routing to your inbox or CRM",
      "Form validation and spam protection",
      "Confirmation and follow-up messaging configured",
    ],
    stat: "Day 1",
    statLabel: "lead capture live at launch",
  },
  {
    id: "performance",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    miniTitle: "PERFORMANCE SETUP",
    heading: (
      <>
        PERFORMANCE-OPTIMIZED{" "}
        <span className="text-seed-400">FROM THE GROUND UP</span>
      </>
    ),
    description:
      "Built on Next.js with production-grade performance defaults. Fast load times, optimized images, and clean Core Web Vitals — without manual tuning required after launch.",
    bullets: [
      "Next.js image and asset optimization",
      "Fast page load across all routes",
      "Core Web Vitals optimized at build time",
      "Production deployment configuration included",
    ],
    stat: "Fast",
    statLabel: "core web vitals optimized at build",
  },
  {
    id: "deployment",
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    miniTitle: "DEPLOYMENT WORKFLOW",
    heading: (
      <>
        MODERN DEPLOYMENT WORKFLOW{" "}
        <span className="text-seed-400">INCLUDED</span>
      </>
    ),
    description:
      "Your site is deployed on modern infrastructure with a clean CI/CD workflow. Updates are safe, reversible, and don't require manual server management or FTP access.",
    bullets: [
      "Deployed on Vercel or your preferred host",
      "CI/CD pipeline configured at launch",
      "Environment variable and secrets management",
      "Preview deployments for changes before they go live",
    ],
    stat: "CI/CD",
    statLabel: "deployment pipeline configured at launch",
  },
  {
    id: "content",
    icon: <FileText className="w-5 h-5 text-rose-400" />,
    miniTitle: "CONTENT STRUCTURE",
    heading: (
      <>
        CONTENT STRUCTURE DRIVEN BY{" "}
        <span className="text-seed-400">YOUR BUSINESS CONTEXT</span>
      </>
    ),
    description:
      "We use your onboarding inputs — services, goals, audience, and tone — to shape the content structure before anything is written. Your site is built around what you actually do and who you actually serve.",
    bullets: [
      "Page structure derived from your service offering",
      "Content hierarchy matches your customer journey",
      "Headings and sections shaped by your business goals",
      "Content brief provided as part of onboarding",
    ],
    stat: "Business-led",
    statLabel: "content shaped by your context",
  },
  {
    id: "seo",
    icon: <BarChart3 className="w-5 h-5 text-seed-400" />,
    miniTitle: "SEO AUTOPILOT",
    heading: (
      <>
        SEO AUTOPILOT CONFIGURED{" "}
        <span className="text-seed-400">AT LAUNCH</span>
      </>
    ),
    description:
      "SEO Autopilot is set up during the build using the same business context that shapes the site. You don't add SEO later — it's live the day you launch, with keyword tracking, audits, and AI visibility scoring already running.",
    bullets: [
      "Keyword tracking active from day one",
      "Weekly site health audits begin immediately",
      "AI visibility scoring across 5 search platforms",
      "On-page SEO metadata configured for every page",
    ],
    stat: "Day 1",
    statLabel: "SEO operational at launch",
  },
  {
    id: "launch",
    icon: <Headphones className="w-5 h-5 text-indigo-400" />,
    miniTitle: "LAUNCH SUPPORT",
    heading: (
      <>
        FULL LAUNCH SUPPORT{" "}
        <span className="text-seed-400">INCLUDED</span>
      </>
    ),
    description:
      "We handle DNS configuration, deployment coordination, go-live testing, and post-launch orientation. You launch on time and on your own terms — not scrambling at the last minute.",
    bullets: [
      "DNS and domain configuration support",
      "Go-live checklist and pre-launch testing",
      "Post-launch orientation and handoff call",
      "First-week monitoring included",
    ],
    stat: "Guided",
    statLabel: "go-live with full support",
  },
];

// ─── Mini Card ─────────────────────────────────────────────────────────────────

function MiniCard({
  pillar,
  isActive,
  onActivate,
}: {
  pillar: WebPillar;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      className="group relative flex flex-col items-start text-left shrink-0 cursor-pointer focus:outline-none snap-start"
      style={{ width: 180, height: 210 }}
    >
      {/* Floating icon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-[72px] h-[72px] pointer-events-none select-none flex items-center justify-center">
        <div
          style={cardGlassStyle}
          className="w-14 h-14 flex items-center justify-center rounded-2xl"
        >
          {pillar.icon}
        </div>
      </div>

      {/* Glass card */}
      <motion.div
        animate={{ height: isActive ? 155 : 108 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="absolute inset-x-0 bottom-0 px-3 pb-4 flex flex-col justify-end gap-1.5"
        style={{
          ...cardGlassStyle,
          borderColor: isActive
            ? "rgba(74, 222, 128, 0.30)"
            : "rgba(255, 255, 255, 0.12)",
        }}
      >
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-seed-400"
          >
            {pillar.icon}
          </motion.div>
        )}
        <p className="font-display text-[11px] font-bold text-white uppercase tracking-wider leading-snug">
          {pillar.miniTitle}
        </p>
      </motion.div>
    </button>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function WebBuildCards() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = pillars[activeIdx];

  return (
    <div className="flex flex-col gap-5">
      {/* Mini cards — always single row, horizontal scroll at all breakpoints */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...cardGlassStyle, borderRadius: 20 }}
        className="relative overflow-hidden"
      >
        <div className="px-8 py-8 md:px-10 md:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 max-w-2xl"
            >
              <div className="inline-flex items-baseline gap-2 self-start">
                <span className="font-display text-3xl font-bold text-seed-400">
                  {active.stat}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {active.statLabel}
                </span>
              </div>

              <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white leading-[1.12]">
                {active.heading}
              </h3>

              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                {active.description}
              </p>

              <ul className="flex flex-col gap-2">
                {active.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
