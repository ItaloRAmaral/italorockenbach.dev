import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { DocumentSection } from "@/components/shared/DocumentSection";
import { CaseFacts } from "@/components/cases/CaseFacts";
import { getCaseStudies, getCaseStudy, getCompany } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

interface CasePageProps {
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
  return getCaseStudies().map((study) => ({ id: study.id }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { id } = await params;
  const study = getCaseStudy(id);
  if (!study) return { title: "Case study not found" };
  return pageMetadata({
    title: `${study.title} — Case Studies`,
    description: study.summary,
    path: `/cases/${study.id}`,
    type: "article",
  });
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params;
  const study = getCaseStudy(id);
  if (!study) notFound();

  const company = getCompany(study.company);

  return (
    <>
      <ReadingProgress />
      <div className={styles.layout}>
        <article>
          <Breadcrumb label="Case studies" href="/cases" current={study.id} />
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.lede}>{study.summary}</p>

          {study.sections.map((section, index) => (
            <DocumentSection section={section} index={index} key={section.id} />
          ))}
        </article>

        <aside className={styles.aside}>
          <CaseFacts study={study} company={company} />
        </aside>
      </div>
    </>
  );
}
