import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  title: string;
  meta?: string;
}

export function SectionHead({ title, meta }: SectionHeadProps) {
  return (
    <div className={styles.head}>
      <h2>{title}</h2>
      {meta && <span className={styles.meta}>{meta}</span>}
    </div>
  );
}
