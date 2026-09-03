import type { ContactLink } from "@/domain/types";

/**
 * Site-only configuration — never generated from the knowledge base. Contact
 * details are presentation concerns of this site, not career evidence.
 */
export const siteConfig = {
  /** Dark is the default appearance, not just an OS-preference fallback. */
  defaultTheme: "dark" as "dark" | "light",
  /**
   * Rendered directly under the name on the home page — the availability
   * question a recruiter would otherwise have to ask before anything else.
   */
  availability: "Open to remote roles, or on-site in Florianópolis, Brazil",
  /** Used in the schema.org Person as the candidate's location. */
  location: { city: "Florianópolis", region: "SC", country: "BR" },
  email: "italorockamaral@gmail.com",
  linkedin: "https://www.linkedin.com/in/italo-rockenbach/",
  github: "https://github.com/ItaloRAmaral",
  /** The Vercel deployment. Override via NEXT_PUBLIC_SITE_URL if a custom domain arrives. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://italorockenbachdev.vercel.app",
} as const;

export function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  if (siteConfig.email) links.push({ label: "email", href: `mailto:${siteConfig.email}` });
  if (siteConfig.linkedin) links.push({ label: "linkedin", href: siteConfig.linkedin });
  if (siteConfig.github) links.push({ label: "github", href: siteConfig.github });
  return links;
}
