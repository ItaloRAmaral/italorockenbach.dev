/**
 * Domain types for the site. Deliberately re-declared here rather than imported
 * from `@/data/content` — the generated file is an implementation detail of the
 * data layer, not something the UI should depend on directly. If the generator's
 * shape ever changes, only `repositories/content-repository.ts` needs to adapt.
 */

export interface Table {
  headers: string[];
  rows: string[][];
}

/** A numbered body section — shared shape for Case Study and Note bodies,
 *  both parsed from `## Heading` Markdown sections. */
export interface DocumentSection {
  id: string;
  title: string;
  paras: string[];
  bullets: string[];
  tables: Table[];
}

export interface CaseStudy {
  id: string;
  featured: boolean;
  title: string;
  company: string;
  category: string;
  summary: string;
  capabilities: string[];
  technologies: string[];
  difficulty: "high" | "medium" | "low";
  ownership: "autonomous" | "led" | "contributed";
  customerFacing: "Yes" | "No";
  period: string;
  readingTime: string;
  sections: DocumentSection[];
}

export interface Company {
  id: string;
  name: string;
  role: string;
  period: string;
  location: string;
  domains: string[];
  domainLabels: string[];
  summary: string;
  phase: string;
  overview: string[];
  businessDomain: string[];
  responsibilities: string[];
  achievements: string[];
  generalContributions: string[];
  technologies: string[];
  capabilities: string[];
  lessons: string[];
  caseIds: string[];
}

export interface Technology {
  name: string;
  usage: string;
}

export interface Capability {
  name: string;
  desc: string;
}

export interface Note {
  id: string;
  title: string;
  topic: string;
  summary: string;
  technologies: string[];
  domains: string[];
  capabilities: string[];
  relatedCaseStudies: string[];
  readingTime: string;
  sections: DocumentSection[];
}

export interface EvolutionStep {
  year: string;
  label: string;
  detail: string;
}

export interface Profile {
  name: string;
  headline: string;
  oneLiner: string;
  quote: string;
  about: string[];
  philosophy: string[];
  values: string[];
  evolution: EvolutionStep[];
  strengths: string[];
  interests: string[];
  preferredProblems: string[];
  capabilities: string[];
  focus: string[];
  domains: string[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface Principle {
  id: string;
  text: string;
  explanation: string;
  origin: string;
  /** null when the principle has no single originating case study. */
  caseId: string | null;
  applied: string;
}

export interface LearningEntry {
  institution: string;
  program: string;
  period: string;
  periodStartYear: number;
  category: "formal" | "self-directed";
  status: "completed" | "in-progress" | "coursework-only";
  detail: string;
}

export interface ContactLink {
  label: string;
  href: string;
}
