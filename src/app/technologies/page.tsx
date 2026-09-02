import { PageHeader } from "@/components/shared/PageHeader";
import { TechnologyListCard } from "@/components/technologies/TechnologyListCard";
import { getCompaniesForTechnology, getTechnologies } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Technologies",
  description: "Every technology I've used, documented by how — not a logo grid.",
  path: "/technologies",
});

export default function TechnologiesPage() {
  const technologies = getTechnologies();

  return (
    <div className="container">
      <PageHeader
        title="Technologies"
        lede="Every entry documents how I used it — not a logo grid."
      />
      <div className={styles.grid}>
        {technologies.map((technology) => (
          <TechnologyListCard
            technology={technology}
            usedAt={getCompaniesForTechnology(technology.name)}
            key={technology.name}
          />
        ))}
      </div>
    </div>
  );
}
