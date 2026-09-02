import type { ContactLink } from "@/domain/types";

/**
 * Site-only configuration — never generated from the knowledge base. Contact
 * details are presentation concerns of this site, not career evidence.
 */
export const siteConfig = {
  /** Dark is the default appearance, not just an OS-preference fallback. */
  defaultTheme: "dark" as "dark" | "light",
  email: "italorockamaral@gmail.com",
  linkedin: "https://www.linkedin.com/in/italorockenbach",
  github: "https://github.com/ItaloRAmaral",
  /** No production domain yet — override via NEXT_PUBLIC_SITE_URL once one exists. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://engineering-record.vercel.app",
} as const;

export function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  if (siteConfig.email) links.push({ label: "email", href: `mailto:${siteConfig.email}` });
  if (siteConfig.linkedin) links.push({ label: "linkedin", href: siteConfig.linkedin });
  if (siteConfig.github) links.push({ label: "github", href: siteConfig.github });
  return links;
}
