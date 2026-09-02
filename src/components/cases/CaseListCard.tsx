import Link from "next/link";
import type { CaseStudy } from "@/domain/types";
import { categoryStyle } from "@/lib/category-style";
import styles from "./CaseListCard.module.css";

interface CaseListCardProps {
  study: CaseStudy;
  companyName: string;
}

export function CaseListCard({ study, companyName }: CaseListCardProps) {
  const category = categoryStyle(study.category);

  return (
    <Link href={`/cases/${study.id}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.company}>{companyName}</span>
        <span style={{ color: `var(${category.token})` }}>{category.label}</span>
        <span className={styles.push}>
          {study.featured && <span className={styles.star}>★ featured · </span>}
          {study.readingTime}
        </span>
      </div>
      <div className={styles.title}>{study.title}</div>
      <div className={styles.summary}>{study.summary}</div>
    </Link>
  );
}
