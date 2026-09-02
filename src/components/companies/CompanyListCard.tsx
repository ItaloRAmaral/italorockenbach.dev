import Link from "next/link";
import type { Company } from "@/domain/types";
import styles from "./CompanyListCard.module.css";

interface CompanyListCardProps {
  company: Company;
  caseCount: number;
}

export function CompanyListCard({ company, caseCount }: CompanyListCardProps) {
  return (
    <Link href={`/companies/${company.id}`} className={styles.card}>
      <div className={styles.top}>
        <span className={styles.name}>{company.name}</span>
        <span className={styles.period}>{company.period}</span>
        <span className={styles.meta}>
          {caseCount} case {caseCount === 1 ? "study" : "studies"} ·{" "}
          {company.technologies.length} technologies
        </span>
      </div>
      <div className={styles.role}>{company.role}</div>
      <div className={styles.summary}>{company.summary}</div>
      <div className={styles.phase}>phase: {company.phase.toLowerCase()}</div>
    </Link>
  );
}
