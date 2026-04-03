import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb } from "@/components/kit";

const bullets = [
  "Business-hours help desk support",
  "Monitoring and maintenance",
  "Cybersecurity protection",
  "Backup and recovery support",
  "Clear recommendations and follow-through",
];

export function ManagedITFeatureSection() {
  return (
    <Section theme="light">
      <GradientOrb
        color="seed"
        size="md"
        className="top-0 right-0 translate-x-1/3 -translate-y-1/3 opacity-10"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
        {/* Left: copy */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            eyebrow="Managed IT Support"
            title="Built for Small and Mid-Sized"
            titleHighlight="Businesses That Need Dependable IT"
            align="left"
            theme="light"
          />

          <p className="text-body text-dark-base/60 leading-relaxed">
            Technology issues cost time, create frustration, and slow teams down.
          </p>
          <p className="text-body text-dark-base/60 leading-relaxed">
            SeedTech provides proactive IT support for businesses in Northern New Jersey that want more than break-fix help. We monitor systems, support users, strengthen security, and work to prevent the same problems from happening again.
          </p>

          <ul className="space-y-3 mt-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-body-sm text-dark-base/70">
                <Check className="w-4 h-4 text-seed-600 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <Link
              href="/services/managed-it"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-seed-600 to-seed-500 text-white hover:shadow-glowSeed transition-all duration-200"
            >
              Explore Managed IT Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: visual accent block */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="rounded-3xl bg-seed-50 border border-seed-100 p-10 flex flex-col gap-6">
            <p className="font-display text-heading text-dark-base leading-snug">
              More than break-fix help
            </p>
            <p className="text-body-sm text-dark-base/55 leading-relaxed">
              Proactive monitoring and maintenance — not just a number to call when something breaks.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { label: "Help Desk", sub: "Business hours" },
                { label: "Monitoring", sub: "Systems & alerts" },
                { label: "Security", sub: "Layered protection" },
                { label: "Backups", sub: "Recovery-ready" },
              ].map(({ label, sub }) => (
                <div key={label} className="rounded-2xl bg-white border border-seed-100 p-4">
                  <p className="text-body-sm font-semibold text-dark-base">{label}</p>
                  <p className="text-eyebrow text-dark-base/45 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
