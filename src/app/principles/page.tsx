import { PageHeader } from "@/components/shared/PageHeader";
import { PrincipleItem } from "@/components/principles/PrincipleItem";
import { getPrinciples } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Principles",
  description:
    "Cross-cutting lessons distilled from real case studies — added only when earned, each one traceable back to the evidence it came from.",
  path: "/principles",
});

export default function PrinciplesPage() {
  const principles = getPrinciples();

  return (
    <div className="container">
      <PageHeader
        title="Principles"
        lede="Cross-cutting lessons distilled from real case studies — added only when earned, each one traceable back to the evidence it came from."
      />
      <div className={styles.list}>
        {principles.map((principle, index) => (
          <PrincipleItem principle={principle} index={index} key={principle.id} />
        ))}
      </div>
    </div>
  );
}
