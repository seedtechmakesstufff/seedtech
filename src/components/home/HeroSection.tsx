"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { GradientOrb, FloatingOrb, GridPattern } from "@/components/kit";
import { BodyLg } from "@/components/kit";
import { LiquidGlassPill } from "@/components/kit";
import { SplitTextReveal } from "@/components/kit";
import DotGrid from "@/components/ui/DotGrid";

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
    <section className="relative overflow-hidden bg-dark-base">
      {/* Background effects */}
      <GradientOrb
        color="seed"
        size="xl"
        className="top-0 left-1/4 -translate-y-1/3 opacity-20"
      />
      <GradientOrb
        color="blue"
        size="lg"
        className="bottom-0 right-0 translate-y-1/3 opacity-15"
      />
      <FloatingOrb
        color="cyan"
        size="sm"
        className="top-1/3 right-1/4 opacity-20"
        delay={2}
      />
      <GridPattern />

      {/* Interactive DotGrid background */}
      <div className="absolute inset-0 z-[1]">
        <DotGrid
          dotSize={4}
          gap={14}
          baseColor="#292929"
          activeColor="#03820b"
          proximity={120}
          speedTrigger={10}
          shockRadius={310}
          shockStrength={3}
          maxSpeed={5000}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-8 text-center w-full">

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
        <motion.div {...fadeUp(0.7)}>
          <BodyLg className="mt-6 max-w-2xl mx-auto">
            SeedTech builds and manages technology
          </BodyLg>
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
