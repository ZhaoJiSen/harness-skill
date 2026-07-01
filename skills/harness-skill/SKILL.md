---
name: harness-skill
description: Scaffold AGENTS.md-standard files (the Harness agent-native repo spec) into a project. Use when the user wants to initialize, generate, or set up AGENTS.md, agent rules, a .agents directory, llms.txt, or project conventions for AI coding agents. Handles empty projects (asks about the tech stack interactively) and existing projects (auto-detects the stack from code and config).
---

# harness-skill

Generate a complete, spec-compliant set of AGENTS.md files for a project, following the
public AGENTS.md hierarchical configuration standard as promoted by Harness. Read
`reference/harness-spec.md` in this skill directory whenever you need the full spec details;
do not inline the whole spec into your reasoning.

The end state for a project root is:

```
<project root>/
├── AGENTS.md        # active session rules (the canonical touchpoint), 4 core sections
├── .agents/
│   ├── AGENTS.md    # committed team base conventions — an index into rules/
│   ├── rules/
│   │   ├── style.md     # code style, types, error handling, deps, commits, docs
│   │   ├── security.md  # security baseline
│   │   └── testing.md   # mandatory testing policy
│   ├── commands/    # project-scoped agent commands (README placeholder)
│   └── skills/      # project-scoped agent skills (README placeholder)
├── llms.txt         # project PRD: goals, architecture, tech stack, scope
├── CLAUDE.md    -> AGENTS.md   (symlink)
├── GEMINI.md    -> AGENTS.md   (symlink)
└── .cursorrules -> AGENTS.md   (symlink)
```

## Step 1 — Detect project state

Determine the target directory (default: the current working directory; confirm with the
user if ambiguous). Then decide **empty** vs **existing**:

- Look for source files and dependency manifests: `package.json`, `pom.xml`, `build.gradle`,
  `go.mod`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `composer.json`,
  `*.csproj`, etc.
- If none are found and there is little or no source code → treat as **empty** → go to Step 2A.
- Otherwise → treat as **existing** → go to Step 2B.

Also check whether `AGENTS.md`, `.agents/`, or `llms.txt` already exist. If any do, do **not**
overwrite silently — see Step 4.

## Step 2A — Empty project: interactive intake

Ask the user for the details you need to fill the templates. Use the AskUserQuestion tool
(batch related questions). Cover:

- **Project type** — web app / API service / CLI / library / mobile / monorepo / other
- **Frontend stack** — framework + language (e.g. React + TypeScript, Vue, none)
- **Backend stack** — language + framework (e.g. Node + Express, Java + Spring, Go, Python + FastAPI, none)
- **Package manager / build tool** — npm/pnpm/yarn, Maven/Gradle, go, uv/poetry, cargo…
- **Test framework** — if the user has a preference; otherwise apply the mandatory testing
  policy in Step 3.5 rather than asking.
- **Anything critical to know upfront** — deployment target, key constraints (optional)

Where the user does not know a value, leave a clearly-marked `TODO:` placeholder in the
generated files rather than guessing.

## Step 2B — Existing project: auto-detect

Read the manifests and skim the directory structure to infer:

- Languages, frameworks, and key dependencies
- Build / test / lint commands (from `scripts` in package.json, Makefile targets, CI config,
  Maven/Gradle tasks, etc.) — capture the **exact** commands, not "run tests"
- **Testing setup** — which frontend build tool is in use (is it Vite? check for `vite.config.*`
  or `vite` in devDependencies), what unit/component test runner exists, whether Playwright (or
  another E2E tool) is wired up, and whether backend packages actually contain test files.
  Feed all of this into Step 3.5.
- Directory layout and key components
- **Modules & functionality** — do not stop at the tech stack. Read the source (not just
  manifests) to build a functional map of the project:
  - Enumerate the top-level modules / packages / services and summarize what each is responsible
    for; identify entry points, routes/APIs, and core domain concepts.
  - Derive the product's **feature list** by reading routes, API handlers, CLI commands, UI
    pages/screens, and jobs — i.e. answer "what does this project actually do".
  - This feeds `AGENTS.md` Project Overview (architecture, directory structure, key components)
    and `llms.txt` Architecture (functional description).
- Any existing conventions (linter config, formatter, commit style)

For a large or unfamiliar codebase, delegate this analysis to an exploration subagent (broad,
read-only sweep) and work from its summary, rather than skimming the tree yourself in the main
flow — that keeps the map complete without missing modules.

Only ask the user for things you genuinely cannot infer. Prefer detection over questions here —
**except product intent**: `llms.txt` Goals (the *why* / business purpose) usually cannot be
read from code. Draft it from the feature map, then ask the user to confirm or correct it rather
than guessing or leaving it blank.

## Step 3 — Generate the files

Use the templates in `templates/` as the base and fill them in from Step 2. Keep the root
`AGENTS.md` under ~300 lines, imperative, and operational.

1. **`AGENTS.md`** (project root) — from `templates/root-AGENTS.md`. Four core sections:
   - Project Overview (purpose, architecture, directory structure, tech stack, key deps)
   - Build, Test & Push Instructions (exact commands, linter/formatter, pre-push checks)
   - Development Workflow (naming, logging, security, architectural constraints; link out to
     `.agents/AGENTS.md` rather than bloating this file)
   - Common Pitfalls & Prohibited Patterns (anti-patterns, deprecated APIs, frozen public APIs)

2. **`.agents/` directory** — the committed, stable team base, copied from `templates/agents/`
   and split by concern so each file stays focused:
   - `.agents/AGENTS.md` — a short index that links to the rule files and states the
     non-negotiables. Do not cram all conventions in here; it points into `rules/`.
   - `.agents/rules/style.md` — per-language code style, types/static-analysis gate, error
     handling, comments, dependency policy, commit/branch format, documentation.
   - `.agents/rules/security.md` — the security baseline (secrets, input validation,
     parameterized queries, dependency pinning).
   - `.agents/rules/testing.md` — the mandatory testing policy (see Step 3.5).
   - `.agents/commands/` and `.agents/skills/` — extension directories, each seeded with a
     README placeholder explaining what belongs there. Leave the README unless the project
     already has commands/skills to put in them.

3. **`llms.txt`** (project root) — from `templates/llms.txt`. The project PRD: goals,
   high-level architecture, tech stack, scope / non-goals.

4. **Symlinks** — after `AGENTS.md` exists, create symlinks pointing to it so other tools pick
   up the same source of truth:
   ```
   ln -s AGENTS.md CLAUDE.md
   ln -s AGENTS.md GEMINI.md
   ln -s AGENTS.md .cursorrules
   ```
   Create each only if a file/symlink of that name does not already exist. Use relative link
   targets (as above) so the links survive the repo being moved or cloned. On Windows, note
   that symlinks may need Developer Mode; if creation fails, fall back to a one-line shim file
   that says to read `AGENTS.md`, and tell the user.

## Step 3.5 — Mandatory testing policy

Every generated project must document and enforce automated tests. Bake the following into the
root `AGENTS.md` **Build, Test & Push Instructions** and into `.agents/rules/testing.md`. Pick
the concrete tools from the detected/declared stack — do not leave the *choice* as a `TODO:`, only
leave `TODO:` for values you genuinely cannot know (e.g. an exact custom script name).

**Frontend unit / component tests — required when a frontend stack exists:**

- If the frontend build tool is **Vite** (a `vite.config.*` exists, or `vite` is a dependency)
  → use **Vitest** (https://vitest.dev). It shares Vite's config and transform pipeline, so it
  is the correct default there.
- If the frontend is **not** Vite (Create React App, Next.js, Webpack, Angular CLI, plain
  bundler, etc.) → use **Jest** (or the framework's built-in test runner where one is canonical,
  e.g. Angular's Jasmine/Karma). Do not force Vitest onto a non-Vite toolchain.
- Pair the runner with the framework's component-testing library (React Testing Library,
  Vue Test Utils, etc.) when a UI framework is present.

**End-to-end / browser tests — required for any web app or site with a UI:**

- Use **Playwright** (https://playwright.dev) as the E2E framework. Document the install/run
  commands (`npm init playwright@latest`, `npx playwright test`) and where specs live
  (`e2e/` or `tests/e2e/`).

**Backend tests — required for every backend language present:**

- Each backend language/service must ship with test files using its idiomatic framework, and the
  AGENTS.md must say so explicitly. Map the detected language to its standard tool:
  - Node / TypeScript → Vitest or Jest (match the frontend choice where it's one repo)
  - Python → pytest
  - Java → JUnit
  - Go → the built-in `go test` (`*_test.go`)
  - Rust → the built-in `#[test]` / `cargo test`
  - Ruby → RSpec / Minitest; PHP → PHPUnit; C#/.NET → xUnit/NUnit
- State the expectation that new backend code lands with matching test files and that test files
  are validated (they must exist and pass) before work is considered done.

**Enforcement wording (put this in every generated `AGENTS.md`):** new features and bug fixes
ship with tests; do not mark work done while tests fail; run the full unit suite plus relevant
E2E specs as part of pre-push checks.

## Step 3.6 — Mandatory engineering constraints

These apply to **every** project regardless of stack. Fill them into the generated files
(concrete commands from the detected stack; only leave `TODO:` for values you truly cannot know).

**Dependency changes:** before adding a new runtime dependency, prefer the standard library or
an already-present dependency; adding a new one requires an explicit reason in the change. Pin
exact/locked versions and flag unusual or typosquatting-looking names. (This lives in
`.agents/rules/style.md`.)

**Type checking / static analysis as a first-class gate:** capture the exact typecheck command
(e.g. `tsc --noEmit`, `mypy`, `go vet`) and state that work must not introduce new type errors,
and must not silence them with `any` / `@ts-ignore` / `# type: ignore` / equivalent without a
written justification.

**Definition of Done (put a checklist in the root `AGENTS.md`):** work is done only when build
passes, lint passes, typecheck passes, the full unit suite and relevant E2E specs are green, and
no secrets are committed.

## Step 3.7 — Conditional sections (emit only when the stack matches)

Do **not** add these to projects that don't need them — an unused section with dangling `TODO:`s
just bloats the file and dilutes the rules that matter. Add a section only when detection/intake
shows the stack warrants it:

- **Accessibility — only when a web UI is present.** Require semantic HTML and compliance with
  accessibility standards (WCAG AA as a target). Note that Playwright specs can assert a11y.
- **API contract stability — only for an API service.** Backward compatibility, a consistent
  error-response shape, and explicit sign-off for breaking changes / versioning.
- **Database migrations — only when a datastore/migrations tool is present.** Already-applied
  migrations are immutable; changes are additive; every migration ships with a paired rollback.

## Step 4 — Idempotency & safety

- If `AGENTS.md`, `.agents/` (any of `AGENTS.md`, `rules/*`, `commands/`, `skills/`), or
  `llms.txt` already exist, show the user what exists and ask whether to (a) skip, (b)
  merge/update, or (c) overwrite. Never blow away existing agent rules without explicit
  confirmation. When merging into an existing flat `.agents/AGENTS.md`, offer to split its
  contents into the `rules/` files rather than duplicating them.
- For symlinks, skip any name that is already taken and report it.

## Step 5 — Report

Summarize what was created (as a short file tree) and point out any `TODO:` placeholders the
user still needs to fill in. Do not recap file contents line by line.
