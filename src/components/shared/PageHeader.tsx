import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  lede?: string;
}

/** The header for a listing page (Companies, Case Studies, Notes) — not for
 *  the Home hero or a detail page, which both have their own layouts. */
export function PageHeader({ title, lede }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {lede && <p className={styles.lede}>{lede}</p>}
    </header>
  );
}
