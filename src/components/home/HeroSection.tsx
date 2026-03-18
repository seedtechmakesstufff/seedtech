"use client";

import { motion, type Transition } from "framer-motion";
import { GradientOrb, FloatingOrb, GridPattern } from "@/components/kit";
import { BodyLg } from "@/components/kit";
import { LiquidGlassPill } from "@/components/kit";
import { SplitTextReveal } from "@/components/kit";
import { Button } from "@/components/kit";
import GradualBlur from "@/components/ui/GradualBlur";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EXPO_OUT } as Transition,
});

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-dark-base">
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-24 text-center w-full">

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
            AI-Accelerated Development
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
            SeedTech helps trucking companies, construction firms, law practices, and medical clinics launch faster websites, secure their technology, and streamline operations with AI-accelerated development and proactive IT support.
          </BodyLg>
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          {...fadeUp(0.85)}
        >
          <Button variant="primary" size="lg" icon="arrow" href="/free-audit">
            Get a Free Technology &amp; Website Audit
          </Button>

          <Button variant="ghost" size="lg" icon="arrow" href="/industries">
            View Industry Solutions
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div className="mt-14" {...fadeUp(1.0)}>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-4 liquid-glass rounded-2xl text-sm text-white/60">
            {[
              "8+ Years Supporting Growing Businesses",
              "Managed IT + Web Development in One Team",
              "AI-Accelerated Development for Faster Launches",
              "Trusted by Companies Across New Jersey",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-seed-400">✓</span>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradual blur — fades the section bottom into the next section */}
      <GradualBlur
        position="bottom"
        height="10rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential
        zIndex={20}
      />
    </section>
  );
}
