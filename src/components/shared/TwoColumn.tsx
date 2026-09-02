import type { ReactNode } from "react";
import styles from "./TwoColumn.module.css";

interface TwoColumnProps {
  left: ReactNode;
  right: ReactNode;
}

export function TwoColumn({ left, right }: TwoColumnProps) {
  return (
    <div className={styles.grid}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
