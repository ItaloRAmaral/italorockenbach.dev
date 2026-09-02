import Link from "next/link";
import type { CaseStudy } from "@/domain/types";
import { categoryStyle } from "@/lib/category-style";
import styles from "./CaseCard.module.css";

interface CaseCardProps {
  study: CaseStudy;
}

export function CaseCard({ study }: CaseCardProps) {
  const category = categoryStyle(study.category);

  return (
    <Link href={`/cases/${study.id}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.tag} style={{ color: `var(${category.token})` }}>
          {category.label}
        </span>
        <span className={styles.date}>{study.period}</span>
      </div>
      <div className={styles.title}>{study.title}</div>
      <div className={styles.impact}>{study.summary}</div>
    </Link>
  );
}
