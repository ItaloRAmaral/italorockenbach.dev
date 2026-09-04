import Link from "next/link";
import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  title: string;
  meta?: string;
  /** When the meta points somewhere, pass the href — a "N total →" that is not
   *  clickable promises a destination the arrow already announced. */
  metaHref?: string;
}

export function SectionHead({ title, meta, metaHref }: SectionHeadProps) {
  return (
    <div className={styles.head}>
      <h2>{title}</h2>
      {meta &&
        (metaHref ? (
          <Link href={metaHref} className={styles.metaLink}>
            {meta}
          </Link>
        ) : (
          <span className={styles.meta}>{meta}</span>
        ))}
    </div>
  );
}
