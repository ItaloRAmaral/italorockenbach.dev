/** "Kafka Connect" -> "kafka-connect", "Node.js" -> "node-js". Used to build
 *  and, later, to resolve /technologies/[slug] and /capabilities/[slug] links —
 *  kept as a pure function here rather than baked into generated data, since
 *  it's a URL-shape concern of this site, not a fact about the content. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
