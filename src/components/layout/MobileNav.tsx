"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { NAV_GROUPS, isCurrentRoute } from "./nav";
import styles from "./MobileNav.module.css";

/**
 * Navigation for viewports where the sidebar is hidden. Below 860px the sidebar
 * is display:none, which used to leave the site with no navigation at all —
 * a visitor could only reach other pages through in-page links.
 *
 * The drawer closes on navigation via the links' own onClick rather than an
 * effect watching the pathname: setting state in an effect is the pattern that
 * caused the theme flash (see useTheme), and here it isn't needed at all.
 */
interface MobileNavProps {
  /** From the knowledge base, not written here — the name has one source. */
  name: string;
}

export function MobileNav({ name }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Escape closes the drawer, and the page behind it must not scroll while it
  // is open. Both are synchronisation with the document, not derived state.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.bar}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>Engineering Record</span>
        </Link>

        <div className={styles.barActions}>
          <SearchTrigger variant="icon" />
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div
        className={styles.backdrop}
        data-open={open}
        onClick={close}
        aria-hidden="true"
      />

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        className={styles.panel}
        data-open={open}
        tabIndex={-1}
        // Out of the keyboard order and hidden from assistive tech while
        // closed — the panel stays mounted so it can animate.
        inert={!open}
      >
        {NAV_GROUPS.map((group) => (
          <nav className={styles.navGroup} key={group.label} aria-label={group.label}>
            <div className={styles.navGroupLabel}>{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                data-current={isCurrentRoute(item.href, pathname)}
                onClick={() => setOpen(false)}
              >
                <span className={styles.navDot} />
                {item.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </div>
  );
}
