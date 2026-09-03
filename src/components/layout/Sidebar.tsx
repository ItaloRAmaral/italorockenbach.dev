"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { NAV_GROUPS, isCurrentRoute } from "./nav";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.name}>Italo Rockenbach Amaral</div>
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
        <span className={styles.rev}>rev. 2026.08</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
