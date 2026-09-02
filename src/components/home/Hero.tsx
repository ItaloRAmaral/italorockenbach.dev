import { contactLinks } from "@/config";
import type { Company, Profile } from "@/domain/types";
import styles from "./Hero.module.css";

interface HeroProps {
  profile: Profile;
  primaryCompany: Company;
  /** e.g. "3+ years" — sourced from the repository, never computed in the UI. */
  experience: string;
}

export function Hero({ profile, primaryCompany, experience }: HeroProps) {
  const links = contactLinks();

  return (
    <section className={styles.hero}>
      <h1 className={styles.name}>{profile.name}</h1>
      <div className={styles.role}>{primaryCompany.role}</div>

      <div className={styles.contactRow}>
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>Based</dt>
          <dd>{primaryCompany.location}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>{experience}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>{profile.focus.join(" · ")}</dd>
        </div>
      </dl>

      <p className={styles.thesis}>
        Every case study here answers one question:{" "}
        <strong>what evidence does this give about the engineer I am?</strong>
      </p>
    </section>
  );
}
