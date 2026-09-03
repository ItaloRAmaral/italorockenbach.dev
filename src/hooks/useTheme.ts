"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/**
 * Dark is the site's default appearance (see src/config.ts) — this hook only
 * ever needs to track whether the visitor explicitly opted into light mode.
 * Persisted so a returning visitor's choice sticks.
 *
 * The `data-theme` attribute is the source of truth, not React state: a
 * blocking script in the layout applies the stored preference before first
 * paint, so a light-mode visitor never sees a dark flash. This hook reads that
 * attribute rather than re-deriving it, which is also why it uses
 * `useSyncExternalStore` — reading localStorage into state from an effect
 * would render the wrong theme first and then correct it.
 */

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((registered) => registered !== listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/** The server always renders the default; the client corrects it on hydration. */
function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";

    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage — the toggle still works for this visit.
    }

    emit();
  }, []);

  return { theme, toggle };
}
