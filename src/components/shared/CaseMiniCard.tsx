import Link from "next/link";
import type { CaseStudy } from "@/domain/types";
import { categoryStyle } from "@/lib/category-style";
import styles from "./CaseMiniCard.module.css";

interface CaseMiniCardProps {
  study: CaseStudy;
}

/** A compact case-study reference — used anywhere a case study is linked to
 *  from a different document (a company, a capability, a technology). */
export function CaseMiniCard({ study }: CaseMiniCardProps) {
  const category = categoryStyle(study.category);

  return (
    <Link href={`/cases/${study.id}`} className={styles.card}>
      <div className={styles.meta}>
        <span style={{ color: `var(${category.token})` }}>{category.label}</span>
        <span className={styles.period}>{study.period}</span>
      </div>
      <div className={styles.title}>{study.title}</div>
      <div className={styles.summary}>{study.summary}</div>
    </Link>
  );
}
