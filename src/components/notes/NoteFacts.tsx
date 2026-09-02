import Link from "next/link";
import type { CaseStudy, Note } from "@/domain/types";
import { slugify } from "@/lib/slug";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import styles from "./NoteFacts.module.css";

interface NoteFactsProps {
  note: Note;
  relatedCases: CaseStudy[];
}

export function NoteFacts({ note, relatedCases }: NoteFactsProps) {
  return (
    <div className={styles.card}>
      <div>
        <div className={styles.key}>topic</div>
        <div className={styles.value}>{note.topic}</div>
      </div>

      <div>
        <div className={styles.key}>reading time</div>
        <div className={styles.value}>{note.readingTime}</div>
      </div>

      {note.capabilities.length > 0 && (
        <div>
          <div className={styles.key}>capabilities</div>
          <div className={styles.tagRow}>
            {note.capabilities.map((name) => (
              <Link className={styles.tag} href={`/capabilities/${slugify(name)}`} key={name}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {note.technologies.length > 0 && (
        <div>
          <div className={styles.key}>technologies</div>
          <div className={styles.tagRow}>
            {note.technologies.map((name) => (
              <Link className={styles.tag} href={`/technologies/${slugify(name)}`} key={name}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedCases.length > 0 && (
        <div>
          <div className={styles.key}>related evidence</div>
          <div className={styles.linkList}>
            {relatedCases.map((study) => (
              <Link className={styles.link} href={`/cases/${study.id}`} key={study.id}>
                {study.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <CopyLinkButton />
    </div>
  );
}
