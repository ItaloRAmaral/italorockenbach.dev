import styles from "./QuoteSection.module.css";

interface QuoteSectionProps {
  quote: string;
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  return <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>;
}
