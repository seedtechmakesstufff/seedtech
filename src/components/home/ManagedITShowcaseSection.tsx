"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Constants ── */
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── MSP value-point labels ── */

/* ── Animated word-by-word reveal (section-local, inView triggered) ── */
function WordReveal({
  children,
  className,
  stagger = 0.045,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  // Flatten children into a string, then split into words
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, filter: "blur(20px)" }}
            animate={
              inView
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : { y: "110%", opacity: 0, filter: "blur(20px)" }
            }
            transition={{
              duration: 0.65,
              delay: i * stagger,
              ease: EXPO_OUT,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Headline Section 1 — multi-line with "IT" in accent font ── */
function HeadlineBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const lines = [
    { parts: [{ text: "Doing IT the better way", cls: "" }] },
    { parts: [{ text: "Ensuring your business runs without interruption", cls: "" }] },
    { parts: [{ text: "& When you need us, we're always a call away.", cls: "" }] },
  ];

  let wordIndex = 0;

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-6 text-center">
      <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.08] text-white">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.parts.map((part, pi) => {
              const partWords = part.text.split(" ").filter(Boolean);
              return partWords.map((word, wi) => {
                const idx = wordIndex++;
                return (
                  <span key={`${li}-${pi}-${wi}`} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className={cn("inline-block", part.cls)}
                      initial={{ y: "110%", opacity: 0, filter: "blur(20px)" }}
                      animate={
                        inView
                          ? { y: 0, opacity: 1, filter: "blur(0px)" }
                          : { y: "110%", opacity: 0, filter: "blur(20px)" }
                      }
                      transition={{
                        duration: 0.65,
                        delay: 0.1 + idx * 0.045,
                        ease: EXPO_OUT,
                      }}
                    >
                      {word}
                      {"\u00A0"}
                    </motion.span>
                  </span>
                );
              });
            })}
          </span>
        ))}
      </h2>
    </div>
  );
}

/* ── Value-point card (dark, text-only, hover glow) ── */
function ValueCard({ label }: { label: string }) {
  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center",
        "aspect-[16/10]",
        "border border-white/[0.12]",
        "transition-all duration-500 cursor-default",
        "opacity-25 hover:opacity-100",
        "hover:border-white/[0.25] hover:bg-white/[0.03]",
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <span className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 text-center px-3 select-none">
        {label}
      </span>
    </motion.div>
  );
}

/* ── Grid rows ── */
const ROW_TOP = ["Cybersecurity", "Helpdesk Support", "Reduce Downtime", "Cybersecurity", "Proactive Monitoring", "Helpdesk"];
const ROW_MID = ["Monitoring", "Proactive Monitoring", "Backups", "Vendor Coordination", "Cybersecurity"];
const ROW_BOT = ["Cybersecurity", "Helpdesk Support", "Real People, Real Teams", "Cybersecurity", "Reduce Downtime", "Maintenance"];

/* ── Card grid (3 rows, center card always absolutely centered) ── */
function CardGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: EXPO_OUT }}
      className="relative w-full overflow-hidden"
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-r from-dark-base to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-l from-dark-base to-transparent pointer-events-none" />

      <div className="relative">
        {/* Background grid rows */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {ROW_TOP.map((l, i) => <ValueCard key={`t-${i}`} label={l} />)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {ROW_MID.map((l, i) => <ValueCard key={`m-${i}`} label={l} />)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {ROW_BOT.map((l, i) => <ValueCard key={`b-${i}`} label={l} />)}
          </div>
        </div>

        {/* Center CTA card — always dead-center */}
        <Link
          href="/services/managed-it"
          className={cn(
            "group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
            "flex flex-col items-center justify-center",
            "w-[55vw] max-w-[380px] aspect-[4/3]",
            "bg-white rounded-lg border-2 border-seed-500",
            "shadow-2xl shadow-seed-500/10",
            "transition-all duration-300",
            "hover:shadow-seed-500/25 hover:scale-[1.03]",
          )}
        >
          <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-[#c900d4] to-[#aba2f2] bg-clip-text text-transparent uppercase tracking-wider mb-2">
            Managed IT Support
          </span>
          <span className="font-bold text-xl sm:text-2xl md:text-[28px] text-dark-base leading-tight text-center">
            Your Business
          </span>
          <span className="font-bold text-xl sm:text-2xl md:text-[28px] text-dark-base leading-tight text-center">
            Runs Smoothly
          </span>
          <span className="mt-2 text-xs text-dark-base/60 underline underline-offset-2 group-hover:text-dark-base transition-colors">
            Learn more
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Stat item with gradient number ── */
function Stat({
  value,
  label,
  multiLine,
}: {
  value: string;
  label: string;
  multiLine?: boolean;
}) {
  return (
    <div className="flex items-center gap-6 sm:gap-8">
      <span className="text-6xl sm:text-7xl md:text-[80px] font-bold bg-gradient-to-r from-[#c900d4] to-[#aba2f2] bg-clip-text text-transparent leading-none shrink-0">
        {value}
      </span>
      {multiLine ? (
        <span className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug whitespace-pre-line">
          {label}
        </span>
      ) : (
        <span className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

/* ── Stats block (section 3) ── */
function StatsBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const stats = [
    { value: "200+", label: "Brands" },
    { value: "20+", label: "Years in IT Experience" },
    {
      value: "65",
      label: "Hours on average of saved from\npotential downtime per month\nper user",
      multiLine: true,
    },
    { value: "∞", label: "Ability to resolve tasks\nthat keep you running", multiLine: true },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EXPO_OUT }}
      className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14"
    >
      {stats.map((s, i) => (
        <Stat key={i} {...s} />
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   Main export
   ══════════════════════════════════════════════════ */
export function ManagedITShowcaseSection() {
  return (
    <section className="bg-dark-base py-24 md:py-32 overflow-hidden">
      {/* Section 1 — Large headline with GSAP-style word reveal */}
      <HeadlineBlock />

      {/* Section 2 — MSP value-point card grid */}
      <div className="mt-16 md:mt-24">
        <CardGrid />
      </div>

      {/* Section 3 — Large italic statement + stats */}
      <div className="mt-20 md:mt-28 space-y-16 md:space-y-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <WordReveal
            as="p"
            className="font-display text-[clamp(1.5rem,4.5vw,4rem)] leading-[1.15] text-white"
            stagger={0.035}
          >
            More than just IT Support - regardless of company size, our brands run more efficiently and reliably.
          </WordReveal>
        </div>

        <StatsBlock />
      </div>
    </section>
  );
}
