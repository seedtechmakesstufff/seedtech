"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedH2 } from "@/components/kit";

export function ReadyDeeperSection() {
  return (
    <section className="bg-dark-base min-h-[60vh] flex flex-col justify-center border-t border-white/[0.05] py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 w-full text-center">

        <p className="text-seed-400 text-eyebrow uppercase tracking-widest mb-4">
          Getting Started
        </p>

        <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
          Start with a Conversation, Not a Sales Pitch
        </AnimatedH2>

        <p className="mt-6 text-body text-white/55 leading-relaxed max-w-xl mx-auto">
          Every business is different. We start by learning about your current setup, your goals, and where the biggest opportunities or frustrations are.
        </p>
        <p className="mt-4 text-body text-white/55 leading-relaxed max-w-xl mx-auto">
          From there, we can recommend the right next step — whether that is managed IT support, a website project, SEO help, or a combination of services.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-seed-600 to-seed-500 text-white hover:shadow-glowSeed transition-all duration-200"
          >
            Request a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border border-white/20 text-white/80 hover:bg-white/[0.06] hover:border-white/30 transition-all duration-200"
          >
            View Services
          </Link>
        </div>

      </div>
    </section>
  );
}
