"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { GradientOrb, GridPattern, CTABanner, LiquidGlassPill } from "@/components/kit";
import { projects } from "@/data/projects";
import type { Department } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useQuoteFlow } from "@/components/quote-flow";

type Filter = "all" | Department;

const filters: { label: string; value: Filter }[] = [
  { label: "All Projects", value: "all" },
  { label: "Web Development", value: "web-development" },
  { label: "IT Support", value: "it-support" },
];

export default function OurWorkPage() {
  const [active, setActive] = useState<Filter>("all");
  const { openQuoteFlow } = useQuoteFlow();

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.department === active);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-24 text-center">
        <GradientOrb color="seed" size="xl" className="-top-40 left-1/2 -translate-x-1/2 opacity-20" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <LiquidGlassPill variant="seed" className="mb-4">Our Work</LiquidGlassPill>
          <h1 className="font-display text-title md:text-display font-bold text-white">
            Projects That Drive{" "}
            <span className="text-gradient-brand">Real Results</span>
          </h1>
          <p className="mt-6 text-body-lg text-light-base/60 max-w-2xl mx-auto">
            From custom ecommerce platforms to managed IT infrastructure — here&apos;s what we&apos;ve built and the outcomes we&apos;ve delivered.
          </p>
        </div>
      </section>

      {/* Filter tabs + grid */}
      <Section>
        {/* Filter tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 p-1 liquid-glass rounded-xl">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active === f.value
                    ? "liquid-glass-tinted-seed text-white"
                    : "text-light-base/50 hover:text-light-base/80"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project count */}
        <p className="text-center text-body-sm text-light-base/30 mb-8">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Want Results Like These?"
          description="Let&apos;s talk about your project. We&apos;ll scope it out, give you an honest quote, and start building."
          primaryLabel="Start a Project"
          onPrimaryClick={() => openQuoteFlow()}
          secondaryLabel="View Our Services"
          secondaryHref="/services"
        />
      </Section>
    </div>
  );
}
