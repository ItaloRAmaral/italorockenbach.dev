"use client";

import { useEffect, useState } from "react";
import styles from "./CopyLinkButton.module.css";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // clipboard blocked (permissions, insecure context) — leave the label unchanged
    }
  }

  return (
    <button type="button" className={styles.button} onClick={copyLink}>
      {copied ? "✓ link copied" : "copy link"}
    </button>
  );
}
