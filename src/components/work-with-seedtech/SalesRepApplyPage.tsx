import { CheckCircle2, Upload } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { AnimatedH1, GradientOrb, GridPattern, LiquidGlassPill } from "@/components/kit";
import { SalesRepApplicationForm } from "./SalesRepApplicationForm";

const applicationPrep = [
  "A current resume in PDF, DOC, or DOCX format.",
  "Basic contact details and your location.",
  "Optional context on your outbound background or sales experience.",
];

export function SalesRepApplyPage() {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-dark-base py-18 md:py-22">
        <GradientOrb color="seed" size="xl" className="-right-40 -top-32 opacity-20" />
        <GradientOrb color="blue" size="lg" className="-left-24 top-1/2 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <LiquidGlassPill variant="seed">Apply Now</LiquidGlassPill>
                <LiquidGlassPill variant="default">Sales Rep Role</LiquidGlassPill>
              </div>

              <AnimatedH1 highlightWords={["sales", "role"]} className="mb-6 max-w-4xl">
                Apply to the SeedTech outbound sales role
              </AnimatedH1>

              <p className="max-w-2xl text-body-lg leading-relaxed text-white/74">
                This page is just for the application. Upload your resume, add your core details, and submit without working through the full role overview again.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-300">What to have ready</p>
              <ul className="mt-4 space-y-3">
                {applicationPrep.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/82">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-dark-elevated p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-seed-500/12 text-seed-300">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Resume upload included</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/68">
                      Your application is submitted with a resume file and stored for internal review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section theme="light" className="py-14 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-dark-base/10 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(10,10,15,0.35)] md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-seed-600">Application</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-[1.05] text-dark-base">
              Submit your resume and details.
            </h2>
            <p className="mt-4 text-body-lg leading-relaxed text-dark-base/72">
              Keep it simple. Name, contact details, resume, and any optional context you want SeedTech to review.
            </p>

            <div className="mt-8">
              <SalesRepApplicationForm />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}