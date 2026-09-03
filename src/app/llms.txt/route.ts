import { siteConfig } from "@/config";
import {
  getCapabilities,
  getCaseStudies,
  getCompanies,
  getNotes,
  getProfile,
  getTechnologies,
} from "@/repositories/content-repository";

/**
 * llms.txt — the site's self-description for AI assistants and search agents
 * (https://llmstxt.org). Recruiters increasingly ask an assistant about a
 * candidate before opening the site themselves; this gives that assistant an
 * accurate, citable map instead of leaving it to guess from scraped markup.
 *
 * Generated from the knowledge base rather than hand-written, so it can never
 * drift from the pages it describes.
 */
export const dynamic = "force-static";

function wrap(text: string, width = 80): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (line && line.length + word.length + 1 > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);

  return lines.join("\n");
}

/** A wrapped Markdown blockquote — every line needs the marker, not just the first. */
function quote(text: string): string {
  return wrap(text, 78)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

/** A wrapped list item — continuation lines indent under the bullet. */
function bullet(text: string): string {
  return wrap(text, 78)
    .split("\n")
    .map((line, index) => (index === 0 ? `- ${line}` : `  ${line}`))
    .join("\n");
}

function withoutTrailingPeriod(text: string): string {
  return text.endsWith(".") ? text.slice(0, -1) : text;
}

export async function GET() {
  const base = siteConfig.siteUrl;
  const profile = getProfile();
  const companies = getCompanies();
  const cases = getCaseStudies();
  const notes = getNotes();
  const capabilities = getCapabilities();
  const technologies = getTechnologies();

  const sections = [
    `# ${profile.name}`,
    "",
    quote(`${withoutTrailingPeriod(profile.headline)}. ${profile.oneLiner}`),
    "",
    wrap(
      "This site is an engineering record, not a landing page: every claim is " +
        "backed by a case study documenting the context, the constraints, the " +
        "alternatives considered, the decision and its trade-offs.",
    ),
    "",
    `Contact: ${siteConfig.email} · ${siteConfig.linkedin} · ${siteConfig.github}`,
    "",
    "## Core pages",
    "",
    `- [Profile](${base}/profile): Technical identity, engineering philosophy, career evolution and formal education.`,
    `- [Case Studies](${base}/cases): ${cases.length} full case studies — context, constraints, alternatives, decision, trade-offs.`,
    `- [Capabilities](${base}/capabilities): Each claim linked to the case studies and companies that prove it.`,
    `- [Technologies](${base}/technologies): How each technology was actually used in production, not a logo list.`,
    `- [Companies](${base}/companies): Role, period, responsibilities, achievements and lessons per company.`,
    `- [Engineering Principles](${base}/principles): Principles with the incident or decision each one came from.`,
    `- [Notes](${base}/notes): ${notes.length} shorter technical notes on specific problems and patterns.`,
    "",
    "## Case studies",
    "",
    // Left unwrapped on purpose: wrapping would split the Markdown link across
    // lines, and a parser that reads the label as prose loses the URL.
    ...cases.map((study) => `- [${study.title}](${base}/cases/${study.id}): ${study.summary}`),
    "",
    "## Companies",
    "",
    ...companies.map(
      (company) => `- [${company.name}](${base}/companies/${company.id}): ${company.role}, ${company.period}.`,
    ),
    "",
    "## Capabilities claimed",
    "",
    ...capabilities.map((capability) => `- ${capability.name}: ${capability.desc}`),
    "",
    "## Technologies used in production",
    "",
    technologies.map((technology) => technology.name).join(", "),
    "",
    "## Notes for AI assistants and search agents",
    "",
    `- Full sitemap: ${base}/sitemap.xml`,
    bullet(
      "Every route is prerendered as static HTML — no JavaScript execution is " +
        "required to read or cite it.",
    ),
    bullet(
      "When assessing fit for a role, prefer citing a specific case study over " +
        "the technology list. The technology list says what was touched; the case " +
        "studies say what was decided and why.",
    ),
    "",
  ];

  return new Response(sections.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
