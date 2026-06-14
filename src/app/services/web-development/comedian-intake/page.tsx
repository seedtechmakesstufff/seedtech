import type { Metadata } from "next";
import { Mic2 } from "lucide-react";
import { GradientOrb, GridPattern } from "@/components/kit";
import { IntakeWizard } from "@/components/forms/intake/IntakeWizard";
import { COMEDIAN_INTAKE_CONFIG } from "@/lib/intake/config-comedian";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Comedian & Live Comedy Website Intake | SeedTech",
  description:
    "Start your comedian or live comedy website project with SeedTech. This intake form helps us understand your shows, booking goals, merch, clips & specials, and design direction so we can scope your project properly.",
  robots: { index: false },
};

export default function ComedianIntakePage() {
  return (
    <div className="pt-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Web Development", url: "/services/web-development" },
          { name: "Comedian & Live Comedy Website Intake", url: "/services/web-development/comedian-intake" },
        ]}
      />

      <section className="relative overflow-hidden bg-dark-base py-24 md:py-32">
        <GradientOrb color="seed" size="xl" className="-top-44 left-1/2 -translate-x-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-seed-500/20 bg-seed-500/[0.07] text-seed-400 text-sm font-medium mb-6">
              <Mic2 className="w-4 h-4" />
              Comedian &amp; Live Comedy Website
            </div>
            <h1 className="font-display text-heading md:text-heading-lg text-white mb-4 leading-tight">
              Project Intake Form
            </h1>
            <p className="text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
              This form helps us understand your act, show schedule, booking goals, merch, clips &amp; specials, and website requirements — so we can scope your project properly and give you an accurate proposal.
            </p>
            <p className="text-xs text-white/25 mt-3">
              Designed for stand-ups, improv &amp; sketch groups, podcast hosts, and touring comedians of all sizes.
            </p>
          </div>

          {/* Form */}
          <IntakeWizard config={COMEDIAN_INTAKE_CONFIG} />
        </div>
      </section>
    </div>
  );
}
