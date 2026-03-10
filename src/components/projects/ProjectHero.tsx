import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TechPill, Badge, GradientText } from "@/components/kit";
import { GradientOrb, GridPattern } from "@/components/kit";
import type { Project } from "@/data/projects";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const isWeb = project.department === "web-development";

  return (
    <section className="relative overflow-hidden bg-dark-base pt-32 pb-20">
      <GradientOrb
        color={isWeb ? "blue" : "seed"}
        size="xl"
        className="-top-32 -right-32 opacity-20"
      />
      <GridPattern />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Back link */}
        <Link
          href="/our-work"
          className="inline-flex items-center gap-2 text-body-sm text-light-base/40 hover:text-light-base/70 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          All Projects
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="glass-dark">
            {isWeb ? "Web Development" : "IT Support"}
          </Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
          ))}
        </div>

        {/* Client name */}
        <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">
          {project.client}
        </p>

        {/* Title */}
        <h1 className="font-display text-title md:text-display font-bold text-white leading-[1.05] max-w-4xl">
          {project.title.split(" ").slice(0, 3).join(" ")}{" "}
          <GradientText as="span">
            {project.title.split(" ").slice(3).join(" ")}
          </GradientText>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-body-lg text-light-base/60 max-w-2xl">
          {project.tagline}
        </p>

        {/* Tech stack + live link */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechPill key={tech}>{tech}</TechPill>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm font-medium text-seed-400 hover:text-seed-300 transition-colors shrink-0"
            >
              Visit Live Site
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
