import {
  getCapabilities,
  getCaseStudies,
  getCompanies,
  getLearning,
  getNotes,
  getPrinciples,
  getProfile,
  getTechnologies,
} from "@/repositories/content-repository";
import { siteConfig } from "@/config";
import { slugify } from "./slug";
import type { Passage, SearchDoc } from "./search";

/**
 * Builds the search index from the content. Imported dynamically (see
 * `useSearchIndex`) because it pulls in the full body text of every case study
 * and note — a payload no page should pay for unless someone searches.
 */

/**
 * Splits body text into quotable units. Paragraphs are kept whole when short,
 * and split on sentence boundaries when long — a 600-character paragraph makes
 * a poor answer even when it contains the right sentence.
 */
function toPassages(text: string, section?: string): Passage[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  if (trimmed.length <= 320) return [{ text: trimmed, section }];

  const sentences = trimmed.split(/(?<=[.?!])\s+(?=[A-Z"'—(])/);
  const passages: Passage[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer} ${sentence}` : sentence;
    if (candidate.length > 320 && buffer) {
      passages.push({ text: buffer, section });
      buffer = sentence;
    } else {
      buffer = candidate;
    }
  }
  if (buffer) passages.push({ text: buffer, section });

  return passages;
}


const STATIC_PAGES: Array<[title: string, href: string, sub: string]> = [
  ["Profile", "/profile", "Technical identity, philosophy, career evolution and education"],
  ["Companies", "/companies", "Where the work happened"],
  ["Case Studies", "/cases", "Context, constraints, alternatives, decision, trade-offs"],
  ["Capabilities", "/capabilities", "Each claim linked to the evidence behind it"],
  ["Technologies", "/technologies", "How each one was actually used in production"],
  ["Engineering Principles", "/principles", "Principles and the decision each came from"],
  ["Notes", "/notes", "Shorter technical notes on specific problems and patterns"],
];

export function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const study of getCaseStudies()) {
    const passages = study.sections.flatMap((section) => [
      ...section.paras.flatMap((para) => toPassages(para, section.title)),
      ...section.bullets.flatMap((bullet) => toPassages(bullet, section.title)),
    ]);

    docs.push({
      kind: "case",
      title: study.title,
      sub: `${study.company} · ${study.period}`,
      href: `/cases/${study.id}`,
      head: [study.title, study.summary, study.category, ...study.capabilities, ...study.technologies].join(" "),
      passages: [{ text: study.summary }, ...passages],
    });
  }

  for (const note of getNotes()) {
    const passages = note.sections.flatMap((section) => [
      ...section.paras.flatMap((para) => toPassages(para, section.title)),
      ...section.bullets.flatMap((bullet) => toPassages(bullet, section.title)),
    ]);

    docs.push({
      kind: "note",
      title: note.title,
      sub: note.topic,
      href: `/notes/${note.id}`,
      head: [note.title, note.summary, note.topic, ...note.technologies, ...note.capabilities].join(" "),
      passages: [{ text: note.summary }, ...passages],
    });
  }

  for (const company of getCompanies()) {
    docs.push({
      kind: "company",
      title: company.name,
      sub: `${company.role} · ${company.period}`,
      href: `/companies/${company.id}`,
      head: [company.name, company.role, company.summary, ...company.domainLabels, ...company.technologies].join(" "),
      passages: [
        { text: company.summary },
        ...company.overview.flatMap((para) => toPassages(para, "Overview")),
        ...company.businessDomain.flatMap((para) => toPassages(para, "Business domain")),
        ...company.responsibilities.map((text) => ({ text, section: "Responsibilities" })),
        ...company.achievements.map((text) => ({ text, section: "Achievements" })),
        ...company.generalContributions.map((text) => ({ text, section: "Contributions" })),
        ...company.lessons.map((text) => ({ text, section: "Lessons" })),
      ],
    });
  }

  for (const capability of getCapabilities()) {
    docs.push({
      kind: "capability",
      title: capability.name,
      sub: capability.desc,
      href: `/capabilities/${slugify(capability.name)}`,
      head: `${capability.name} ${capability.desc}`,
      passages: [{ text: capability.desc }],
    });
  }

  for (const technology of getTechnologies()) {
    docs.push({
      kind: "technology",
      title: technology.name,
      sub: technology.usage,
      href: `/technologies/${slugify(technology.name)}`,
      head: `${technology.name} ${technology.usage}`,
      passages: [{ text: technology.usage }],
    });
  }

  for (const principle of getPrinciples()) {
    docs.push({
      kind: "principle",
      title: principle.text,
      sub: principle.origin,
      href: "/principles",
      head: `${principle.text} ${principle.explanation} ${principle.origin}`,
      passages: [
        { text: principle.explanation, section: "Why" },
        { text: principle.applied, section: "Applied" },
      ],
    });
  }

  for (const entry of getLearning()) {
    const status =
      entry.status === "completed"
        ? "completed"
        : entry.status === "in-progress"
          ? "in progress"
          : "coursework only";

    docs.push({
      kind: "education",
      title: entry.program,
      sub: `${entry.institution} · ${entry.period}`,
      href: "/profile",
      // "education" and "degree" are the words a visitor searches with, and
      // none of them appear in the entries themselves.
      head: [
        entry.program,
        entry.institution,
        entry.period,
        status,
        entry.category === "formal" ? "formal education degree academic study studies" : "self-directed learning course training",
      ].join(" "),
      passages: [{ text: `${entry.program} — ${entry.institution}, ${entry.period} (${status}). ${entry.detail}` }],
    });
  }

  const profile = getProfile();
  docs.push({
    kind: "page",
    title: "Profile",
    sub: profile.headline,
    href: "/profile",
    head: [
      profile.headline,
      profile.oneLiner,
      "education background career evolution",
      ...profile.focus,
      ...profile.strengths,
      ...profile.interests,
    ].join(" "),
    passages: [
      ...profile.about.flatMap((para) => toPassages(para, "About")),
      ...profile.philosophy.flatMap((para) => toPassages(para, "Philosophy")),
      ...profile.values.map((text) => ({ text, section: "Values" })),
      ...profile.strengths.map((text) => ({ text, section: "Strengths" })),
      ...profile.preferredProblems.map((text) => ({ text, section: "Problems I look for" })),
      ...profile.evolution.map((step) => ({ text: `${step.label}: ${step.detail}`, section: `Evolution · ${step.year}` })),
      ...profile.interests.map((text) => ({ text, section: "Interests" })),
      { text: profile.quote, section: "In their own words" },
    ],
  });

  // Availability and location live in config rather than in the content, but
  // "is he remote?" and "where is he based?" are among the first things a
  // recruiter asks — and the aliases pointing at these words need them indexed.
  docs.push({
    kind: "page",
    title: "Availability",
    sub: siteConfig.availability,
    href: "/",
    head: `availability based located where ${siteConfig.availability} ${siteConfig.location.city} ${siteConfig.location.region} brazil remote onsite hiring roles contact`,
    passages: [{ text: siteConfig.availability }],
  });

  for (const [title, href, sub] of STATIC_PAGES) {
    if (href === "/profile") continue; // already indexed above, with its content
    docs.push({ kind: "page", title, sub, href, head: `${title} ${sub}`, passages: [{ text: sub }] });
  }

  return docs.map((doc) => ({
    ...doc,
    passages: doc.passages.filter((passage) => passage.text.trim().length > 0),
  }));
}

