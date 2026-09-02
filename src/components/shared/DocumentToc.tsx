"use client";

import { useEffect, useState } from "react";
import type { DocumentSection } from "@/domain/types";
import styles from "./DocumentToc.module.css";

interface DocumentTocProps {
  sections: DocumentSection[];
}

export function DocumentToc({ sections }: DocumentTocProps) {
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        let current = "";
        document.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => {
          if (el.getBoundingClientRect().top < 150) {
            current = el.dataset.sec ?? "";
          }
        });
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }

  return (
    <div className={styles.toc}>
      <div className={styles.label}>on this page</div>
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          className={styles.item}
          data-active={active === section.id}
          onClick={() => scrollToSection(section.id)}
        >
          {section.title}
        </button>
      ))}
    </div>
  );
}
