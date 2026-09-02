import { PageHeader } from "@/components/shared/PageHeader";
import { CaseListCard } from "@/components/cases/CaseListCard";
import { getCaseStudies, getCompany } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Case Studies",
  description: "Context, constraints, alternatives, decision, trade-offs. Never just the output.",
  path: "/cases",
});

export default function CasesPage() {
  const cases = getCaseStudies();

  return (
    <div className="container">
      <PageHeader
        title="Case Studies"
        lede="Context, constraints, alternatives, decision, trade-offs. Never just the output."
      />
      <div className={styles.list}>
        {cases.map((study) => (
          <CaseListCard
            study={study}
            companyName={getCompany(study.company)?.name ?? study.company}
            key={study.id}
          />
        ))}
      </div>
    </div>
  );
}
