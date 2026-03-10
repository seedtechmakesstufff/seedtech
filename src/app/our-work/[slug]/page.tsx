import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { CTABanner, GlassCard } from "@/components/kit";
import { projects, getProjectBySlug } from "@/data/projects";
import { CheckCircle2 } from "lucide-react";

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

export default function ProjectPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div>
      <ProjectHero project={project} />

      {/* Overview */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">Overview</p>
              <h2 className="font-display text-heading text-white mb-4">About This Project</h2>
              <p className="text-body-lg text-light-base/60 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Sidebar meta */}
          <aside className="space-y-6">
            <GlassCard theme="dark" className="p-6 space-y-5">
              {/* Client */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-1">Client</p>
                <p className="text-white font-medium">{project.client}</p>
              </div>

              {/* Department */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-1">Department</p>
                <p className="text-white font-medium">
                  {project.department === "web-development" ? "Web Development" : "IT Support"}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-md bg-dark-overlay border border-white/[0.06] text-light-base/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live link */}
              {project.url && (
                <div className="pt-2 border-t border-white/[0.05]">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-seed-400 hover:text-seed-300 text-body-sm font-medium transition-colors"
                  >
                    {project.url.replace(/^https?:\/\//, "")} ↗
                  </a>
                </div>
              )}
            </GlassCard>
          </aside>
        </div>
      </Section>

      {/* Highlights */}
      <Section theme="light">
        <div className="max-w-3xl">
          <p className="text-eyebrow uppercase tracking-widest text-seed-600 mb-3">What We Delivered</p>
          <h2 className="font-display text-heading text-dark-base mb-10">Project Highlights</h2>
          <div className="space-y-4">
            {project.highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-seed-600 shrink-0 mt-0.5" />
                <p className="text-body text-dark-base/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
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
