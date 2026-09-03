import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { ProseSection } from "@/components/shared/ProseSection";
import { ListSection } from "@/components/shared/ListSection";
import { ChipSection } from "@/components/shared/ChipSection";
import { TwoColumn } from "@/components/shared/TwoColumn";
import { SectionHead } from "@/components/shared/SectionHead";
import { CaseMiniCard } from "@/components/shared/CaseMiniCard";
import {
  getCaseStudiesForCompany,
  getCompanies,
  getCompany,
} from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

interface CompanyPageProps {
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
  return getCompanies().map((company) => ({ id: company.id }));
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "Company not found" };
  return pageMetadata({
    title: `${company.name} — Companies`,
    description: company.summary,
    path: `/companies/${company.id}`,
    type: "article",
  });
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const companyCases = getCaseStudiesForCompany(company.id);

  return (
    <div className="container">
      <Breadcrumb label="Companies" href="/companies" current={company.name} />
      <CompanyHeader company={company} />

      <ProseSection title="Overview" paragraphs={company.overview} />
      <ProseSection title="Business domain" paragraphs={company.businessDomain} />

      <div className={styles.twoColSection}>
        <TwoColumn
          left={<ListSection title="Responsibilities" items={company.responsibilities} />}
          right={<ListSection title="Achievements" items={company.achievements} marker="plus" />}
        />
      </div>

      {company.generalContributions.length > 0 && (
        <ListSection title="General contributions" items={company.generalContributions} />
      )}

      <ChipSection title="Technologies" items={company.technologies} />

      {companyCases.length > 0 && (
        <section className={styles.section}>
          <SectionHead title="Case studies" />
          <div className={styles.caseList}>
            {companyCases.map((study) => (
              <CaseMiniCard study={study} key={study.id} />
            ))}
          </div>
        </section>
      )}

      {company.lessons.length > 0 && (
        <ListSection title="Lessons learned" items={company.lessons} />
      )}
    </div>
  );
}
