"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import { LiquidGlassPill } from "@/components/kit";
import MattsCustomBackground from "@/components/ui/MattsCustomBackground";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EXPO_OUT } as Transition,
});

const heroCards = [
  { src: "/img/seed graphics/hero_websites.webp", alt: "SeedTech website builds — eCommerce and business sites" },
  { src: "/img/seed graphics/hero_2_1_5x.webp", alt: "SeedTech SEO dashboard and analytics" },
  { src: "/img/seed graphics/hero_3_1_5x.webp", alt: "SeedTech managed IT monitoring dashboard" },
  { src: "/img/seed graphics/hero_4_1_5x.webp", alt: "SeedTech trucking and logistics platform" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* WebGL mesh gradient background */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <MattsCustomBackground />
      </div>

      {/* Subtle dark gradient scrim to keep text readable over the moving background */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-black/85 via-black/60 to-black/25" />

      {/* Content layer */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-8 text-center w-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto">

        {/* Eyebrow */}
        <motion.p
          className="text-seed-400 text-eyebrow uppercase tracking-widest mb-6"
          {...fadeUp(0.1)}
        >
          Northern New Jersey IT Support, Websites, and SEO
        </motion.p>

        {/* Pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
          {...fadeUp(0.18)}
        >
          <LiquidGlassPill variant="default" size="sm" dot>
            Proactive IT Support
          </LiquidGlassPill>
          <LiquidGlassPill variant="seed" size="sm" dot>
            Custom Websites
          </LiquidGlassPill>
          <LiquidGlassPill variant="blue" size="sm" dot>
            SEO Support
          </LiquidGlassPill>
        </motion.div>

        {/* Hero headline — word-by-word reveal with per-word gradient */}
        <h1
          className="font-display text-display leading-[1.05] text-white"
          aria-label="Tech Support & Websites Built for Small and Medium Businesses"
        >
          {[
            { word: "Tech", cls: "" },
            { word: "Support", cls: "" },
            { word: "&", cls: "" },
            { word: "Websites", cls: "" },
            { word: "Built", cls: "" },
            { word: "for", cls: "" },
            { word: "Small", cls: "text-gradient-purple-blue" },
            { word: "and", cls: "" },
            { word: "Medium", cls: "text-gradient-web" },
            { word: "Businesses", cls: "" },
          ].map(({ word, cls }, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className={`inline-block${cls ? ` ${cls}` : ""}`}
                initial={{ y: "110%", opacity: 0, filter: "blur(28px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: EXPO_OUT }}
              >
                {word}{i < 9 ? "\u00A0" : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Body */}
        <motion.div {...fadeUp(0.7)} className="mt-6 max-w-2xl mx-auto space-y-4 text-white/85 text-body-lg font-[450] leading-relaxed">
          <p>
            SeedTech helps small and medium businesses bring their technology, support, and online presence together in a way that feels clear, connected, and easier to manage.
          </p>
          <p>
            From proactive IT support to custom websites and SEO, our goal is to make the tools your business depends on work better together.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.9)} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/free-audit"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-seed-600 to-seed-500 text-white hover:shadow-glowSeed transition-all duration-200"
          >
            Get a Free IT Assessment
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border border-white/20 text-white/80 hover:bg-white/[0.06] hover:border-white/30 transition-all duration-200"
          >
            See Our Services
          </Link>
        </motion.div>
      </div>

      {/* Hero showcase cards */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EXPO_OUT } as Transition}
        >
          {heroCards.map((card, i) => (
            <motion.div
              key={card.src}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/30"
              initial={{ opacity: 0, y: 30, rotateY: -4 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{
                duration: 0.7,
                delay: 1.1 + i * 0.12,
                ease: EXPO_OUT,
              } as Transition}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                priority={i < 2}
              />
              {/* Glass overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-base/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle fade-out at the bottom of cards */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-base to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}
