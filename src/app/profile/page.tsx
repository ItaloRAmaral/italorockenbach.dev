import { ProfileIntro } from "@/components/profile/ProfileIntro";
import { ProseSection } from "@/components/shared/ProseSection";
import { ListSection } from "@/components/shared/ListSection";
import { TimelineTabs } from "@/components/profile/TimelineTabs";
import { ChipSection } from "@/components/shared/ChipSection";
import { QuoteSection } from "@/components/shared/QuoteSection";
import { getLearning, getProfile } from "@/repositories/content-repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Profile",
  description:
    "Career arc, values, education, and engineering evolution — from a production-engineering background and a 2022 career change into backend and architecture ownership.",
  path: "/profile",
});

export default function ProfilePage() {
  const profile = getProfile();
  const learning = getLearning();

  return (
    <div className="container">
      <ProfileIntro oneLiner={profile.oneLiner} />
      <ProseSection title="Positioning" paragraphs={profile.about} />
      <ProseSection title="Career arc" paragraphs={profile.philosophy} />
      <TimelineTabs evolution={profile.evolution} education={learning} />
      <ListSection title="How I think" items={profile.values} />
      <ListSection title="Strengths" items={profile.strengths} />
      <ListSection title="Preferred problems" items={profile.preferredProblems} />
      <ChipSection title="Current interests" items={profile.interests} />
      <QuoteSection quote={profile.quote} />
    </div>
  );
}
