import type { EvolutionStep } from "@/domain/types";
import styles from "./EvolutionTimeline.module.css";

interface EvolutionTimelineProps {
  steps: EvolutionStep[];
}

export function EvolutionTimeline({ steps }: EvolutionTimelineProps) {
  return (
    <div className={styles.timeline}>
      {steps.map((step) => (
        <div className={styles.row} key={`${step.year}-${step.label}`}>
          <span className={styles.dot} />
          <div className={styles.year}>{step.year}</div>
          <div>
            <div className={styles.label}>{step.label}</div>
            <div className={styles.detail}>{step.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
