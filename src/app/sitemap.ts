import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";
import {
  getCapabilities,
  getCaseStudies,
  getCompanies,
  getNotes,
  getTechnologies,
} from "@/repositories/content-repository";
import { slugify } from "@/lib/slug";

const STATIC_ROUTES = ["/", "/profile", "/companies", "/cases", "/capabilities", "/technologies", "/notes", "/principles"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
  }));

  const companyEntries = getCompanies().map((company) => ({
    url: `${base}/companies/${company.id}`,
  }));

  const caseEntries = getCaseStudies().map((study) => ({
    url: `${base}/cases/${study.id}`,
  }));

  const noteEntries = getNotes().map((note) => ({
    url: `${base}/notes/${note.id}`,
  }));

  const capabilityEntries = getCapabilities().map((capability) => ({
    url: `${base}/capabilities/${slugify(capability.name)}`,
  }));

  const technologyEntries = getTechnologies().map((technology) => ({
    url: `${base}/technologies/${slugify(technology.name)}`,
  }));

  return [
    ...staticEntries,
    ...companyEntries,
    ...caseEntries,
    ...noteEntries,
    ...capabilityEntries,
    ...technologyEntries,
  ];
}
