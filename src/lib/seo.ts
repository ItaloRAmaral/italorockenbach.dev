import type { Metadata } from "next";
import type { LearningEntry, Profile } from "@/domain/types";
import { siteConfig } from "@/config";

interface PersonJsonLdInput {
  profile: Profile;
  companyName?: string;
  /** The job title alone. `profile.headline` is a sentence, not a title, and
   *  schema.org consumers treat `jobTitle` as an entity to match against. */
  jobTitle?: string;
  learning?: LearningEntry[];
  /** Capability and technology names — what this person is an authority on. */
  knowsAbout?: string[];
}

/** schema.org Person, rendered as JSON-LD on the home page — lets search
 *  engines resolve "Italo Rockenbach Amaral" as an entity with a canonical
 *  site, profile links and subjects of expertise, instead of just an indexed
 *  page of text. */
export function personJsonLd({
  profile,
  companyName,
  jobTitle,
  learning = [],
  knowsAbout = [],
}: PersonJsonLdInput) {
  const formalEducation = learning.filter((entry) => entry.category === "formal");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.siteUrl,
    ...(jobTitle && { jobTitle }),
    description: profile.oneLiner,
    email: siteConfig.email,
    sameAs: [siteConfig.linkedin, siteConfig.github],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    ...(knowsAbout.length > 0 && { knowsAbout }),
    ...(companyName && { worksFor: { "@type": "Organization", name: companyName } }),
    ...(formalEducation.length > 0 && {
      alumniOf: formalEducation.map((entry) => ({
        "@type": "EducationalOrganization",
        name: entry.institution,
      })),
    }),
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Site-relative path (e.g. "/cases/some-slug") — resolved against metadataBase. */
  path: string;
  type?: "website" | "article";
}

/** Every route's metadata boils down to the same shape (title, description,
 *  canonical, Open Graph, Twitter) — this is the one place that shape is
 *  defined, so a route only ever supplies its own content. */
export function pageMetadata({ title, description, path, type = "website" }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type },
    twitter: { card: "summary_large_image", title, description },
  };
}
