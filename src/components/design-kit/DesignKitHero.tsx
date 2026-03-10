import { GradientText, Display, BodyLg } from "@/components/kit";
import { GradientOrb } from "@/components/kit";

export function DesignKitHero() {
  return (
    <section className="relative overflow-hidden py-32 bg-dark-base text-center">
      <GradientOrb color="seed" size="xl" className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.2em] text-seed-400">
          Design System
        </p>
        <Display>
          <GradientText>SeedTech</GradientText> Design Kit
        </Display>
        <BodyLg className="mt-6 text-light-base/60 max-w-2xl mx-auto">
          Every color, gradient, shadow, typography style, and component used
          across the SeedTech website — built for consistency and speed.
        </BodyLg>
      </div>
    </section>
  );
}
