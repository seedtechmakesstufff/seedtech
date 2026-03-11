"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechPill, Badge } from "@/components/kit";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={`/our-work/${project.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/[0.06] bg-dark-elevated",
        "overflow-hidden transition-all duration-300",
        "hover:border-seed-600/30 hover:shadow-cardDark hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-dark-overlay to-dark-elevated overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-1">
              <p className="text-white/30 text-sm font-medium">1200 × 675 px</p>
              <p className="text-white/15 text-xs">16:9 · card thumbnail</p>
            </div>
          </div>
        )}
        {/* Department colour tint overlay */}
        <div className={cn(
          "absolute inset-0 opacity-10",
          project.department === "web-development"
            ? "bg-gradient-web"
            : "bg-gradient-brand"
        )} />
        {/* Bottom fade into card */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-dark-elevated to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Department + featured badge */}
        <div className="flex items-center justify-between gap-3">
          <Badge variant="glass-dark" size="sm">
            {project.department === "web-development" ? "Web Development" : "IT Support"}
          </Badge>
          {project.featured && (
            <Badge variant="dot" size="sm">Featured</Badge>
          )}
        </div>

        {/* Client + Title */}
        <div>
          <p className="text-body-sm text-light-base/40 mb-1">{project.client}</p>
          <h3 className="font-display text-subheading text-white leading-snug group-hover:text-seed-400 transition-colors duration-200">
            {project.title}
          </h3>
        </div>

        {/* Tagline */}
        <p className="text-body-sm text-light-base/55 leading-relaxed flex-1">
          {project.tagline}
        </p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.slice(0, 4).map((tech) => (
            <TechPill key={tech}>{tech}</TechPill>
          ))}
          {project.techStack.length > 4 && (
            <TechPill>+{project.techStack.length - 4}</TechPill>
          )}
        </div>

        {/* Footer link hint */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <span className="text-body-sm text-seed-500 font-medium">View Case Study</span>
          <ArrowUpRight className="w-4 h-4 text-seed-500 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}
