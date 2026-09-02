import styles from "./ProfileIntro.module.css";

interface ProfileIntroProps {
  oneLiner: string;
}

export function ProfileIntro({ oneLiner }: ProfileIntroProps) {
  return (
    <header className={styles.intro}>
      <div className={styles.eyebrow}>Profile</div>
      <h1 className={styles.title}>Who I am</h1>
      <p className={styles.lede}>
        Not a résumé — a technical identity. What follows is how I work,
        evidenced elsewhere in this repository.
      </p>
      <p className={styles.oneLiner}>&ldquo;{oneLiner}&rdquo;</p>
    </header>
  );
}
