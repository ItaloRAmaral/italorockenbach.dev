"use client";

import { useCallback, useRef, useState } from "react";
import { search } from "@/lib/search";
import type { SearchDoc, SearchHit } from "@/lib/search";

/**
 * Loads the search index the first time someone actually searches.
 *
 * The index holds the full body text of every case study and note, so importing
 * it statically would ship that payload to every visitor on every page —
 * including the ones who never open the search. A dynamic import keeps it out
 * of the initial bundle and off the critical path.
 */
export function useSearchIndex() {
  const [ready, setReady] = useState(false);
  const index = useRef<SearchDoc[] | null>(null);
  const loading = useRef<Promise<void> | null>(null);

  const load = useCallback(async () => {
    if (index.current) return;
    if (loading.current) return loading.current;

    loading.current = (async () => {
      const { buildIndex } = await import("@/lib/search-index");
      index.current = buildIndex();
      setReady(true);
    })();

    return loading.current;
  }, []);

  const run = useCallback((query: string, limit?: number): SearchHit[] => {
    if (!index.current) return [];
    return search(query, index.current, limit);
  }, []);

  return { load, run, ready };
}
