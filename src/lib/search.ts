/**
 * Querying half of the site's retrieval: pure functions over an index, with no
 * dependency on the content itself.
 *
 * The split is deliberate and load-bearing. `search-index.ts` imports every
 * case study's body text; if this module imported it too, the components that
 * only need `search()` or `highlight()` would drag that payload into the
 * bundle of every page. Keeping the data behind a separate module is what lets
 * the index arrive only when someone actually searches.
 *
 * Retrieval over the record's own words.
 *
 * The site answers questions by finding the passage that already answers them,
 * quoting it, and linking to its source — rather than by generating prose. That
 * is a deliberate constraint, not a limitation to apologise for: a system that
 * can only surface what was actually written cannot overstate the record it
 * describes.
 *
 * The index covers full body text, not just titles and summaries, so a question
 * whose answer lives three paragraphs into a case study still finds it.
 */

import { expandTerms } from "./search-aliases";
import type { TermGroup } from "./search-aliases";

export type ResultKind =
  | "case"
  | "note"
  | "company"
  | "capability"
  | "technology"
  | "principle"
  | "education"
  | "page";

export interface Passage {
  /** The sentence-or-paragraph that will be quoted back. */
  text: string;
  /** Section heading it came from, for attribution ("How I approached it"). */
  section?: string;
}

export interface SearchDoc {
  kind: ResultKind;
  title: string;
  sub: string;
  href: string;
  /** Short, high-signal text: title, summary, tags. Weighted heavily. */
  head: string;
  passages: Passage[];
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  /** Best-matching passage, when the body (rather than the title) matched. */
  passage?: Passage;
  /** Query terms that actually matched, for highlighting. */
  matched: string[];
}

const KIND_LABEL: Record<ResultKind, string> = {
  case: "Case study",
  note: "Note",
  company: "Company",
  capability: "Capability",
  technology: "Technology",
  principle: "Principle",
  education: "Education",
  page: "Page",
};

export function kindLabel(kind: ResultKind): string {
  return KIND_LABEL[kind];
}

/**
 * Words carried by the question rather than by its subject. Dropping them is
 * what lets "how does he handle production incidents?" behave like the query
 * "handle production incidents" without any language understanding.
 */
const STOP_WORDS = new Set([
  "a", "about", "an", "and", "any", "anything", "are", "as", "at", "be", "been",
  "by", "can", "could", "did", "do", "does", "doing", "done", "for", "from", "get",
  "give", "had", "has", "have", "he", "her", "him", "his", "how", "i", "in", "into",
  "is", "it", "its", "know", "like", "make", "me", "much", "my", "of", "on", "one",
  "or",
  "should", "so", "some", "something", "tell", "than", "that", "the", "their", "them",
  "then", "there", "these", "they", "this", "those", "to", "up", "us", "use", "used",
  "was", "we", "were", "what", "when", "where", "which", "who", "why", "will", "with",
  "would", "you", "your",
]);

/**
 * Lowercase, fold accents, split on anything that isn't a letter or digit.
 *
 * Folding matters for more than tidiness: the record says "Florianópolis" and
 * every recruiter types "florianopolis".
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#.]+/)
    .map((token) => token.replace(/^\.+|\.+$/g, ""))
    .filter((token) => token.length > 1);
}

function queryTerms(query: string): string[] {
  const all = tokenize(query);
  const meaningful = all.filter((token) => !STOP_WORDS.has(token));
  // A query made entirely of stop words ("how do you do it") still deserves an
  // attempt rather than an empty result.
  return meaningful.length > 0 ? meaningful : all;
}

/** A term matches a word that starts with it, so "migrat" finds "migration". */
function termHits(term: string, tokens: string[]): number {
  let count = 0;
  for (const token of tokens) {
    if (token === term || token.startsWith(term)) count += 1;
  }
  return count;
}

/** Total hits for a group, counting any of its equivalent spellings. */
function groupHits(group: TermGroup, tokens: string[]): { hits: number; matched: string[] } {
  let hits = 0;
  const matched: string[] = [];

  for (const alternative of group.alternatives) {
    const count = termHits(alternative, tokens);
    if (count > 0) {
      hits += count;
      matched.push(alternative);
    }
  }

  return { hits, matched };
}

/**
 * How much one matching term is worth. A term appearing in almost every
 * document ("production", "service") says nearly nothing about which document
 * answers the question; a rare one ("kafka", "outbox") says almost everything.
 *
 * Without this, "does he write tests?" ranks a citation containing the phrase
 * "dual write problem" above anything about testing, because the common word
 * matched more often than the rare one.
 *
 * A group is weighted by how many documents contain *any* of its spellings, so
 * bridging "k8s" to "kubernetes" inherits Kubernetes's rarity rather than the
 * rarity of a word the record never uses.
 */
function inverseDocumentFrequency(index: SearchDoc[]): (group: TermGroup) => number {
  const docTokens = index.map(
    (doc) => new Set([...tokenize(doc.head), ...doc.passages.flatMap((passage) => tokenize(passage.text))]),
  );
  const cache = new Map<string, number>();

  return (group: TermGroup) => {
    const key = group.alternatives.join("|");
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    let containing = 0;
    for (const tokens of docTokens) {
      let found = false;
      for (const token of tokens) {
        if (group.alternatives.some((alt) => token === alt || token.startsWith(alt))) {
          found = true;
          break;
        }
      }
      if (found) containing += 1;
    }

    const idfValue = Math.log(1 + index.length / (1 + containing));
    cache.set(key, idfValue);
    return idfValue;
  };
}

/** True when the query's groups appear adjacent, in order, inside the tokens.
 *  "infrastructure as code" as a phrase means more than the words apart. */
function containsPhrase(groups: TermGroup[], tokens: string[]): boolean {
  if (groups.length < 2) return false;

  for (let start = 0; start + groups.length <= tokens.length; start += 1) {
    let all = true;
    for (let offset = 0; offset < groups.length; offset += 1) {
      const token = tokens[start + offset];
      if (!groups[offset].alternatives.some((alt) => token === alt || token.startsWith(alt))) {
        all = false;
        break;
      }
    }
    if (all) return true;
  }

  return false;
}

/** Whether any document uses any spelling of this group at all. */
function indexContains(index: SearchDoc[], group: TermGroup): boolean {
  return index.some(
    (doc) =>
      groupHits(group, tokenize(doc.head)).hits > 0 ||
      doc.passages.some((passage) => groupHits(group, tokenize(passage.text)).hits > 0),
  );
}

let idfFor: ((group: TermGroup) => number) | null = null;
let idfSource: SearchDoc[] | null = null;

function idf(index: SearchDoc[]): (group: TermGroup) => number {
  if (idfSource !== index || !idfFor) {
    idfSource = index;
    idfFor = inverseDocumentFrequency(index);
  }
  return idfFor;
}

const TITLE_WEIGHT = 10;
const HEAD_WEIGHT = 4;
const BODY_WEIGHT = 1;
/** Covering another of the question's terms beats matching one term again. */
const COVERAGE_WEIGHT = 12;

/**
 * Citation lists answer nothing — they are other people's titles. Indexed so
 * the pages stay complete, but never quoted back as though they were an answer.
 */
const NON_ANSWERING_SECTIONS = new Set(["Further reading"]);

/**
 * How much of the question's meaning a result must actually cover to be shown.
 * Below this the honest answer is "that isn't documented here", not a passage
 * that happens to share a common word with the question.
 */
const RELEVANCE_FLOOR = 0.4;

/** Multiplier applied when the whole question appears as a contiguous phrase. */
const PHRASE_BONUS = 2.5;

/**
 * When most of a question's distinctive weight sits in words the record has
 * never used — in any of their bridged spellings — the record does not answer
 * that question, and saying so is the point. "Does he know Rust?" must return
 * nothing rather than the passage that happens to share the word "know".
 */
const UNKNOWN_QUESTION_THRESHOLD = 0.5;

export function search(query: string, index: SearchDoc[], limit = 8): SearchHit[] {
  const groups = expandTerms(queryTerms(query));
  if (groups.length === 0) return [];

  const weight = idf(index);
  const totalWeight = groups.reduce((sum, group) => sum + weight(group), 0);
  if (totalWeight === 0) return [];

  const absentWeight = groups
    .filter((group) => !indexContains(index, group))
    .reduce((sum, group) => sum + weight(group), 0);
  if (absentWeight / totalWeight > UNKNOWN_QUESTION_THRESHOLD) return [];

  const hits: SearchHit[] = [];

  for (const doc of index) {
    const headTokens = tokenize(doc.head);
    const titleTokens = tokenize(doc.title);

    let titleScore = 0;
    let headScore = 0;
    let bodyScore = 0;
    let coveredWeight = 0;
    const covered = new Set<string>();
    const matchedWords = new Set<string>();

    const cover = (group: TermGroup, words: string[]) => {
      for (const word of words) matchedWords.add(word);
      if (covered.has(group.term)) return;
      covered.add(group.term);
      coveredWeight += weight(group);
    };

    for (const group of groups) {
      const w = weight(group);
      const inTitle = groupHits(group, titleTokens);
      const inHead = groupHits(group, headTokens);
      titleScore += inTitle.hits * w;
      headScore += inHead.hits * w;
      if (inTitle.hits > 0 || inHead.hits > 0) cover(group, [...inTitle.matched, ...inHead.matched]);
    }

    let bestPassage: Passage | undefined;
    let bestPassageScore = 0;

    for (const passage of doc.passages) {
      const tokens = tokenize(passage.text);
      let passageWeight = 0;
      let distinct = 0;

      for (const group of groups) {
        const match = groupHits(group, tokens);
        if (match.hits === 0) continue;
        distinct += 1;
        passageWeight += match.hits * weight(group);
        cover(group, match.matched);
      }

      if (distinct === 0) continue;
      bodyScore += passageWeight;

      if (passage.section && NON_ANSWERING_SECTIONS.has(passage.section)) continue;

      // Prefer the passage that answers more of the question; break ties toward
      // the denser one, so a short direct sentence beats a long rambling match.
      const phrase = containsPhrase(groups, tokens) ? PHRASE_BONUS : 1;
      const candidate = (distinct * 100 + (passageWeight / Math.sqrt(tokens.length)) * 10) * phrase;
      if (candidate > bestPassageScore) {
        bestPassageScore = candidate;
        bestPassage = passage;
      }
    }

    if (coveredWeight / totalWeight < RELEVANCE_FLOOR) continue;

    const phraseInHead = containsPhrase(groups, headTokens) ? PHRASE_BONUS : 1;
    const score =
      (titleScore * TITLE_WEIGHT +
        headScore * HEAD_WEIGHT +
        bodyScore * BODY_WEIGHT +
        coveredWeight * COVERAGE_WEIGHT) *
      phraseInHead;

    if (score === 0) continue;

    hits.push({
      doc,
      score,
      // A result with no matching passage still needs something to show; its
      // own opening line is the honest fallback.
      passage: bestPassage ?? doc.passages[0],
      // The words that actually matched, not the words typed — so a search for
      // "k8s" highlights "Kubernetes" in the passage it found.
      matched: [...matchedWords],
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function highlight(text: string, terms: string[]): Array<{ text: string; hit: boolean }> {
  if (terms.length === 0) return [{ text, hit: false }];

  const escaped = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  const pattern = new RegExp(`\\b(${escaped})\\w*`, "gi");

  const parts: Array<{ text: string; hit: boolean }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push({ text: text.slice(lastIndex, start), hit: false });
    parts.push({ text: match[0], hit: true });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), hit: false });

  return parts;
}
