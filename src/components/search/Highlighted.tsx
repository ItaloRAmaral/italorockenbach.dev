import { highlight } from "@/lib/search";
import styles from "./Highlighted.module.css";

interface HighlightedProps {
  text: string;
  terms: string[];
}

/** Wraps the query's matching words so the eye lands on why a passage matched. */
export function Highlighted({ text, terms }: HighlightedProps) {
  return (
    <>
      {highlight(text, terms).map((part, index) =>
        part.hit ? (
          <mark key={index} className={styles.hit}>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
