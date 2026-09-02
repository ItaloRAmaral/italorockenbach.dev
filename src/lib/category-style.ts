/**
 * Maps a case study's `category` to a display label and a CSS variable name
 * (defined in globals.css) — kept out of components so the mapping has one
 * place to change as categories are added.
 */
const CATEGORY_STYLE: Record<string, { label: string; token: string }> = {
  architecture: { label: "Architecture", token: "--tag-arch" },
  greenfield: { label: "Greenfield", token: "--tag-dist" },
  incident: { label: "Incident Response", token: "--tag-inc" },
  "distributed-systems": { label: "Distributed Systems", token: "--tag-distsys" },
  security: { label: "Security", token: "--tag-note" },
};

const FALLBACK = { label: "Case Study", token: "--tag-arch" };

export function categoryStyle(category: string) {
  return CATEGORY_STYLE[category] ?? FALLBACK;
}
