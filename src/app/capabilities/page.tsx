import { PageHeader } from "@/components/shared/PageHeader";
import { CapabilityListCard } from "@/components/capabilities/CapabilityListCard";
import {
  getCapabilities,
  getCaseStudiesForCapability,
  getCompaniesForCapability,
} from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Capabilities",
  description: "Not technologies — capabilities. Each one links to the documents that prove it.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  const capabilities = getCapabilities();

  return (
    <div className="container">
      <PageHeader
        title="Capabilities"
        lede="Not technologies — capabilities. Each one links to the documents that prove it."
      />
      <div className={styles.grid}>
        {capabilities.map((capability) => (
          <CapabilityListCard
            capability={capability}
            caseCount={getCaseStudiesForCapability(capability.name).length}
            companyCount={getCompaniesForCapability(capability.name).length}
            key={capability.name}
          />
        ))}
      </div>
    </div>
  );
}
