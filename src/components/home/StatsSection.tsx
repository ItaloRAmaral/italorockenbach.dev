import type { Stat } from "@/domain/types";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./StatsSection.module.css";

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title="By the numbers" />
      <div className={styles.row}>
        {stats.map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <div className={`${styles.value} tabular`}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
