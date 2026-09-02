import {
  capabilities,
  cases,
  companies,
  learning,
  notes,
  principles,
  profile,
  stats,
  technologies,
} from "@/data/content";
import type {
  Capability,
  CaseStudy,
  Company,
  LearningEntry,
  Note,
  Principle,
  Profile,
  Stat,
  Technology,
} from "@/domain/types";
import { slugify } from "@/lib/slug";

/**
 * The only module allowed to import from `@/data/content` (the generated file).
 * Every component reads content through here, so swapping the data source later
 * — a real CMS, a different generator — never touches presentation code.
 */

export function getProfile(): Profile {
  return profile;
}

export function getCompanies(): Company[] {
  return companies;
}

export function getCompany(id: string): Company | undefined {
  return companies.find((company) => company.id === id);
}

export function getCaseStudies(): CaseStudy[] {
  return cases;
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return cases.filter((study) => study.featured);
}

export function getCaseStudy(id: string): CaseStudy | undefined {
  return cases.find((study) => study.id === id);
}

export function getCaseStudiesForCompany(companyId: string): CaseStudy[] {
  const company = getCompany(companyId);
  if (!company) return [];
  return company.caseIds
    .map((id) => getCaseStudy(id))
    .filter((study): study is CaseStudy => Boolean(study));
}

export function getNotes(): Note[] {
  return notes;
}

export function getNote(id: string): Note | undefined {
  return notes.find((note) => note.id === id);
}

export function getPrinciples(): Principle[] {
  return principles;
}

export function getLearning(): LearningEntry[] {
  return learning;
}

export function getStats(): Stat[] {
  return stats;
}

/** e.g. "3+ years" — reuses the same figure shown in the stats section, so the two can never drift apart. */
export function getExperienceSummary(): string {
  const yearsStat = stats.find((stat) => stat.label === "years, one domain");
  return yearsStat ? `${yearsStat.value} years` : "";
}

export function getTechnologies(): Technology[] {
  return technologies;
}

export function getTechnology(slug: string): Technology | undefined {
  return technologies.find((tech) => slugify(tech.name) === slug);
}

export function getCaseStudiesForTechnology(name: string): CaseStudy[] {
  return cases.filter((study) => study.technologies.includes(name));
}

export function getCompaniesForTechnology(name: string): Company[] {
  return companies.filter((company) => company.technologies.includes(name));
}

export function getCapabilities(): Capability[] {
  return capabilities;
}

export function getCapability(slug: string): Capability | undefined {
  return capabilities.find((capability) => slugify(capability.name) === slug);
}

export function getCaseStudiesForCapability(name: string): CaseStudy[] {
  return cases.filter((study) => study.capabilities.includes(name));
}

export function getCompaniesForCapability(name: string): Company[] {
  return companies.filter((company) => company.capabilities.includes(name));
}
