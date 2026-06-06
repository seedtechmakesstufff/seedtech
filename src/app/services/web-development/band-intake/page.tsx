import type { Metadata } from "next";
import { Music } from "lucide-react";
import { GradientOrb, GridPattern } from "@/components/kit";
import { BandIntakeForm } from "@/components/forms/BandIntakeForm";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Band & Touring Website Intake | SeedTech",
  description:
    "Start your band or touring website project with SeedTech. This intake form helps us understand your goals, tour needs, merch setup, and design direction so we can scope your project properly.",
  robots: { index: false },
};

export default function BandIntakePage() {
  return (
    <div className="pt-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Web Development", url: "/services/web-development" },
          { name: "Band & Touring Website Intake", url: "/services/web-development/band-intake" },
        ]}
      />

      <section className="relative overflow-hidden bg-dark-base py-24 md:py-32">
        <GradientOrb color="seed" size="xl" className="-top-44 left-1/2 -translate-x-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-seed-500/20 bg-seed-500/[0.07] text-seed-400 text-sm font-medium mb-6">
              <Music className="w-4 h-4" />
              Band &amp; Touring Website
            </div>
            <h1 className="font-display text-heading md:text-heading-lg text-white mb-4 leading-tight">
              Project Intake Form
            </h1>
            <p className="text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
              This form helps us understand your band, tour goals, merch needs, fan engagement ideas, and website requirements — so we can scope your project properly and give you an accurate proposal.
            </p>
            <p className="text-xs text-white/25 mt-3">
              Designed for bands, artists, managers, booking contacts, and touring acts of all sizes.
            </p>
          </div>

          {/* Form */}
          <BandIntakeForm />
        </div>
      </section>
    </div>
  );
}
