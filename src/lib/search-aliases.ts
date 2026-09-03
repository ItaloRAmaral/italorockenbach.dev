/**
 * Curated vocabulary bridges.
 *
 * The search matches words, not meanings, so it only finds what a visitor
 * happens to phrase the way the record does. That gap is not evenly
 * distributed: recruiters and engineers arrive with abbreviations and
 * category words ("k8s", "IaC", "observability") while the record uses the
 * specific artefact ("Kubernetes", "Terraform", "Grafana").
 *
 * Each entry maps a word someone might type to the distinctive words the
 * record actually uses. Alternatives must be specific enough to stand alone —
 * mapping a term to a common word like "code" would match everything and
 * signal nothing.
 *
 * Rules for adding: only add a bridge for a word that is genuinely absent from
 * the content, and only point it at terms that are genuinely present.
 */
export const ALIASES: Record<string, string[]> = {
  // Infrastructure and platform
  k8s: ["kubernetes", "gke"],
  kube: ["kubernetes"],
  iac: ["terraform", "infrastructure"],
  devops: ["kubernetes", "terraform", "pipeline", "infrastructure"],
  sre: ["reliability", "observability", "incident", "slo"],
  cloud: ["gke", "kubernetes", "bigquery"],
  container: ["docker", "image"],
  containers: ["docker", "image"],

  // Data
  db: ["postgresql", "database"],
  sql: ["postgresql", "bigquery", "query"],
  postgres: ["postgresql"],
  warehouse: ["bigquery", "analytical"],
  etl: ["bigquery", "pipeline", "backfill"],
  streaming: ["kafka", "flink", "topic"],
  messaging: ["kafka", "topic", "broker"],
  queue: ["kafka", "outbox", "topic"],
  broker: ["kafka"],

  // Practice
  observability: ["grafana", "alert", "slo", "monitoring"],
  monitoring: ["grafana", "alert", "slo"],
  testing: ["tests", "coverage"],
  qa: ["tests", "coverage"],
  security: ["cve", "trivy", "vulnerability", "hardening"],
  vulnerabilities: ["cve", "trivy"],
  performance: ["latency", "timeout", "optimization", "throughput"],
  scalability: ["partitions", "scaling", "throughput"],
  architecture: ["adr", "decision", "modular"],
  adr: ["decision", "architecture"],
  microservice: ["microservices", "monolith"],
  oncall: ["incident", "outage", "pager"],

  // Background
  education: ["degree", "university", "certificate", "postgraduate", "academic"],
  certification: ["certificate", "postgraduate"],
  certifications: ["certificate", "postgraduate"],
  school: ["university", "degree"],
  college: ["university", "degree"],
  graduation: ["degree", "bachelor"],

  // Availability
  relocation: ["remote", "florianópolis", "brazil"],
  location: ["remote", "florianópolis", "brazil"],
  hiring: ["remote", "available", "roles"],
};

export interface TermGroup {
  /** What the visitor typed — used to keep the query legible in debugging. */
  term: string;
  /** The typed term plus its bridges; matching any of them counts as a match. */
  alternatives: string[];
}

export function expandTerms(terms: string[]): TermGroup[] {
  return terms.map((term) => {
    const bridges = ALIASES[term] ?? [];
    return { term, alternatives: [term, ...bridges] };
  });
}
