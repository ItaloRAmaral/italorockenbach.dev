import type { DocumentSection as DocumentSectionData } from "@/domain/types";
import styles from "./DocumentSection.module.css";

interface DocumentSectionProps {
  section: DocumentSectionData;
  index: number;
}

/** A numbered section — paragraphs and/or bullets — reused by Case Study and
 *  Note detail pages, both of which parse into the same section shape. */
export function DocumentSection({ section, index }: DocumentSectionProps) {
  const number = index + 1 < 10 ? `0${index + 1}` : String(index + 1);

  return (
    <section className={styles.section} id={`sec-${section.id}`} data-sec={section.id}>
      <div className={styles.head}>
        <span className={styles.number}>{number}</span>
        <h2 className={styles.title}>{section.title}</h2>
      </div>
      {section.paras.map((paragraph) => (
        <p className={styles.paragraph} key={paragraph}>
          {paragraph}
        </p>
      ))}
      {section.bullets.length > 0 && (
        <ul className={styles.bullets}>
          {section.bullets.map((bullet) => (
            <li key={bullet}>
              <span className={styles.marker}>—</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {section.tables.map((table, tableIndex) => (
        <div className={styles.tableWrap} key={tableIndex}>
          <table className={styles.table}>
            <thead>
              <tr>
                {table.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
