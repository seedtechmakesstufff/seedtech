"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedH2 } from "@/components/kit";
import { AutopilotCards } from "./AutopilotCards";

export function AutopilotSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">

        {/* Section header */}
        <div className="text-center mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-3">
            SEO Autopilot
          </p>
          <AnimatedH2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            highlightWords={["Didn't."]}
          >
            Search Changed. The Fundamentals Didn&apos;t.
          </AnimatedH2>
          <p className="mt-4 text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            Search is changing fast, but the fundamentals still matter. SEO Autopilot turns search data, site context, audits, internal linking, and content workflows into one operating system — so your team can improve visibility with structure, consistency, and clear next steps.
          </p>
        </div>

        {/* Interactive mini + detail cards */}
        <AutopilotCards />

        {/* Bottom CTA link */}
        <div className="text-center mt-2">
          <Link
            href="/services/seo-autopilot"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-seed-400 transition-colors duration-200"
          >
            Explore the full SEO Autopilot platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
