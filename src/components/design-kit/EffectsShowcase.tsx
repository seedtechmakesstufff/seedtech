import {
  GradientOrb, FloatingOrb, GridPattern, DotPattern, AmbientGlow, GradientOverlay,
} from "@/components/kit";

export function EffectsShowcase() {
  return (
    <div className="space-y-10 mt-4">
      {/* Gradient Orbs */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          GradientOrb
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <GradientOrb color="seed" className="top-4 left-8" />
          <GradientOrb color="blue" className="top-8 right-12" />
          <GradientOrb color="cyan" className="bottom-4 left-1/3" />
        </div>
      </div>

      {/* Floating Orbs (animated) */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          FloatingOrb (animated)
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <FloatingOrb color="seed" className="top-4 left-12" delay={0} />
          <FloatingOrb color="blue" className="bottom-4 right-16" delay={2} />
        </div>
      </div>

      {/* Grid Pattern */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          GridPattern
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <GridPattern />
        </div>
      </div>

      {/* Dot Pattern */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          DotPattern
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <DotPattern />
        </div>
      </div>

      {/* Ambient Glow */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          AmbientGlow
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <AmbientGlow color="seed" />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          GradientOverlay
        </span>
        <div className="relative h-48 rounded-xl bg-dark-base border border-white/5 overflow-hidden">
          <GradientOverlay />
          <p className="relative z-10 flex items-center justify-center h-full text-body-lg text-white/60">
            Content with gradient overlay behind it
          </p>
        </div>
      </div>
    </div>
  );
}
