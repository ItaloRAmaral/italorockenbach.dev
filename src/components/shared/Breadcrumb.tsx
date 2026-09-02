import Link from "next/link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbProps {
  label: string;
  href: string;
  current: string;
}

export function Breadcrumb({ label, href, current }: BreadcrumbProps) {
  return (
    <div className={styles.crumb}>
      <Link href={href}>{label}</Link>
      <span>/</span>
      <span>{current}</span>
    </div>
  );
}
