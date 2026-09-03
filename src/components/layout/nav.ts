/** The site's navigation, shared by the desktop sidebar and the mobile drawer.
 *  One definition on purpose — two copies drift the moment a page is added. */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
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

/** "/" only matches itself; every other route also matches its detail pages. */
export function isCurrentRoute(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
