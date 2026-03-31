"use client";

import Link from "next/link";
import { AnimatedH2, HoverPreview } from "@/components/kit";
import type { HoverTarget } from "@/components/kit/HoverPreview";

const hoverTargets: HoverTarget[] = [
  {
    text: "Managed IT Support",
    imageUrl: "/img/seed graphics/home/managed_it_support_hover_card_3x.webp",
    linkUrl: "/services/managed-it",
    altText: "Managed IT Support dashboard",
  },
  {
    text: "Basic Websites",
    imageUrl: "/img/seed graphics/home/basic_websites_hover_card_3x.webp",
    linkUrl: "/services/seedtech-platform",
    altText: "Basic website builder",
  },
  {
    text: "eCommerce",
    imageUrl: "/img/seed graphics/home/ecommerce_hover_card_3x.webp",
    linkUrl: "/services/ecommerce-development",
    altText: "eCommerce storefront",
  },
  {
    text: "Custom Development",
    imageUrl: "/img/seed graphics/home/custom_development_hover_card_3x.webp",
    linkUrl: "/services/custom-development",
    altText: "Custom web application",
  },
];

export function ReadyDeeperSection() {
  return (
    <section className="bg-dark-base min-h-[80vh] flex flex-col justify-center border-t border-white/[0.05] py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 w-full">

        {/* Heading */}
        <div className="text-center mb-16">
          <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
            Ready to go deeper?
          </AnimatedH2>
        </div>

        {/* Large descriptive text with hoverable service names */}
        <p className="text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.5] text-white/55 font-light tracking-tight">
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

        <p className="text-center text-sm text-white/25 mt-16">
          Not sure where to start?{" "}
          <Link href="/contact" className="text-seed-400/70 hover:text-seed-400 transition-colors">
            Contact us and we&apos;ll point you in the right direction.
          </Link>
        </p>

      </div>
    </section>
  );
}
