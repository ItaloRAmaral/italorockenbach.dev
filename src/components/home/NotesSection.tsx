import Link from "next/link";
import type { Note } from "@/domain/types";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./NotesSection.module.css";

interface NotesSectionProps {
  notes: Note[];
}

export function NotesSection({ notes }: NotesSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title="Field notes" meta={`${notes.length} total →`} metaHref="/notes" />
      <p className={styles.intro}>
        General technical knowledge, independent of any employer — patterns and
        lessons worth knowing on their own merits.
      </p>
      <div className={styles.list}>
        {notes.map((note) => (
          <Link href={`/notes/${note.id}`} className={styles.row} key={note.id}>
            <span className={styles.topic}>{note.topic}</span>
            <span className={styles.title}>{note.title}</span>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
