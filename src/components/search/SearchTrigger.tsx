"use client";

import { openSearch } from "./search-events";
import styles from "./SearchTrigger.module.css";

interface SearchTriggerProps {
  /** "full" shows the labelled bar used in the sidebar; "icon" the compact
   *  button used in the mobile top bar, where there is no room for a label. */
  variant?: "full" | "icon";
}

export function SearchTrigger({ variant = "full" }: SearchTriggerProps) {
  return (
    <button
      type="button"
      className={variant === "full" ? styles.bar : styles.icon}
      onClick={openSearch}
      aria-label="Search this record"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" strokeLinecap="round" />
      </svg>
      {variant === "full" && (
        <>
          <span className={styles.label}>Search</span>
          <kbd className={styles.kbd}>⌘K</kbd>
        </>
      )}
    </button>
  );
}
