import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button, GradientText, BodyLg } from "@/components/kit";
import { GradientOrb, GridPattern } from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-dark-base">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-25" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-20" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
          <p className="mb-6 font-mono text-eyebrow uppercase tracking-[0.2em] text-seed-400">
            IT Support · Web Development · Digital Marketing
          </p>
          <h1 className="font-display text-display font-bold leading-[1.05] text-white">
            Technology That{" "}
            <GradientText as="span">Grows</GradientText>{" "}
            Your Business
          </h1>
          <BodyLg className="mt-6 max-w-2xl mx-auto text-light-base/60">
            SeedTech delivers proactive managed IT, stunning web experiences,
            and data-driven marketing — all under one roof.
          </BodyLg>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base rounded-xl font-medium transition-all duration-300 bg-gradient-brand text-white hover:shadow-glowSeed">
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Button variant="ghost" size="lg" href="/services">
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder sections — will be built out */}
      <Section>
        <SectionHeader
          eyebrow="Why SeedTech"
          title="Your All-in-One Technology Partner"
          description="From proactive IT management to high-converting websites, we handle the tech so you can focus on growth."
        />
      </Section>

      <Section theme="light">
        <SectionHeader
          theme="light"
          eyebrow="Services"
          title="What We Do"
          description="Three pillars of service designed to keep your business running, visible, and growing."
        />
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Results"
          title="Our Work Speaks for Itself"
          description="Real outcomes for real businesses — here's what we've accomplished."
        />
      </Section>
    </>
  );
}
