"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { NAV_GROUPS, isCurrentRoute } from "./nav";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  /** From the knowledge base, not written here — the name has one source. */
  name: string;
  /** Build month, e.g. "2026.09" — computed by the server layout so the
   *  footer cannot drift out of date the way a hardcoded string did. */
  revision: string;
}

export function Sidebar({ name, revision }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.name}>{name}</div>
        <div className={styles.role}>Engineering Record</div>
      </div>

      <SearchTrigger />

      {NAV_GROUPS.map((group) => (
        <nav className={styles.navGroup} key={group.label} aria-label={group.label}>
          <div className={styles.navGroupLabel}>{group.label}</div>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              data-current={isCurrentRoute(item.href, pathname)}
            >
              <span className={styles.navDot} />
              {item.label}
            </Link>
          ))}
        </nav>
      ))}

      <div className={styles.foot}>
        <span className={styles.rev}>rev. {revision}</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
