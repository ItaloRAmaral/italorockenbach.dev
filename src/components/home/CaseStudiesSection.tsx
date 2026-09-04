import type { CaseStudy } from "@/domain/types";
import { CaseCard } from "./CaseCard";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./CaseStudiesSection.module.css";

interface CaseStudiesSectionProps {
  featured: CaseStudy[];
  total: number;
}

export function CaseStudiesSection({ featured, total }: CaseStudiesSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHead title="Featured case studies" meta={`${total} total →`} metaHref="/cases" />
      <div className={styles.list}>
        {featured.map((study) => (
          <CaseCard study={study} key={study.id} />
        ))}
      </div>
    </section>
  );
}
