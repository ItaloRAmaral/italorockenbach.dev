"use client";

import { useState } from "react";
import type { EvolutionStep, LearningEntry } from "@/domain/types";
import { EvolutionTimeline } from "@/components/shared/EvolutionTimeline";
import { EducationSection } from "./EducationSection";
import styles from "./TimelineTabs.module.css";

interface TimelineTabsProps {
  evolution: EvolutionStep[];
  education: LearningEntry[];
}

const TABS = [
  { key: "evolution", label: "Evolution" },
  { key: "education", label: "Education" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function TimelineTabs({ evolution, education }: TimelineTabsProps) {
  const [active, setActive] = useState<TabKey>("evolution");

  return (
    <section className={styles.section}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            type="button"
            role="tab"
            key={tab.key}
            aria-selected={active === tab.key}
            className={styles.tab}
            data-active={active === tab.key}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "evolution" ? (
        <EvolutionTimeline steps={evolution} />
      ) : (
        <EducationSection entries={education} />
      )}
    </section>
  );
}
