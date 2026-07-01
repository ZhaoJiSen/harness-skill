# AGENTS.md

> Active session rules — the canonical touchpoint AI coding agents read first.
> Keep this file under ~300 lines, imperative, and operational. Reference the README for
> humans; this file is for agents.

## Project Overview

- **Purpose:** TODO: one or two sentences on what this project does and for whom.
- **Type:** TODO: web app / API service / CLI / library / mobile / monorepo
- **Tech stack:**
  - Frontend: TODO: framework + language (or "none")
  - Backend: TODO: language + framework (or "none")
  - Data / infra: TODO: database, cache, queue, deployment target
- **Architecture:** TODO: one paragraph on the high-level shape (layers, services, data flow).
- **Directory structure:**
  ```
  TODO: annotate the key top-level directories, e.g.
  src/          application code
  tests/        test suites
  scripts/      build & tooling
  ```
- **Key dependencies:** TODO: the few libraries an agent must not swap out or must use correctly.

## Build, Test & Push Instructions

Run the **exact** commands below. Do not paraphrase them.

- **Install:** `TODO: e.g. pnpm install`
- **Build:** `TODO: e.g. pnpm build`
- **Run/dev:** `TODO: e.g. pnpm dev`
- **Test (unit/component):** `TODO: e.g. pnpm test` — run the full suite before considering work done.
  - Frontend runner: TODO: **Vitest** if this is a Vite project, otherwise **Jest** (or the
    framework's canonical runner). Do not mix the two.
  - Backend: TODO: each backend language's idiomatic runner (pytest / JUnit / `go test` /
    `cargo test` / Vitest|Jest for Node …).
- **E2E tests:** `TODO: e.g. npx playwright test` — **Playwright** specs live in TODO: `e2e/`.
- **Typecheck:** `TODO: e.g. tsc --noEmit / mypy / go vet` — no new type errors; do not silence
  them with `any` / `@ts-ignore` / `# type: ignore` without a written reason.
- **Lint:** `TODO: e.g. pnpm lint`
- **Format:** `TODO: e.g. pnpm format`
- **CI:** TODO: what the CI pipeline runs, so local checks match CI.
- **Pre-push checks:** TODO: what must pass before pushing — at minimum lint + typecheck + the
  full unit suite green, plus relevant Playwright E2E specs.

### Definition of Done

Work is complete only when **all** of the following pass:

- [ ] Build succeeds
- [ ] Lint passes
- [ ] Typecheck passes (no new errors, no unexplained suppressions)
- [ ] Full unit/component suite green
- [ ] Relevant E2E (Playwright) specs green
- [ ] No secrets committed

## Development Workflow

- **Naming:** TODO: naming conventions for files, symbols, branches.
- **Logging:** TODO: logging approach and levels.
- **Security:** validate untrusted input, never hardcode secrets, use parameterized queries.
  TODO: project-specific security constraints.
- **Architectural constraints:** TODO: boundaries agents must respect (e.g. no cross-module
  imports, keep domain logic out of controllers).
- For the full team baseline (style, commit format), see [`.agents/AGENTS.md`](.agents/AGENTS.md).

## Common Pitfalls & Prohibited Patterns

- TODO: anti-patterns specific to this codebase.
- TODO: deprecated APIs / files that look usable but must not be used.
- TODO: public APIs or contracts that must not change without explicit sign-off.
- TODO: common wrong assumptions agents make here.
