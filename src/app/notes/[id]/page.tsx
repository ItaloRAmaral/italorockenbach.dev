import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { DocumentSection } from "@/components/shared/DocumentSection";
import { NoteFacts } from "@/components/notes/NoteFacts";
import { getCaseStudy, getNote, getNotes } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Only the slugs listed by generateStaticParams exist. Anything else is a 404
 * with no work done, rather than an on-demand render of a page that will call
 * notFound() anyway. Safe here because the content is compiled into the bundle:
 * a new entry already requires a rebuild, which the content-sync workflow does.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ id: note.id }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = getNote(id);
  if (!note) return { title: "Note not found" };
  return pageMetadata({
    title: `${note.title} — Notes`,
    description: note.summary,
    path: `/notes/${note.id}`,
    type: "article",
  });
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = getNote(id);
  if (!note) notFound();

  const relatedCases = note.relatedCaseStudies
    .map((caseId) => getCaseStudy(caseId))
    .filter((study) => study !== undefined);

  return (
    <>
      <ReadingProgress />
      <div className={styles.layout}>
        <article>
          <Breadcrumb label="Notes" href="/notes" current={note.id} />
          <h1 className={styles.title}>{note.title}</h1>
          <p className={styles.lede}>{note.summary}</p>

          {note.sections.map((section, index) => (
            <DocumentSection section={section} index={index} key={section.id} />
          ))}
        </article>

        <aside className={styles.aside}>
          <NoteFacts note={note} relatedCases={relatedCases} />
        </aside>
      </div>
    </>
  );
}
