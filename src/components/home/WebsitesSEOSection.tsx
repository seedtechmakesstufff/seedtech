import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard } from "@/components/kit";

export function WebsitesSEOSection() {
  return (
    <Section theme="dark">
      <SectionHeader
        eyebrow="Websites and SEO"
        title="A Stronger Online Presence,"
        titleHighlight="Built with the Business in Mind"
        description="A business website should do more than just exist online."
        align="center"
        theme="dark"
      />

      <div className="max-w-3xl mx-auto">
        <GlassCard theme="dark" className="flex flex-col gap-6 p-10">
          <p className="text-body text-white/60 leading-relaxed">
            We help businesses build websites that are easier to manage, more aligned with their services, and better positioned for visibility over time. For the right fit, that can include custom development, platform-based builds, and SEO support tied to the site from the start.
          </p>

          <div className="pt-2">
            <Link
              href="/services/web-development"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-seed-600 to-seed-500 text-white hover:shadow-glowSeed transition-all duration-200"
            >
              Explore Website Development
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
