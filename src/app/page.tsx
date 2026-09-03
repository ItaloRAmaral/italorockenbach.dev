import { Hero } from "@/components/home/Hero";
import { CareerSection } from "@/components/home/CareerSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { NotesSection } from "@/components/home/NotesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { QuoteSection } from "@/components/shared/QuoteSection";
import {
  getCapabilities,
  getCaseStudies,
  getCompanies,
  getExperienceSummary,
  getFeaturedCaseStudies,
  getLearning,
  getNotes,
  getProfile,
  getStats,
  getTechnologies,
} from "@/repositories/content-repository";
import { personJsonLd } from "@/lib/seo";

export default function HomePage() {
  const profile = getProfile();
  const companies = getCompanies();
  const primaryCompany = companies[0];
  const featuredCases = getFeaturedCaseStudies();
  const totalCases = getCaseStudies().length;
  const notes = getNotes();
  const stats = getStats();
  const learning = getLearning();

  // What the site claims expertise in, straight from the knowledge base — so
  // the structured data can never list a skill the pages don't back up.
  const knowsAbout = [
    ...getCapabilities().map((capability) => capability.name),
    ...getTechnologies().map((technology) => technology.name),
  ];

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personJsonLd({
              profile,
              companyName: primaryCompany?.name,
              jobTitle: primaryCompany?.role,
              learning,
              knowsAbout,
            }),
          ),
        }}
      />
      <Hero
        profile={profile}
        primaryCompany={primaryCompany}
        experience={getExperienceSummary()}
      />
      <CareerSection companies={companies} />
      <CaseStudiesSection featured={featuredCases} total={totalCases} />
      <NotesSection notes={notes} />
      <StatsSection stats={stats} />
      <QuoteSection quote={profile.quote} />
    </div>
  );
}
