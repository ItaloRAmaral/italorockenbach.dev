import { SectionHead } from "./SectionHead";
import styles from "./ProseSection.module.css";

interface ProseSectionProps {
  title: string;
  paragraphs: string[];
}

/** A title followed by plain prose paragraphs — company overviews, profile positioning, etc. */
export function ProseSection({ title, paragraphs }: ProseSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title={title} />
      {paragraphs.map((paragraph) => (
        <p className={styles.paragraph} key={paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}
