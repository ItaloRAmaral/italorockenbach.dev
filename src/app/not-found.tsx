import Link from "next/link";
import type { Metadata } from "next";
import { getCaseStudies, getNotes } from "@/repositories/content-repository";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

/**
 * Most routes here are long slugs (`/cases/rewriting-a-legacy-monolith-…`), so
 * a mistyped or truncated link is a realistic way to arrive. The default Next
 * page renders outside the shell, with no navigation and no way back — this one
 * keeps the layout and offers the two places a visitor was most likely headed.
 */
export default function NotFound() {
  const cases = getCaseStudies().slice(0, 3);
  const notes = getNotes().slice(0, 2);

  return (
    <div className="container">
      <h1 className={styles.title}>That page isn&apos;t here</h1>
      <p className={styles.lede}>
        The link may be truncated, or the page may have been renamed. Everything on this
        site is reachable from the navigation, or through search — press{" "}
        <kbd className={styles.kbd}>⌘K</kbd> from any page.
      </p>

      <div className={styles.columns}>
        <div>
          <h2 className={styles.sectionTitle}>Case studies</h2>
          <ul className={styles.list}>
            {cases.map((study) => (
              <li key={study.id}>
                <Link href={`/cases/${study.id}`}>{study.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/cases">All case studies →</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>Notes</h2>
          <ul className={styles.list}>
            {notes.map((note) => (
              <li key={note.id}>
                <Link href={`/notes/${note.id}`}>{note.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/notes">All notes →</Link>
            </li>
          </ul>
        </div>
      </div>

      <Link href="/" className={styles.home}>
        ← Back to the start
      </Link>
    </div>
  );
}
