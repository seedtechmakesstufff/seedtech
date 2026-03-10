import { CTABanner } from "@/components/kit";

export function CTAShowcase() {
  return (
    <div className="mt-4">
      <CTABanner
        title="Ready to Transform Your IT?"
        description="Schedule a free consultation and discover how SeedTech can streamline your operations, strengthen your security, and accelerate your growth."
        primaryLabel="Get a Free Quote"
        primaryHref="/contact"
        secondaryLabel="View Our Work"
        secondaryHref="/our-work"
      />
    </div>
  );
}
