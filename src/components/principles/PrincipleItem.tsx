import Link from "next/link";
import type { Principle } from "@/domain/types";
import { getCaseStudy } from "@/repositories/content-repository";
import styles from "./PrincipleItem.module.css";

interface PrincipleItemProps {
  principle: Principle;
  index: number;
}

export function PrincipleItem({ principle, index }: PrincipleItemProps) {
  const number = index + 1 < 10 ? `0${index + 1}` : String(index + 1);
  const originCase = principle.caseId ? getCaseStudy(principle.caseId) : undefined;

  return (
    <details className={styles.item}>
      <summary className={styles.summary}>
        <span className={styles.number}>{number}</span>
        <span className={styles.text}>{principle.text}</span>
      </summary>
      <div className={styles.body}>
        <p className={styles.explanation}>{principle.explanation}</p>

        <div className={styles.field}>
          <div className={styles.key}>where this came from</div>
          <p className={styles.value}>{principle.origin}</p>
        </div>

        <div className={styles.field}>
          <div className={styles.key}>applied since</div>
          <p className={styles.value}>{principle.applied}</p>
        </div>

        {originCase && (
          <Link className={styles.link} href={`/cases/${originCase.id}`}>
            {originCase.title} →
          </Link>
        )}
      </div>
    </details>
  );
}
