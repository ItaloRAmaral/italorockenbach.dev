"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Home", href: "/" },
      { label: "Profile", href: "/profile" },
    ],
  },
  {
    label: "Career Evidence",
    items: [
      { label: "Companies", href: "/companies" },
      { label: "Case Studies", href: "/cases" },
      { label: "Capabilities", href: "/capabilities" },
      { label: "Technologies", href: "/technologies" },
      { label: "Principles", href: "/principles" },
    ],
  },
  {
    label: "Field Notes",
    items: [{ label: "All Notes", href: "/notes" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.name}>Italo Rockenbach Amaral</div>
        <div className={styles.role}>Engineering Record</div>
      </div>

      {NAV_GROUPS.map((group) => (
        <nav className={styles.navGroup} key={group.label} aria-label={group.label}>
          <div className={styles.navGroupLabel}>{group.label}</div>
          {group.items.map((item) => {
            const isCurrent =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                data-current={isCurrent}
              >
                <span className={styles.navDot} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      ))}

      <div className={styles.foot}>
        <span className={styles.rev}>rev. 2026.08</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
