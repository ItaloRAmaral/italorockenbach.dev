import { SectionHead } from "./SectionHead";
import styles from "./ListSection.module.css";

interface ListSectionProps {
  title: string;
  items: string[];
  /** "dash" for a plain list (values, strengths); "plus" for achievements-style emphasis. */
  marker?: "dash" | "plus";
}

/** A title followed by a marked list — values, strengths, preferred problems, achievements. */
export function ListSection({ title, items, marker = "dash" }: ListSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title={title} />
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item}>
            <span className={styles.marker} data-variant={marker}>
              {marker === "plus" ? "+" : "—"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
