import { Hero } from "@/components/home/Hero";
import { CareerSection } from "@/components/home/CareerSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { NotesSection } from "@/components/home/NotesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { QuoteSection } from "@/components/shared/QuoteSection";
import {
  getCaseStudies,
  getCompanies,
  getExperienceSummary,
  getFeaturedCaseStudies,
  getLearning,
  getNotes,
  getProfile,
  getStats,
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

  return (
    <div className="container">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- our own generated data, not user input
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(profile, primaryCompany?.name, learning)),
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
