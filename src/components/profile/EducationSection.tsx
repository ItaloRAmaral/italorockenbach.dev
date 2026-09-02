import type { LearningEntry } from "@/domain/types";
import styles from "./EducationSection.module.css";

interface EducationSectionProps {
  entries: LearningEntry[];
}

const STATUS_LABEL: Record<LearningEntry["status"], string | null> = {
  completed: null,
  "in-progress": "in progress",
  "coursework-only": "coursework only",
};

export function EducationSection({ entries }: EducationSectionProps) {
  return (
    <div className={styles.timeline}>
      {entries.map((entry) => {
        const statusLabel = STATUS_LABEL[entry.status];
        return (
          <div className={styles.row} key={`${entry.institution}-${entry.program}`}>
            <span className={styles.dot} />
            <div className={styles.period}>{entry.period}</div>
            <div>
              <div className={styles.head}>
                <span className={styles.institution}>{entry.institution}</span>
                {statusLabel && <span className={styles.badge}>{statusLabel}</span>}
              </div>
              <div className={styles.program}>{entry.program}</div>
              {entry.detail && <p className={styles.detail}>{entry.detail}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
