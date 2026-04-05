"use client";

import Image from "next/image";
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

        {/* Pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
          {...fadeUp(0.18)}
        >
          <LiquidGlassPill variant="default" size="sm" dot>
            Proactive IT Support
          </LiquidGlassPill>
          <LiquidGlassPill variant="seed" size="sm" dot>
            Web Development
          </LiquidGlassPill>
          <LiquidGlassPill variant="blue" size="sm" dot>
            SEO
          </LiquidGlassPill>
        </motion.div>

        {/* Hero headline — word-by-word reveal with per-word gradient */}
        <h1
          className="font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[1.05] text-white"
          aria-label="Technology Infrastructure & Websites Built for High-Performance Businesses"
        >
          {[
            { word: "Technology", cls: "" },
            { word: "Infrastructure", cls: "" },
            { word: "&", cls: "" },
            { word: "Websites", cls: "" },
            { word: "Built", cls: "" },
            { word: "for", cls: "" },
            { word: "High-Performance", cls: "text-gradient-purple-blue" },
            { word: "Businesses", cls: "" },
          ].map(({ word, cls }, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className={`inline-block${cls ? ` ${cls}` : ""}`}
                initial={{ y: "110%", opacity: 0, filter: "blur(28px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: EXPO_OUT }}
              >
                {word}{i < 7 ? "\u00A0" : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Body */}
        <motion.div {...fadeUp(0.7)} className="mt-6 max-w-2xl mx-auto space-y-4 text-white/85 text-body-lg font-[450] leading-relaxed">
          <p>
            From proactive IT support to custom websites and SEO, our goal is to make the tools your business depends on work better together.
          </p>
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

      {/* Bottom bleed — masks the WebGL animation edge and creates a
          seamless visual transition into the next section's dark-base bg.
          z-[5] puts it IN FRONT of the WebGL canvas (z-[1]) but BEHIND
          the content layer (z-10) so cards render crisp on top. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none h-[60%]"
        style={{
          background:
            "linear-gradient(to top, rgb(10 10 15) 0%, rgb(10 10 15) 12%, rgb(10 10 15 / 0.92) 25%, rgb(10 10 15 / 0.65) 45%, rgb(10 10 15 / 0.3) 65%, rgb(10 10 15 / 0.08) 82%, transparent 100%)",
        }}
      />
    </section>
  );
}
