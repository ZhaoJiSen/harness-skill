# AGENTS.md

> Active session rules — the canonical touchpoint AI coding agents read first.
> Keep this file under ~300 lines, imperative, and operational. It is an **index**: deep detail
> (module map, API contracts, config, data model) lives in `.agents/reference/` — link to it
> rather than inlining it here. Reference the README for humans; this file is for agents.
>
> `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` are symlinks to this file — edit `AGENTS.md`, not
> them. (On Windows they may be one-line shim files instead of symlinks.)
>
> TODO markers used across these files: `TODO(add)` = genuinely missing, should be built ·
> `TODO(verify)` = auto-derived, confirm against code · `TODO(detect)` = could not determine,
> investigate · `TODO(confirm)` = product intent, ask a human.

## Project Overview

- **Purpose:** TODO(confirm): one or two sentences on what this project does and for whom.
- **Type:** TODO(verify): web app / API service / CLI / library / mobile / monorepo
- **Tech stack:**
  - Frontend: TODO(verify): framework + language (or "none")
  - Backend: TODO(verify): language + framework (or "none")
  - Data / infra: TODO(verify): database, cache, queue, deployment target
- **Architecture:** TODO(verify): one paragraph on the high-level shape. Full module map,
  responsibilities, and feature map live in
  [`.agents/reference/architecture.md`](.agents/reference/architecture.md).
- **Directory structure:**
  ```
  TODO(verify): annotate the key top-level directories, e.g.
  src/          application code
  tests/        test suites
  scripts/      build & tooling
  ```
- **Key dependencies:** TODO(verify): the few libraries an agent must not swap out or must use correctly.
- **Deep reference (emit only the ones that apply):**
  - [`.agents/reference/architecture.md`](.agents/reference/architecture.md) — module & feature map
  - [`.agents/reference/api-contracts.md`](.agents/reference/api-contracts.md) — API invariants
  - [`.agents/reference/config.md`](.agents/reference/config.md) — configuration fields
  - [`.agents/reference/data-model.md`](.agents/reference/data-model.md) — data model / schema

## Build, Test & Push Instructions

Run the **exact** commands below. Do not paraphrase them.

- **Install:** `TODO(detect): e.g. pnpm install`
- **Build:** `TODO(detect): e.g. pnpm build`
- **Run/dev:** `TODO(detect): e.g. pnpm dev`
- **Test (unit/component):** `TODO(detect): e.g. pnpm test` — run the full suite before considering work done.
  - Frontend runner: TODO(detect): **Vitest** if this is a Vite project, otherwise **Jest** (or the
    framework's canonical runner). Do not mix the two.
  - Backend: TODO(detect): each backend language's idiomatic runner (pytest / JUnit / `go test` /
    `cargo test` / Vitest|Jest for Node …).
- **E2E tests:** `TODO(detect): e.g. npx playwright test` — **Playwright** specs live in TODO(detect): `e2e/`.
- **Typecheck:** `TODO(detect): e.g. tsc --noEmit / mypy / go vet` — no new type errors; do not silence
  them with `any` / `@ts-ignore` / `# type: ignore` without a written reason.
- **Lint:** `TODO(detect): e.g. pnpm lint`
- **Format:** `TODO(detect): e.g. pnpm format`
- **CI:** TODO(detect): what the CI pipeline runs, so local checks match CI.
- **Pre-push checks:** TODO(detect): what must pass before pushing — at minimum lint + typecheck + the
  full unit suite green, plus relevant Playwright E2E specs, plus the regression baseline in
  [`.agents/rules/testing.md`](.agents/rules/testing.md).

### Definition of Done

Work is complete only when **all** of the following pass:

- [ ] Build succeeds
- [ ] Lint passes
- [ ] Typecheck passes (no new errors, no unexplained suppressions)
- [ ] Full unit/component suite green
- [ ] Relevant E2E (Playwright) specs green
- [ ] No secrets committed

## Development Workflow

- **Naming:** TODO(verify): naming conventions for files, symbols, branches.
- **Logging & observability:** TODO(verify): logging approach and levels; metrics/tracing if any;
  and log redaction rules for secrets/PII (see
  [`.agents/reference/data-model.md`](.agents/reference/data-model.md)).
- **Security:** validate untrusted input, never hardcode secrets, use parameterized queries.
  TODO(verify): project-specific security constraints.
- **Configuration:** runtime config fields and their gotchas are in
  [`.agents/reference/config.md`](.agents/reference/config.md).
- **Deployment:** TODO(verify): deploy target and where the runbook / `deploy/` steps live.
- **Architectural constraints:** TODO(verify): boundaries agents must respect (e.g. no cross-module
  imports, keep domain logic out of controllers).
- For the full team baseline, see [`.agents/AGENTS.md`](.agents/AGENTS.md) and the split rules in
  [`.agents/rules/`](.agents/rules/) (style, security, testing).

## Common Pitfalls & Prohibited Patterns

- TODO(verify): anti-patterns specific to this codebase.
- TODO(verify): deprecated APIs / files that look usable but must not be used.
- TODO(confirm): public APIs or contracts that must not change without explicit sign-off — the
  invariants are catalogued in
  [`.agents/reference/api-contracts.md`](.agents/reference/api-contracts.md).
- TODO(verify): common wrong assumptions agents make here.
