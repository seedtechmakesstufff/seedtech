import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  MessageSquareQuote,
  Target,
  Wrench,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProjectHero } from "@/components/projects/ProjectHero";
import {
  Badge,
  CTABanner,
  CheckList,
  ElevatedCard,
  GlassCard,
  GradientText,
  ProcessStep,
  TechPill,
} from "@/components/kit";
import { GradientOrb } from "@/components/kit";
import { projects, getProjectBySlug } from "@/data/projects";
import { getCaseStudy } from "@/data/case-studies";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.client} — SeedTech`,
    description: project.tagline,
  };
}

// ─── Placeholder stat data (replace per project) ─────────────────────────────
const PLACEHOLDER_STATS = [
  { value: "—", label: "Placeholder Metric" },
  { value: "—", label: "Placeholder Metric" },
  { value: "—", label: "Placeholder Metric" },
  { value: "—", label: "Placeholder Metric" },
];

// ─── Placeholder process steps (replace per project) ─────────────────────────
const PLACEHOLDER_PROCESS = [
  {
    step: "01",
    title: "Discovery & Scoping",
    description:
      "We ran a deep discovery session with the client to map existing workflows, pain points, and business goals before writing a single line of code.",
  },
  {
    step: "02",
    title: "Design & Architecture",
    description:
      "Wireframes and system architecture were signed off together, ensuring both the visual direction and technical stack aligned with long-term needs.",
  },
  {
    step: "03",
    title: "Build & Integrate",
    description:
      "Iterative development with bi-weekly check-ins. Each sprint delivered testable, deployable increments reviewed by the client team.",
  },
  {
    step: "04",
    title: "Launch & Handoff",
    description:
      "Staged rollout with a full QA pass, performance audit, and a recorded handoff walkthrough so the team is never dependent on us to make changes.",
  },
];

// ─── Placeholder deliverables (replace per project) ───────────────────────────
const PLACEHOLDER_DELIVERABLES = [
  { icon: Target, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
  { icon: Wrench, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
  { icon: Lightbulb, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
  { icon: CheckCircle2, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
  { icon: Target, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
  { icon: Wrench, title: "Deliverable Title", body: "Short description of what was built or configured for this deliverable slot." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const isWeb = project.department === "web-development";
  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const cs = getCaseStudy(params.slug);

  return (
    <div>
      {/* ── Hero ── */}
      <ProjectHero project={project} />

      {/* ── Overview: description + project card ── */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left: challenge + solution */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">Overview</p>
              <h2 className="font-display text-heading text-white mb-6">About This Project</h2>
              <p className="text-body-lg text-light-base/60 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Challenge / Solution split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassCard theme="dark" className="p-6 space-y-3" hover={false}>
                <p className="text-eyebrow uppercase tracking-widest text-brand-blue/80 text-xs">The Challenge</p>
                <p className="text-white font-display text-card-title">
                  {cs?.challenge.headline ?? "Placeholder challenge headline for this project."}
                </p>
                <p className="text-body-sm text-light-base/50 leading-relaxed">
                  {cs?.challenge.body ?? "This is a placeholder for the key business or technical problem the client was facing before engaging SeedTech. Replace with the real challenge."}
                </p>
              </GlassCard>

              <GlassCard theme="dark" className="p-6 space-y-3 border-seed-600/20" hover={false}>
                <p className="text-eyebrow uppercase tracking-widest text-seed-400 text-xs">Our Solution</p>
                <p className="text-white font-display text-card-title">
                  {cs?.solution.headline ?? "Placeholder solution headline for this project."}
                </p>
                <p className="text-body-sm text-light-base/50 leading-relaxed">
                  {cs?.solution.body ?? "This is a placeholder for the specific approach, tools, and decisions that made this project a success. Replace with the real solution."}
                </p>
              </GlassCard>
            </div>

            {/* Screenshot / visual */}
            <div>
              <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-4 text-xs">Screenshots</p>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-elevated">
                {cs?.mainScreenshot ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={cs.mainScreenshot}
                      alt={`${project.client} screenshot`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-dark-elevated to-dark-overlay">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto">
                        <ExternalLink className="w-5 h-5 text-white/20" />
                      </div>
                      <p className="text-white/30 text-sm font-medium">1600 × 900 px</p>
                      <p className="text-white/20 text-xs">16:9 · case study screenshot</p>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-seed-400/60 hover:text-seed-400 text-xs transition-colors"
                        >
                          {project.url.replace(/^https?:\/\//, "")}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: project meta sidebar */}
          <aside className="space-y-5">
            <GlassCard theme="dark" className="p-6 space-y-5" hover={false}>
              <MetaRow label="Client" value={project.client} />
              <MetaRow
                label="Department"
                value={isWeb ? "Web Development" : "IT Support"}
              />
              <MetaRow label="Timeline" value={cs?.timeline ?? "—"} note={cs ? undefined : "TODO: replace"} />
              <MetaRow label="Team Size" value={cs?.teamSize ?? "—"} note={cs ? undefined : "TODO: replace"} />

              {/* Tech stack */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <TechPill key={tech}>{tech}</TechPill>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-2">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Live site */}
              {project.url && (
                <div className="pt-2 border-t border-white/[0.05]">
                  <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-2">Live Site</p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-seed-400 hover:text-seed-300 text-body-sm font-medium transition-colors"
                  >
                    {project.url.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </GlassCard>

            {/* Second screenshot placeholder */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-elevated">
              <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-b from-dark-elevated to-dark-overlay">
                <div className="text-center space-y-1">
                  <p className="text-white/30 text-sm font-medium">700 × 700 px</p>
                  <p className="text-white/15 text-xs">1:1 · sidebar image</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* ── Stats / results row ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="By the Numbers"
          title="Results & Impact"
          description={cs ? "Key metrics from this engagement." : "Key metrics from this engagement. Replace placeholders with real figures once available."}
          theme="light"
          align="center"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(cs?.stats ?? PLACEHOLDER_STATS).map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6 text-center space-y-2"
            >
              <p className="font-display text-display text-seed-600">{stat.value}</p>
              <p className="text-body-sm text-dark-base/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Deliverables grid ── */}
      <Section>
        <SectionHeader
          eyebrow="What We Built"
          title="Deliverables"
          description="Everything that shipped as part of this engagement."
          theme="dark"
          align="left"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(cs?.deliverables ?? PLACEHOLDER_DELIVERABLES).map((d, i) => {
            const Icon = d.icon;
            return (
              <ElevatedCard key={i} className="space-y-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWeb ? "bg-brand-blue/10" : "bg-seed-600/10"}`}>
                  <Icon className={`w-5 h-5 ${isWeb ? "text-brand-blue" : "text-seed-500"}`} />
                </div>
                <h3 className="font-display text-card-title text-white">{d.title}</h3>
                <p className="text-body-sm text-light-base/50 leading-relaxed">{d.body}</p>
              </ElevatedCard>
            );
          })}
        </div>
      </Section>

      {/* ── Process ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How We Did It"
          title="Our Process"
          description="The phases we moved through from first conversation to launch day."
          theme="light"
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(cs?.process ?? PLACEHOLDER_PROCESS).map((step) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
              theme="light"
            />
          ))}
        </div>
      </Section>

      {/* ── Highlights checklist ── */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">Project Highlights</p>
            <h2 className="font-display text-heading text-white mb-8">
              What made this{" "}
              <GradientText as="span">project special</GradientText>
            </h2>
            <CheckList
              items={project.highlights}
              theme="dark"
            />
          </div>

          {/* Testimonial */}
          <div className="relative">
            <GradientOrb color={isWeb ? "blue" : "seed"} size="md" className="-top-10 -right-10 opacity-10" />
            <div className="relative z-10 rounded-2xl bg-dark-elevated border border-white/[0.06] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <MessageSquareQuote className="w-5 h-5 text-seed-400" />
                <p className="text-eyebrow uppercase tracking-widest text-seed-400 text-xs">Client Testimonial</p>
              </div>
              <blockquote className="font-display text-card-title text-white leading-snug">
                &ldquo;{cs?.testimonial?.quote ?? `This is a placeholder testimonial. Replace with a real quote from ${project.client} once available.`}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-dark-overlay border border-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-xs text-white/30 font-medium">
                    {project.client.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-body-sm">{cs?.testimonial?.name ?? "Contact Name"}</p>
                  <p className="text-light-base/40 text-xs">{cs?.testimonial?.role ?? "Role"} · {project.client}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Next project ── */}
      <Section theme="light" className="border-t border-black/[0.05]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-eyebrow uppercase tracking-widest text-seed-600 mb-2">Next Project</p>
            <p className="font-display text-heading text-dark-base">{nextProject.client}</p>
            <p className="text-body text-dark-base/50 mt-1">{nextProject.tagline}</p>
          </div>
          <Link
            href={`/our-work/${nextProject.slug}`}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-dark-base text-white font-medium text-body-sm hover:bg-dark-elevated transition-colors shrink-0"
          >
            View Case Study
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <CTABanner
          title="Have a Similar Project in Mind?"
          description="Let's scope it out together. We'll give you an honest timeline, budget, and plan."
          primaryLabel="Start a Conversation"
          primaryHref="/contact"
          secondaryLabel="See More Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}

// ─── Small helper component ───────────────────────────────────────────────────
function MetaRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white font-medium text-body-sm">
        {value}
        {note && <span className="text-light-base/25 font-normal ml-1 text-xs">({note})</span>}
      </p>
    </div>
  );
}
