import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { SectionHead } from "@/components/shared/SectionHead";
import { CaseMiniCard } from "@/components/shared/CaseMiniCard";
import { CompanyPill } from "@/components/shared/CompanyPill";
import { slugify } from "@/lib/slug";
import {
  getCapabilities,
  getCapability,
  getCaseStudiesForCapability,
  getCompaniesForCapability,
} from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

interface CapabilityPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Only the slugs listed by generateStaticParams exist. Anything else is a 404
 * with no work done, rather than an on-demand render of a page that will call
 * notFound() anyway. Safe here because the content is compiled into the bundle:
 * a new entry already requires a rebuild, which the content-sync workflow does.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCapabilities().map((capability) => ({ id: slugify(capability.name) }));
}

export async function generateMetadata({ params }: CapabilityPageProps): Promise<Metadata> {
  const { id } = await params;
  const capability = getCapability(id);
  if (!capability) return { title: "Capability not found" };
  return pageMetadata({
    title: `${capability.name} — Capabilities`,
    description: capability.desc,
    path: `/capabilities/${id}`,
    type: "article",
  });
}

export default async function CapabilityPage({ params }: CapabilityPageProps) {
  const { id } = await params;
  const capability = getCapability(id);
  if (!capability) notFound();

  const provingCases = getCaseStudiesForCapability(capability.name);
  const provingCompanies = getCompaniesForCapability(capability.name);

  return (
    <div className="container">
      <Breadcrumb label="Capabilities" href="/capabilities" current={capability.name} />
      <h1 className={styles.title}>{capability.name}</h1>
      <p className={styles.desc}>{capability.desc}</p>
      <div className={styles.evidence}>
        evidence: {provingCases.length} proving documents · {provingCompanies.length}{" "}
        {provingCompanies.length === 1 ? "company" : "companies"}
      </div>

      {provingCases.length > 0 && (
        <section className={styles.section}>
          <SectionHead title="Proving documents" />
          <div className={styles.caseList}>
            {provingCases.map((study) => (
              <CaseMiniCard study={study} key={study.id} />
            ))}
          </div>
        </section>
      )}

      {provingCompanies.length > 0 && (
        <section className={styles.section}>
          <SectionHead title="Exercised at" />
          <div className={styles.pillRow}>
            {provingCompanies.map((company) => (
              <CompanyPill company={company} key={company.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
