"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchHit } from "@/lib/search";
import { kindLabel } from "@/lib/search";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { Highlighted } from "./Highlighted";
import { SEARCH_OPEN_EVENT } from "./search-events";
import styles from "./CommandPalette.module.css";

/**
 * Keyboard-first search available from every page (Cmd/Ctrl+K).
 *
 * The palette answers "take me there"; the panel on the home page answers
 * "tell me about". Same index, same ranking — different intent, so the palette
 * lists destinations and shows the matching passage as supporting evidence
 * rather than leading with it.
 */
export function CommandPalette() {
  const router = useRouter();
  const { load, run } = useSearchIndex();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActive(0);
  }, []);

  // The global shortcut. Registered once, independent of open state, so the
  // listener is not torn down and rebuilt on every keystroke.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        void load();
      }
    }

    function onOpenRequest() {
      setOpen(true);
      void load();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener(SEARCH_OPEN_EVENT, onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener(SEARCH_OPEN_EVENT, onOpenRequest);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const ask = useCallback(
    async (value: string) => {
      setQuery(value);
      setActive(0);

      if (value.trim().length < 2) {
        setHits([]);
        return;
      }

      await load();
      setHits(run(value, 7));
    },
    [load, run],
  );

  const go = useCallback(
    (hit: SearchHit) => {
      close();
      router.push(hit.doc.href);
    },
    [close, router],
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (hits.length === 0 ? 0 : (current + 1) % hits.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (hits.length === 0 ? 0 : (current - 1 + hits.length) % hits.length));
      return;
    }
    if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      go(hits[active]);
    }
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={close}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Search this record"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={query}
          onChange={(event) => void ask(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Search cases, notes, technologies, principles…"
          aria-label="Search query"
          autoComplete="off"
        />

        {query.trim().length >= 2 && hits.length === 0 && (
          <div className={styles.empty}>Nothing in the record covers that.</div>
        )}

        {hits.length > 0 && (
          <ul className={styles.results}>
            {hits.map((hit, index) => (
              <li key={`${hit.doc.href}-${hit.doc.title}`}>
                <button
                  type="button"
                  className={styles.result}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(hit)}
                >
                  <span className={styles.kind}>{kindLabel(hit.doc.kind)}</span>
                  <span className={styles.resultBody}>
                    <span className={styles.title}>
                      <Highlighted text={hit.doc.title} terms={hit.matched} />
                    </span>
                    {hit.passage && (
                      <span className={styles.passage}>
                        <Highlighted text={hit.passage.text} terms={hit.matched} />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.foot}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
