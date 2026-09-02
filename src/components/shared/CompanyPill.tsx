import Link from "next/link";
import type { Company } from "@/domain/types";
import styles from "./CompanyPill.module.css";

interface CompanyPillProps {
  company: Company;
}

export function CompanyPill({ company }: CompanyPillProps) {
  return (
    <Link href={`/companies/${company.id}`} className={styles.pill}>
      <span className={styles.name}>{company.name}</span>
      <span className={styles.period}>{company.period}</span>
    </Link>
  );
}
