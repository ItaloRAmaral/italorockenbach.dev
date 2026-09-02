import Link from "next/link";
import type { Note } from "@/domain/types";
import styles from "./NoteListCard.module.css";

interface NoteListCardProps {
  note: Note;
}

export function NoteListCard({ note }: NoteListCardProps) {
  return (
    <Link href={`/notes/${note.id}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.topic}>{note.topic}</span>
        <span className={styles.push}>{note.readingTime}</span>
      </div>
      <div className={styles.title}>{note.title}</div>
      <div className={styles.summary}>{note.summary}</div>
    </Link>
  );
}
