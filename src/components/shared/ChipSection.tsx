import { SectionHead } from "./SectionHead";
import styles from "./ChipSection.module.css";

interface ChipSectionProps {
  title: string;
  items: string[];
}

/** A title followed by a row of small tags — interests, technologies. */
export function ChipSection({ title, items }: ChipSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title={title} />
      <div className={styles.row}>
        {items.map((item) => (
          <span className={styles.chip} key={item}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
