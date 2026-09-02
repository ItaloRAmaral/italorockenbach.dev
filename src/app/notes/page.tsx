import { PageHeader } from "@/components/shared/PageHeader";
import { NoteListCard } from "@/components/notes/NoteListCard";
import { getNotes } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Notes",
  description:
    "General technical knowledge — not tied to one employer, generalized from real case studies.",
  path: "/notes",
});

export default function NotesPage() {
  const notes = getNotes();

  return (
    <div className="container">
      <PageHeader
        title="Notes"
        lede="General technical knowledge — not tied to one employer, generalized from real case studies."
      />
      <div className={styles.list}>
        {notes.map((note) => (
          <NoteListCard note={note} key={note.id} />
        ))}
      </div>
    </div>
  );
}
