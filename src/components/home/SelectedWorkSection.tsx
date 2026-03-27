"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * 8 images in a 2-column bento grid that mirrors the screenshot layout.
 * Each row is a pair; within a pair, one card can be "tall" (spans 2 rows)
 * or they can be equal height. We use a CSS grid approach.
 */
const works = [
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_1_1_5x.webp",
    alt: "PaddlersCove — Custom inventory management console",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_2_1_5x.webp",
    alt: "PaddlersCove — BigCommerce mobile storefront",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_3_1_5x.webp",
    alt: "SeedTech — Managed IT Services",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_4_1_5x.webp",
    alt: "StarCom Fiber — Custom dashboard & monitoring",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_5_1_5x.webp",
    alt: "BioOx — eCommerce water products store",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_6_1_5x.webp",
    alt: "Megasafe — High security safes website",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_7_1_5x.webp",
    alt: "Mesa — Insider deals eCommerce platform",
  },
  {
    src: "/img/seed graphics/homepage-selected-works/our_work_8_1_5x.webp",
    alt: "Trevor Noah — Back to Abnormal world tour site",
  },
];

function WorkCard({
  src,
  alt,
  index,
  className,
}: {
  src: string;
  alt: string;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EXPO_OUT }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-dark-elevated border border-white/[0.06]",
        "transition-all duration-500",
        "hover:border-white/[0.12] hover:shadow-lg hover:shadow-seed-500/5",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Subtle bottom gradient on hover for future caption use */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export function SelectedWorkSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-dark-base">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
            Selected{" "}
            <span className="inline-block bg-gradient-to-r from-seed-400 to-emerald-400 bg-clip-text text-transparent italic pr-2">
              Work
            </span>
          </h2>
          <Link
            href="/our-work"
            className="inline-flex items-center gap-2 mt-4 text-sm text-white/40 hover:text-white/70 transition-colors group"
          >
            See all our work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Bento grid — 2 columns, 4 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Row 1 — equal height */}
          <WorkCard {...works[0]} index={0} className="aspect-[4/3]" />
          <WorkCard {...works[1]} index={1} className="aspect-[4/3]" />

          {/* Row 2 — equal height */}
          <WorkCard {...works[2]} index={2} className="aspect-[4/3]" />
          <WorkCard {...works[3]} index={3} className="aspect-[4/3]" />

          {/* Row 3 — equal height */}
          <WorkCard {...works[4]} index={4} className="aspect-[4/3]" />
          <WorkCard {...works[5]} index={5} className="aspect-[4/3]" />

          {/* Row 4 — equal height */}
          <WorkCard {...works[6]} index={6} className="aspect-[4/3]" />
          <WorkCard {...works[7]} index={7} className="aspect-[4/3]" />
        </div>
      </div>
    </section>
  );
}
