import Link from "next/link";
import type { Capability } from "@/domain/types";
import { slugify } from "@/lib/slug";
import styles from "./CapabilityListCard.module.css";

interface CapabilityListCardProps {
  capability: Capability;
  caseCount: number;
  companyCount: number;
}

export function CapabilityListCard({
  capability,
  caseCount,
  companyCount,
}: CapabilityListCardProps) {
  const total = caseCount + companyCount;

  return (
    <Link href={`/capabilities/${slugify(capability.name)}`} className={styles.card}>
      <div className={styles.head}>
        <span className={styles.name}>{capability.name}</span>
        <div className={styles.squares}>
          {Array.from({ length: Math.min(8, total) }, (_, i) => (
            <span className={styles.square} key={i} />
          ))}
        </div>
      </div>
      <div className={styles.desc}>{capability.desc}</div>
      <div className={styles.evidence}>
        {caseCount} case {caseCount === 1 ? "study" : "studies"} · {companyCount}{" "}
        {companyCount === 1 ? "company" : "companies"}
      </div>
    </Link>
  );
}
