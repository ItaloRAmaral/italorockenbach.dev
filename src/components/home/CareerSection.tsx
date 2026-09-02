import Link from "next/link";
import type { Company } from "@/domain/types";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./CareerSection.module.css";

interface CareerSectionProps {
  companies: Company[];
}

export function CareerSection({ companies }: CareerSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead
        title="Career"
        meta={`${companies.length} ${companies.length === 1 ? "company" : "companies"}`}
      />
      <div className={styles.list}>
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className={styles.card}
          >
            <div className={styles.top}>
              <span className={styles.name}>{company.name}</span>
              <span className={styles.period}>{company.period}</span>
            </div>
            <div className={styles.desc}>{company.summary}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
