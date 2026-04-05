"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatedH2, HoverPreview } from "@/components/kit";
import type { HoverTarget } from "@/components/kit/HoverPreview";

const Particles = dynamic(() => import("@/components/kit/Particles"), {
  ssr: false,
});

const hoverTargets: HoverTarget[] = [
  {
    text: "Managed IT Support",
    imageUrl: "/img/seed graphics/home/managed_it_support_hover_card_v2.webp",
    linkUrl: "/services/managed-it",
    altText: "Managed IT Support",
  },
  {
    text: "Basic Websites",
    imageUrl: "/img/seed graphics/home/basic_websites_hover_card_3x.webp",
    linkUrl: "/services/seedtech-platform",
    altText: "Basic Websites",
  },
  {
    text: "eCommerce",
    imageUrl: "/img/seed graphics/home/ecommerce_hover_card_3x.webp",
    linkUrl: "/services/ecommerce-development",
    altText: "eCommerce",
  },
  {
    text: "Custom Development",
    imageUrl: "/img/seed graphics/home/custom_development_hover_card_3x.webp",
    linkUrl: "/services/custom-development",
    altText: "Custom Development",
  },
];

export function ReadyDeeperSection() {
  return (
    <section className="bg-dark-base py-20 md:py-28">
      {/* Outer wrapper — particles fill this area behind the card */}
      <div className="relative max-w-[1376px] mx-auto px-4 sm:px-6">
        {/* Gradient div — fades from page background (top) to transparent (bottom) */}
        <div
          className="absolute inset-x-4 sm:inset-x-6 inset-y-0 z-[1] rounded-[20px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgb(10 10 15) 0%, rgb(10 10 15) 40%, rgba(10,10,15,0) 100%)",
          }}
        />

        {/* Particle canvas — pinned to card edges (accounts for parent padding) */}
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
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-12">
              <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
                Ready to go deeper?
              </AnimatedH2>
            </div>

            {/* Large descriptive text with hoverable service names */}
            <p className="text-center text-xl md:text-2xl lg:text-3xl leading-relaxed text-white/60 font-light">
              <HoverPreview
                content="Learn more about how our services — {0}, Web Development from {1}, {2}, to {3} — can help grow your business."
                targets={hoverTargets}
                imagePosition="above"
                imageWidth={300}
                imageHeight={200}
                maxRotation={8}
                maxOffset={10}
                targetClassName="text-white font-medium"
              />
            </p>

            <p className="text-center text-sm text-white/25 mt-12">
              Not sure where to start?{" "}
              <Link
                href="/contact"
                className="text-seed-400/70 hover:text-seed-400 transition-colors"
              >
                Contact us and we&apos;ll point you in the right direction.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
