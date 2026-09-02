# Engineering Record

The public site: career evidence and technical notes for a backend and
architecture reference. Built with Next.js (App Router) and TypeScript.

**Source of truth:** this repo has no career content of its own. Everything in
`src/data/content.ts` is generated from the private
[`knowledge-base-v2`](../knowledge-base-v2) repo — never hand-edit that file.

## Architecture

```
knowledge-base-v2 (private)          engineering-record (this repo, public)
  profile/                             src/domain/types.ts        — framework-agnostic interfaces
  companies/       --generate-->       src/data/content.ts        — GENERATED, do not edit
  case-studies/     content.mjs        src/repositories/          — the only layer that imports data/content.ts
  notes/                               src/components/            — presentation only, typed props in
                                        src/app/                   — routes, composed from components
```

Every component reads content through `src/repositories/content-repository.ts`,
never straight from `src/data/content.ts` — that keeps the data source swappable
and the components free of any knowledge of the generator's shape.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Regenerating content

Whenever `knowledge-base-v2` changes, regenerate `src/data/content.ts` from it:

```bash
cd ../knowledge-base-v2
pnpm generate -- ../engineering-record/src/data/content.ts
```

(This will later become a CI step triggered from `knowledge-base-v2`, the way
the reference implementation's `sync-portfolio.yml` does — see that repo's
`docs/repository-architecture.md`.)

## Design tokens

Dark is the default appearance (not just an OS-preference fallback) — see the
`:root` / `:root[data-theme="light"]` split in `src/app/globals.css`. Accent
color is blue; fonts are Newsreader (display), Work Sans (body), and Fragment
Mono (labels/data), self-hosted via `next/font/google`.
