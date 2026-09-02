import type { Company } from "@/domain/types";
import styles from "./CompanyHeader.module.css";

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const facts: Array<[string, string]> = [
    ["role", company.role],
    ["period", company.period],
    ["domain", company.domainLabels.join(", ")],
  ];

  return (
    <div className={styles.header}>
      <h1 className={styles.name}>{company.name}</h1>
      <dl className={styles.facts}>
        {facts.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.summary}>{company.summary}</p>
    </div>
  );
}
