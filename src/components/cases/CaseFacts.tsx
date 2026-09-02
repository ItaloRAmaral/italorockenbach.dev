import Link from "next/link";
import type { CaseStudy, Company } from "@/domain/types";
import { slugify } from "@/lib/slug";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import styles from "./CaseFacts.module.css";

interface CaseFactsProps {
  study: CaseStudy;
  company: Company | undefined;
}

export function CaseFacts({ study, company }: CaseFactsProps) {
  const facts: Array<[string, string]> = [
    ["category", study.category],
    ["difficulty", study.difficulty],
    ["ownership", study.ownership],
    ["customer facing", study.customerFacing],
    ["reading time", study.readingTime],
  ];

  return (
    <div className={styles.card}>
      {facts.map(([key, value]) => (
        <div key={key}>
          <div className={styles.key}>{key}</div>
          <div className={styles.value}>{value}</div>
        </div>
      ))}

      <div>
        <div className={styles.key}>company</div>
        {company ? (
          <Link className={styles.link} href={`/companies/${company.id}`}>
            {company.name}
          </Link>
        ) : (
          <div className={styles.value}>{study.company}</div>
        )}
      </div>

      <div>
        <div className={styles.key}>capabilities</div>
        <div className={styles.tagRow}>
          {study.capabilities.map((name) => (
            <Link className={styles.tag} href={`/capabilities/${slugify(name)}`} key={name}>
              {name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className={styles.key}>technologies</div>
        <div className={styles.tagRow}>
          {study.technologies.map((name) => (
            <Link className={styles.tag} href={`/technologies/${slugify(name)}`} key={name}>
              {name}
            </Link>
          ))}
        </div>
      </div>

      <CopyLinkButton />
    </div>
  );
}
