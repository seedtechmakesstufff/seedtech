"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatedH2 } from "@/components/kit";
import { useQuoteFlow } from "@/components/quote-flow";

const Particles = dynamic(() => import("@/components/kit/Particles"), {
  ssr: false,
});

interface PartnerCTAProps {
  /** Override the heading text. Defaults to "Want to partner with us?" */
  heading?: string;
  /** Optional subtitle beneath the heading */
  subtitle?: string;
  className?: string;
}

export function PartnerCTA({
  heading = "Want to partner with us?",
  subtitle,
  className,
}: PartnerCTAProps) {
  const { openQuoteFlow } = useQuoteFlow();

  return (
    <section className={className ?? "bg-dark-base py-20 md:py-28"}>
      <div className="relative max-w-[1376px] mx-auto px-4 sm:px-6">
        {/* Gradient overlay — fades from page bg at bottom to transparent at top */}
        <div
          className="absolute inset-x-4 sm:inset-x-6 inset-y-0 z-[1] rounded-[20px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgb(10 10 15) 0%, rgb(10 10 15) 40%, rgba(10,10,15,0) 100%)",
          }}
        />

        {/* Particle canvas */}
        <div className="absolute inset-x-4 sm:inset-x-6 inset-y-0 overflow-hidden rounded-[20px]">
          <Particles
            particleColors={["#00ff9d"]}
            particleCount={4400}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={40}
            moveParticlesOnHover={false}
            alphaParticles
            disableRotation
            pixelRatio={2}
          />
        </div>

        {/* Inner card with radial gradient glow */}
        <div
          className="relative z-10 rounded-[20px] overflow-hidden py-20 md:py-28 px-6"
          style={{
            background:
              "radial-gradient(64.98% 103.37% at 49.97% -3.37%, rgba(0,255,157,0.20) 0%, rgba(0,153,94,0.00) 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Heading */}
            <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1] mb-6">
              {heading}
            </AnimatedH2>

            {subtitle && (
              <p className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button
                onClick={() => openQuoteFlow()}
                className="inline-flex items-center px-8 py-3.5 text-sm font-semibold text-white rounded-xl liquid-glass-tinted-seed liquid-glass-hover transition-all duration-300 overflow-hidden relative"
              >
                Get a Quote
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3.5 text-sm font-semibold text-white/70 hover:text-white rounded-xl border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
