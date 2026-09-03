import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { SectionHead } from "@/components/shared/SectionHead";
import { CaseMiniCard } from "@/components/shared/CaseMiniCard";
import { CompanyPill } from "@/components/shared/CompanyPill";
import { slugify } from "@/lib/slug";
import {
  getCaseStudiesForTechnology,
  getCompaniesForTechnology,
  getTechnologies,
  getTechnology,
} from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

interface TechnologyPageProps {
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
  return getTechnologies().map((technology) => ({ id: slugify(technology.name) }));
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { id } = await params;
  const technology = getTechnology(id);
  if (!technology) return { title: "Technology not found" };
  return pageMetadata({
    title: `${technology.name} — Technologies`,
    description: technology.usage,
    path: `/technologies/${id}`,
    type: "article",
  });
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { id } = await params;
  const technology = getTechnology(id);
  if (!technology) notFound();

  const usedAt = getCompaniesForTechnology(technology.name);
  const appearsIn = getCaseStudiesForTechnology(technology.name);

  return (
    <div className="container">
      <Breadcrumb label="Technologies" href="/technologies" current={technology.name} />
      <h1 className={styles.title}>{technology.name}</h1>

      <section className={styles.section}>
        <SectionHead title="How I used it" />
        <p className={styles.usage}>{technology.usage}</p>
      </section>

      {usedAt.length > 0 && (
        <section className={styles.section}>
          <SectionHead title="Companies" />
          <div className={styles.pillRow}>
            {usedAt.map((company) => (
              <CompanyPill company={company} key={company.id} />
            ))}
          </div>
        </section>
      )}

      {appearsIn.length > 0 && (
        <section className={styles.section}>
          <SectionHead title="Appears in" />
          <div className={styles.caseList}>
            {appearsIn.map((study) => (
              <CaseMiniCard study={study} key={study.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
