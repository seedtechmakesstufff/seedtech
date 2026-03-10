import { Section } from "@/components/layout/Section";

export const metadata = {
  title: "IT Support Pricing — SeedTech",
  description: "Transparent pricing for SeedTech managed IT support plans.",
};

export default function ITSupportPricingPage() {
  return (
    <div className="pt-20">
      <Section>
        <div className="max-w-3xl">
          <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-4">Pricing</p>
          <h1 className="font-display text-title md:text-display text-white mb-6">
            IT Support Pricing
          </h1>
          <p className="text-body-lg text-light-base/60">
            Simple, predictable pricing for managed IT support. Plans coming soon — contact us for a custom quote.
          </p>
        </div>
      </Section>
    </div>
  );
}
