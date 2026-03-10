import { GlassCard, ElevatedCard, TeamMemberCard, TestimonialCard } from "@/components/kit";
import { Subheading, Body } from "@/components/kit";

export function CardShowcase() {
  return (
    <div className="space-y-12 mt-4">
      {/* Glass Cards */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          GlassCard (dark / light)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard theme="dark">
            <Subheading>Dark Glass Card</Subheading>
            <Body className="mt-2 text-light-base/60">
              Semi-transparent backdrop-blur container with subtle border glow on hover.
            </Body>
          </GlassCard>
          <GlassCard theme="light">
            <Subheading className="text-dark-base">Light Glass Card</Subheading>
            <Body className="mt-2 text-dark-base/60">
              Light variant for sections with a white background theme.
            </Body>
          </GlassCard>
        </div>
      </div>

      {/* Elevated Cards */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          ElevatedCard (normal / highlight)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElevatedCard>
            <Subheading>Standard</Subheading>
            <Body className="mt-2 text-light-base/60">Elevated card with subtle dark shadow.</Body>
          </ElevatedCard>
          <ElevatedCard highlight>
            <Subheading>Highlighted</Subheading>
            <Body className="mt-2 text-light-base/60">Pricing highlight glow for the featured tier.</Body>
          </ElevatedCard>
          <ElevatedCard>
            <Subheading>Standard</Subheading>
            <Body className="mt-2 text-light-base/60">Another standard elevated card example.</Body>
          </ElevatedCard>
        </div>
      </div>

      {/* Team Member Cards */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          TeamMemberCard
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamMemberCard
            name="Sam Johnson"
            role="Founder & CEO"
            bio="Full-stack developer with 10+ years of experience building scalable web applications."
          />
          <TeamMemberCard
            name="Alex Rivera"
            role="Lead Developer"
            bio="Specializes in React, TypeScript, and cloud infrastructure."
          />
          <TeamMemberCard
            name="Jordan Lee"
            role="IT Director"
            bio="15+ years managing enterprise IT environments for growing businesses."
          />
        </div>
      </div>

      {/* Testimonial Cards */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          TestimonialCard
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestimonialCard
            quote="SeedTech completely transformed our IT infrastructure. Downtime dropped by 90% in the first quarter."
            name="Maria Chen"
            role="COO, TechStart Inc."
            rating={5}
          />
          <TestimonialCard
            quote="Their web development team delivered a site that increased our conversions by 45%. Incredible ROI."
            name="David Park"
            role="Marketing Director, GrowthCo"
            rating={5}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}
