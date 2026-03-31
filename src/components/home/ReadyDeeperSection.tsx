"use client";

import Link from "next/link";
import { AnimatedH2, HoverPreview } from "@/components/kit";
import type { HoverTarget } from "@/components/kit/HoverPreview";

const hoverTargets: HoverTarget[] = [
  {
    text: "Managed IT Support",
    imageUrl: "/img/seed graphics/hero_1_1_5x.webp",
    linkUrl: "/services/managed-it",
    altText: "Managed IT Support dashboard",
  },
  {
    text: "Basic Websites",
    imageUrl: "/img/seed graphics/seedtech_platform_website_build.webp",
    linkUrl: "/services/seedtech-platform",
    altText: "Basic website builder",
  },
  {
    text: "eCommerce",
    imageUrl: "/img/seed graphics/hero_3_1_5x.webp",
    linkUrl: "/services/ecommerce-development",
    altText: "eCommerce storefront",
  },
  {
    text: "Custom Development",
    imageUrl: "/img/seed graphics/hero_4_1_5x.webp",
    linkUrl: "/services/custom-development",
    altText: "Custom web application",
  },
];

export function ReadyDeeperSection() {
  return (
    <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-6">

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
          <Link href="/contact" className="text-seed-400/70 hover:text-seed-400 transition-colors">
            Contact us and we&apos;ll point you in the right direction.
          </Link>
        </p>

      </div>
    </section>
  );
}
