import { paddlersCoveData } from "./paddlers-cove";
import type { LucideIcon } from "lucide-react";

export interface CaseStudyData {
  challenge: { headline: string; body: string };
  solution: { headline: string; body: string };
  mainScreenshot?: string;
  timeline: string;
  teamSize: string;
  stats: { value: string; label: string }[];
  deliverables: { icon: LucideIcon; title: string; body: string }[];
  process: { step: string; title: string; description: string }[];
  testimonial?: { quote: string; name: string; role: string };
}

const caseStudies: Record<string, CaseStudyData> = {
  "paddlers-cove": paddlersCoveData,
};

export function getCaseStudy(slug: string): CaseStudyData | undefined {
  return caseStudies[slug];
}
