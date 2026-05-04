"use client";

import { ArrowRight } from "lucide-react";
import { useQuoteFlow } from "@/components/quote-flow/quote-flow-provider";
import { cn } from "@/lib/utils";

interface SeoPlanCtaProps {
  planName: string;
  ctaLabel: string;
  highlight?: boolean;
}

/**
 * Client-side CTA button for SEO restaurant pricing cards.
 * Opens the unified Quote Flow modal directly to the SEO contact form
 * with the chosen plan preselected.
 */
export function SeoPlanCta({ planName, ctaLabel, highlight = false }: SeoPlanCtaProps) {
  const { openQuoteFlow } = useQuoteFlow();

  return (
    <button
      type="button"
      onClick={() => openQuoteFlow("seo", planName)}
      className={cn(
        "flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300",
        highlight
          ? "bg-gradient-to-r from-seed-500 to-emerald-500 text-white hover:shadow-glowSeed"
          : "border border-dark-base/10 text-dark-base hover:border-seed-500 hover:text-seed-600"
      )}
    >
      {ctaLabel} <ArrowRight className="w-4 h-4" />
    </button>
  );
}
