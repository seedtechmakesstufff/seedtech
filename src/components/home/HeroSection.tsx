"use client";

import { motion, type Transition } from "framer-motion";
import { GradientOrb, FloatingOrb, GridPattern } from "@/components/kit";
import { BodyLg } from "@/components/kit";
import { LiquidGlassPill, LiquidGlassBar } from "@/components/kit";
import { SplitTextReveal } from "@/components/kit";
import { Button } from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ArrowRight } from "lucide-react";

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
            Digital Marketing
          </LiquidGlassPill>
        </motion.div>

        {/* Hero headline — word-by-word reveal */}
        <SplitTextReveal
          text="Technology That Grows Your Business"
          as="h1"
          delay={0.25}
          stagger={0.07}
          duration={0.7}
          highlightWords={["Grows"]}
          className="font-display text-display leading-[1.05] text-white"
        />

        {/* Subline */}
        <motion.div {...fadeUp(0.7)}>
          <BodyLg className="mt-6 max-w-2xl mx-auto">
            SeedTech delivers proactive managed IT, stunning web experiences,
            and data-driven marketing — all under one roof.
          </BodyLg>
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          {...fadeUp(0.85)}
        >
          <QuoteButton
            className={[
              "liquid-glass-tinted-seed liquid-glass-hover",
              "inline-flex items-center justify-center gap-3",
              "px-8 py-4 text-base rounded-2xl font-medium",
              "text-white relative overflow-hidden transition-colors duration-300",
            ].join(" ")}
          >
            Get a Free Quote
            <ArrowRight className="w-4 h-4 shrink-0" />
          </QuoteButton>

          <Button variant="ghost" size="lg" icon="arrow" href="/services">
            Explore Services
          </Button>
        </motion.div>

        {/* Floating stat bar */}
        <motion.div
          className="mt-16 flex justify-center"
          {...fadeUp(1.0)}
        >
          <LiquidGlassBar rounded="pill" className="gap-0 px-2 py-2">
            <div className="text-center px-6 py-1">
              <p className="font-display text-subheading text-white leading-none">200+</p>
              <p className="text-body-sm text-white/50 mt-1">Clients Served</p>
            </div>
            <div className="w-px h-10 bg-white/10 shrink-0" />
            <div className="text-center px-6 py-1">
              <p className="font-display text-subheading text-white leading-none">99.9%</p>
              <p className="text-body-sm text-white/50 mt-1">Uptime SLA</p>
            </div>
            <div className="w-px h-10 bg-white/10 shrink-0" />
            <div className="text-center px-6 py-1">
              <p className="font-display text-subheading text-white leading-none">15+</p>
              <p className="text-body-sm text-white/50 mt-1">Years Experience</p>
            </div>
          </LiquidGlassBar>
        </motion.div>
      </div>
    </section>
  );
}
