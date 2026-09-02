import Link from "next/link";
import type { Company, Technology } from "@/domain/types";
import { slugify } from "@/lib/slug";
import styles from "./TechnologyListCard.module.css";

interface TechnologyListCardProps {
  technology: Technology;
  usedAt: Company[];
}

export function TechnologyListCard({ technology, usedAt }: TechnologyListCardProps) {
  return (
    <Link href={`/technologies/${slugify(technology.name)}`} className={styles.card}>
      <div className={styles.head}>
        <span className={styles.name}>{technology.name}</span>
        <span className={styles.meta}>
          {usedAt.length > 0 ? usedAt.map((company) => company.name).join(" · ") : "freelance"}
        </span>
      </div>
      <div className={styles.usage}>{technology.usage}</div>
    </Link>
  );
}
