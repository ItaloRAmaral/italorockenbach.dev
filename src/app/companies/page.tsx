import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyListCard } from "@/components/companies/CompanyListCard";
import { getCaseStudiesForCompany, getCompanies } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Companies",
  description: "Companies I've worked at as a software engineer, with the ownership and case studies behind each.",
  path: "/companies",
});

export default function CompaniesPage() {
  const companies = getCompanies();

  return (
    <div className="container">
      <PageHeader title="Companies" />
      <div className={styles.list}>
        {companies.map((company) => (
          <CompanyListCard
            company={company}
            caseCount={getCaseStudiesForCompany(company.id).length}
            key={company.id}
          />
        ))}
      </div>
    </div>
  );
}
