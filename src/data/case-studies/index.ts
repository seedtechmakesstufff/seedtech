import { paddlersCoveData } from "./paddlers-cove";
import { biooxData } from "./bioox";
import { eastsideBulkData } from "./eastside-bulk";
import { southShoreMarineData } from "./south-shore-marine";
import { westShoreMarineData } from "./west-shore-marine";
import { bagelsOnTheHillData } from "./bagels-on-the-hill";
import { megasafeItData } from "./megasafe-it";
import { kellyPlumbingHeatingData } from "./kelly-plumbing-heating";
import { hilerContractingData } from "./hiler-contracting";
import type { LucideIcon } from "lucide-react";

export interface CaseStudyData {
  challenge: { headline: string; body: string };
  solution: { headline: string; body: string };
  mainScreenshot?: string;
  sidebarImage?: string;
  timeline: string;
  teamSize: string;
  stats: { value: string; label: string }[];
  deliverables: { icon: LucideIcon; title: string; body: string }[];
  process: { step: string; title: string; description: string }[];
  testimonial?: { quote: string; name: string };
}

const caseStudies: Record<string, CaseStudyData> = {
  "paddlers-cove": paddlersCoveData,
  "bioox": biooxData,
  "eastside-bulk": eastsideBulkData,
  "south-shore-marine": southShoreMarineData,
  "west-shore-marine": westShoreMarineData,
  "bagels-on-the-hill": bagelsOnTheHillData,
  "megasafe-it": megasafeItData,
  "kelly-plumbing-heating": kellyPlumbingHeatingData,
  "hiler-contracting": hilerContractingData,
};

export function getCaseStudy(slug: string): CaseStudyData | undefined {
  return caseStudies[slug];
}
