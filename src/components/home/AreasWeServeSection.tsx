"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { AnimatedH2 } from "@/components/kit";

const towns = [
  { name: "Morristown", href: "/locations/morristown-it-support", county: "Morris" },
  { name: "Mendham", href: "/locations/mendham-it-support", county: "Morris" },
  { name: "Chester", href: "/locations/chester-it-support", county: "Morris" },
  { name: "Bernardsville", href: "/locations/bernardsville-it-support", county: "Somerset" },
  { name: "Basking Ridge", href: "/locations/basking-ridge-it-support", county: "Somerset" },
];

const counties = [
  { name: "Morris County", href: "/locations/morris-county-it-support" },
  { name: "Somerset County", href: "/locations/somerset-county-it-support" },
  { name: "Essex County", href: "/locations/essex-county-it-support" },
  { name: "Union County", href: "/locations/union-county-it-support" },
];

export function AreasWeServeSection() {
  return (
    <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seed-400 mb-4">
            Northern New Jersey
          </p>
          <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
            Areas We Serve
          </AnimatedH2>
          <p className="mt-5 text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
            On-site and remote IT support across Morris, Somerset, Essex, and Union counties. Local expertise, enterprise-grade solutions.
          </p>
        </div>

        {/* Town cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {towns.map((town) => (
            <Link
              key={town.href}
              href={town.href}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-8 transition-all duration-300 hover:border-seed-500/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-seed-500/10 text-seed-400 transition-colors group-hover:bg-seed-500/20">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-white">{town.name}</span>
              <span className="text-[11px] text-white/35">{town.county} County</span>
            </Link>
          ))}
        </div>

        {/* County pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {counties.map((county) => (
            <Link
              key={county.href}
              href={county.href}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/60 transition-all duration-300 hover:border-seed-500/30 hover:text-white hover:bg-white/[0.06]"
            >
              {county.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
