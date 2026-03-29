"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { LiquidGlassPill } from "@/components/kit";
import { SplitTextReveal } from "@/components/kit";
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
      {/* Ambient satin-wave canvas background */}
      <div className="absolute inset-0 z-[1]">
        <MattsCustomBackground />
      </div>

      {/* Content layer */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-8 text-center w-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto">

        {/* Liquid Glass service pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
          {...fadeUp(0.1)}
        >
          <LiquidGlassPill variant="default" size="sm" dot>
            Managed IT Support
          </LiquidGlassPill>
          <LiquidGlassPill variant="seed" size="sm" dot>
            Web Development
          </LiquidGlassPill>
          <LiquidGlassPill variant="blue" size="sm" dot>
            eCommerce
          </LiquidGlassPill>
        </motion.div>

        {/* Hero headline — word-by-word reveal */}
        <SplitTextReveal
          text="Technology Infrastructure & Websites Built for High-Performance Businesses"
          as="h1"
          delay={0.25}
          stagger={0.06}
          duration={0.7}
          highlightWords={["High-Performance"]}
          className="font-display text-display leading-[1.05] text-white"
        />

        {/* Subline */}
        <motion.div {...fadeUp(0.7)} className="mt-8 flex items-center justify-center gap-0 flex-wrap">
          {[
            { label: "Proactive Support" },
            { label: "Better Websites" },
            { label: "Less Stress" },
          ].map(({ label }, i) => (
            <span key={label} className="flex items-center">
              <span className="px-5 py-1 text-body-lg md:text-subheading font-body font-semibold text-white tracking-tight">
                {label}
              </span>
              {i < 2 && (
                <span className="w-px h-5 bg-white/20 mx-1 shrink-0" />
              )}
            </span>
          ))}
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
