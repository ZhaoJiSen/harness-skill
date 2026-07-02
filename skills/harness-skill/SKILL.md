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
├── AGENTS.md        # active session rules (the canonical touchpoint) — an INDEX, 4 core sections
├── .agents/
│   ├── AGENTS.md    # committed team base conventions — an index into rules/ and reference/
│   ├── rules/
│   │   ├── style.md     # code style, types, error handling, deps, commits, docs
│   │   ├── security.md  # security baseline
│   │   └── testing.md   # testing policy + regression coverage
│   ├── reference/   # DEEP detail, emitted only when it applies (keeps AGENTS.md an index)
│   │   ├── architecture.md   # module map, layers, state machines
│   │   ├── routes.md         # full route table, generated from code
│   │   ├── features.md       # feature map (single file) — OR product/ below when it grows
│   │   ├── product/          # one file per domain when there are many features
│   │   │   ├── README.md     #   domain index
│   │   │   └── <domain>.md    #   e.g. auth.md, backup.md — feature points per domain
│   │   ├── api-contracts.md  # envelope, error codes, pagination, SSE, auth invariants
│   │   ├── config.md         # configuration field reference
│   │   └── data-model.md     # datastores, schema, migrations, PII
│   ├── commands/    # project-scoped agent commands (README placeholder)
│   └── skills/      # agent skills for the detected stack, copied in (+ README)
├── llms.txt         # project PRD: goals, architecture, tech stack, scope
├── CLAUDE.md    -> AGENTS.md   (symlink)
├── GEMINI.md    -> AGENTS.md   (symlink)
└── .cursorrules -> AGENTS.md   (symlink)
```

The root `AGENTS.md` is an **index**: keep it under ~300 lines and push depth (module map, API
contracts, config, data model) into `.agents/reference/*`, which it links to. Emit a reference
file only when the project actually has that substance — do not ship empty deep docs.

## Step 1 — Detect project state

**Fix the target directory first — do not rely on the current working directory by luck.** Run
`git rev-parse --show-toplevel` and compare it to the CWD:

- If the CWD **is** the git root → that is the target root.
- If the CWD is a **subdirectory** of the git root (e.g. you were invoked in `web/` of a
  monorepo) → do **not** silently scaffold in the subdir. Ask the user whether the scope is the
  **whole repository** (scaffold at the git root) or **just this subproject** (scaffold here, as a
  nested layer). This mismatch is common and must be resolved explicitly, not guessed.
- If there is no git repo → default to the CWD, and confirm with the user if the directory looks
  ambiguous (e.g. a home dir or a parent of several projects).

Then decide **empty** vs **existing**:

- Look for source files and dependency manifests: `package.json`, `pom.xml`, `build.gradle`,
  `go.mod`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `composer.json`,
  `*.csproj`, etc.
- If none are found and there is little or no source code → treat as **empty** → go to Step 2A.
- Otherwise → treat as **existing** → go to Step 2B.

Also check whether `AGENTS.md`, `.agents/`, or `llms.txt` already exist. If any do, do **not**
overwrite silently — see Step 4.

## Step 1.5 — Choose the output language

The bundled templates are written in English, but the generated docs should be in whatever
language the team reads. Decide this **before** generating anything (it applies to both the empty
and existing paths):

- Ask the user which language the generated files should be written in, using the AskUserQuestion
  tool. Offer the language they are conversing in as the recommended default (e.g. if they are
  writing to you in Chinese, default to 中文), plus English, plus "other".
- If an existing project already has docs in an obvious language (e.g. a Chinese `README`), you
  may propose that as the default — but still confirm rather than assume.
- Write **all generated prose** — section bodies, and headings too — in the chosen language,
  translating the template text as you fill it in rather than copying the English verbatim.
- Keep these **unchanged** regardless of language, so tooling and cross-references keep working:
  code, commands, and file paths; the file names themselves (`AGENTS.md`, `llms.txt`, etc.); and
  the `TODO(add|verify|detect|confirm)` marker keywords (translate the explanation after the
  marker, not the marker itself).

## Step 2A — Empty project: interactive intake

Ask the user for the details you need to fill the templates. Use the AskUserQuestion tool
(batch related questions — include the Step 1.5 output-language question in the same batch). Cover:

- **Project type** — web app / API service / CLI / library / mobile / monorepo / other
- **Frontend stack** — framework + language (e.g. React + TypeScript, Vue, none)
- **Backend stack** — language + framework (e.g. Node + Express, Java + Spring, Go, Python + FastAPI, none)
- **Package manager / build tool** — npm/pnpm/yarn, Maven/Gradle, go, uv/poetry, cargo…
- **Test framework** — if the user has a preference; otherwise apply the mandatory testing
  policy in Step 3.5 rather than asking.
- **Anything critical to know upfront** — deployment target, key constraints (optional)

Where the user does not know a value, leave a marked placeholder (`TODO(confirm)` for intent,
`TODO(add)` for something they'll need to set up) rather than guessing — see Step 2.5.

## Step 2B — Existing project: auto-detect

Detection must go past manifests into the source. Cover each layer below; record findings with
the marker vocabulary from **Step 2.5**. Anything you cannot determine becomes `TODO(detect)`,
never a silent omission.

**Stack & commands (baseline):**

- Languages, frameworks, and key dependencies (from manifests + lockfiles).
- Build / test / lint / typecheck commands — the **exact** commands (from `scripts`, Makefile,
  CI config, Maven/Gradle tasks), not "run tests".
- Testing setup: is the frontend on Vite (`vite.config.*` / `vite` dep)? what unit runner exists?
  is Playwright (or another E2E tool) wired up? do backend packages actually contain test files?
  Feed this into Step 3.5.

**Functional map — extract from code, down to individual feature points (critique: the map came
out as one line per domain — a route listing — instead of the actual features).** For each
top-level module/package/service capture responsibility, entry point, key types, and who it talks
to (→ `reference/architecture.md`). Then go a level deeper and enumerate the **feature points**,
not just the domains (→ `reference/features.md` or `reference/product/`). Use language-specific
extraction:

- **Routes/APIs:** find the router definition and enumerate the **full** route table — e.g. gin/echo
  (a `RouterGroup` tree, often in a `v1.go`/`router.go`), Express/Fastify route registration,
  FastAPI `@app.*` decorators, Spring `@RequestMapping`, Rails `routes.rb`. Point at the real file.
  This full table is its own doc, `reference/routes.md` — do not bury routes inside architecture.
- **CLI:** the command tree (cobra/clap/commander/argparse subcommands).
- **UI:** page/screen/route map (file-based routes, router config).
- **Jobs/async:** cron/queue/worker registrations, SSE/websocket handlers.

For every **feature point** (not every domain) capture:

- **Name** — from the user/operator's view, not the function name.
- **What it does** — 1–2 sentences of observable behavior/intent.
- **Entry points** — the route(s) (`method path`), backend handler (`file:symbol`), frontend
  page/component (if any), CLI command (if any).
- **Status** — enabled / **disabled (commented-out / behind a feature flag)** / planned. Commented
  routes and pages must be flagged as *disabled*, never silently ignored as dead code.
- **Data source** — where you read it from (routes/handlers, file-based UI routes, CLI tree,
  cron/queue/SSE).

Break each domain down: a "backup" domain is not one line but many feature points (tag-scoped
config, global config, keys, SFTP test, chunked-upload resume, record list/detail/download, run,
restore, upload-restore, SFTP sync — each with its own "what it does"). Feature-point descriptions
are **intent-level and relatively stable**, so hand-written/derived content marked `TODO(verify)`
is acceptable here — this does not violate the anti-rot rule, which targets volatile derived tables
(field/route lists), not intent prose.

**Interface contracts — locate the source of truth, and record where auto-derivation breaks
(critique: no contract layer; models assumed typed).**

- Find the contract source: OpenAPI/swagger file, `resp`/`dto`/`model` packages, proto files.
- Determine whether request/response shapes are **named types** or **inline** (e.g. `gin.H{}`,
  anonymous dicts). If inline/untyped or the model package is largely empty, **say so**: a field
  table cannot be fully auto-derived — record the split (e.g. "typed vs inline responses"),
  point at the handlers, and recommend extracting inline shapes into named types. Do not fabricate
  a field table. This feeds `reference/api-contracts.md`.
- Capture the cross-cutting invariants swagger misses: response envelope, error-code catalog,
  pagination convention, SSE/stream event format, auth/signature scheme.

**Configuration — scan config, don't skip it (critique: no config reference).** Find config
loading (viper/env/flags/`config.*`) and enumerate fields: type, default, whether required, and
runtime impact (UDS paths, TLS, license paths, HA toggles, build flags like `CGO_ENABLED`, port
ranges). This feeds `reference/config.md`.

**Data model (critique: missing data layer).** Detect any datastore client (pgx/sqlx/gorm/prisma/
mongo/redis…). Capture schema/tables from ORM models or SQL, the migrations tool + directory (or
flag its absence), and PII/audit fields. This feeds `reference/data-model.md`.

**Existing conventions & observability:** linter/formatter config, commit style, logging/metrics/
tracing setup, and any existing agent files (e.g. a `web/AGENTS.md`) — reference those rather than
duplicating them (see Step 2.6).

**Reliability — do not depend on subagents being available (critique: subagents failed).** For a
large codebase, prefer delegating the read-only sweep to an exploration subagent and working from
its summary. But if subagents are unavailable or error out (model/permission failures, etc.), fall
back to scanning in the main flow in bounded batches — never skip modules silently. Any area you
could not analyze is recorded as `TODO(detect)` so the gap is visible.

Prefer detection over questions — **except product intent**: `llms.txt` Goals (the *why*) usually
cannot be read from code. Draft it from the feature map, then ask the user to confirm rather than
guessing or leaving it blank (`TODO(confirm)`).

## Step 2.5 — TODO marker vocabulary (use everywhere)

A bare `TODO:` hides whether something is a real gap or just undetected. Use these four markers
consistently across every generated file so a reader can tell them apart:

- **`TODO(add):`** — genuinely missing; the project *should* build/adopt it (e.g. no tests exist,
  no migration mechanism). This is a real gap, not a detection failure.
- **`TODO(verify):`** — a value auto-derived from code that a human must confirm (route tables,
  field/error tables, inferred architecture). These drift — see the anti-rot rule in Step 3.
- **`TODO(detect):`** — the skill could not determine this (subagent failed, ambiguous code, not
  found). A detection blind spot, explicitly flagged rather than omitted.
- **`TODO(confirm):`** — product/business intent that code can't reveal; ask the user.

Never leave a plain `TODO:` — always pick the right marker so gaps and blind spots aren't
conflated (critique: TODOs don't distinguish "missing" from "not detected").

## Step 2.6 — Project shape: single-stack, monorepo & multi-stack

Tailor the output to how many stacks the project actually has. The templates default to
JS/frontend idioms (`pnpm`, `Vitest`, `Playwright`, `tsc`) as *examples* — never ship those to a
project that isn't JS/frontend.

**Single-stack — pure frontend or pure backend (the common case).** Generate for the one stack
present and **delete** the sections that don't apply rather than leaving dangling `TODO`s:

- **Pure frontend** (no server code of your own): keep frontend unit/component tests, E2E, and
  accessibility. Drop the backend-tests section. Emit `reference/api-contracts.md` only if the app
  *defines* an API/BFF (not merely consumes one); usually drop `data-model.md`. `config.md` covers
  build/runtime env (e.g. Vite env vars) if meaningful.
- **Pure backend** (no UI): use the detected language's real idioms — e.g. Go → `go test` +
  `go vet` + `go build`, Python → `pytest` + `mypy`, Rust → `cargo test`. **Drop** the frontend
  unit-test section, E2E/Playwright, and accessibility entirely. Keep `reference/api-contracts.md`
  (for an API service), `config.md`, and `data-model.md` (if a datastore client exists). Replace
  the JS example commands in `AGENTS.md`, don't leave them as `pnpm ...`.
- Either way, in `AGENTS.md` Project Overview mark the absent side as "none" and remove its
  placeholder rows instead of leaving `TODO(detect): frontend framework` on a backend-only repo.

**Monorepo / multi-stack.** When more than one stack or independently-built subproject exists
(e.g. a Go backend plus a Nuxt frontend, or several packages), do not cram two toolchains into one
flat file:

- **Layered files.** Generate the root `AGENTS.md` for repo-wide conventions, and a nested
  `<subproject>/AGENTS.md` for each subproject's own build/test commands and local invariants.
  The root file lists the subprojects and links to each nested file.
- **Respect existing nested files.** If a subproject already has its own `AGENTS.md` (e.g.
  `web/AGENTS.md`), reference it from the root rather than duplicating or overwriting it.
- **Per-stack test/build commands.** Each stack keeps its own exact commands (a Go `go test` vs a
  frontend `pnpm test`) in its own file — never merge them into one ambiguous list.
- If instead you keep a single file (small repo, tightly coupled), give each stack its own clearly
  labelled subsection rather than interleaving them.

## Step 3 — Generate the files

Use the templates in `templates/` as the base and fill them in from Step 2. The root `AGENTS.md`
is an **index**: keep it under ~300 lines, imperative, and operational, and move depth into
`.agents/reference/*` (critique: the 300-line cap fights depth — resolve it by externalizing, not
by writing thin).

**Anti-rot rule for derived content (apply throughout).** Anything reconstructed from code — route
tables, endpoint field tables, error-code catalogs, config field lists — goes stale the moment the
code changes. So:

- Prefer generating it from a tool (swagger/openapi export, a route dumper) and record the **exact
  refresh command** next to the table. 
- If it must be hand-written, mark it `TODO(verify)` and link to the source-of-truth file so a
  reader can re-check it.
- When a shape is only knowable by reading a handler because it's inline (`gin.H{}`, anonymous
  dicts), recommend the root-cause fix — extract it into a named type so swagger/codegen can see
  it — instead of transcribing fields that will silently drift.

**Markdown quality — every generated `.md` must lint clean.** Write all generated Markdown so it
passes `markdownlint` under a pragmatic ruleset (do **not** write a `.markdownlint.*` config into
the target project — just author clean files). Specifically:

- **Do enforce** the structural rules: one top-level `#` H1 per file (frontmatter may precede it);
  headings increase by one level at a time; a blank line above and below every heading, list,
  table, and fenced code block; every fenced code block declares a language; consistent list
  markers and ordered-list numbering; no trailing whitespace; no hard tabs; exactly one trailing
  newline; no bare URLs (use `[text](url)` or `<url>`).
- **Do not enforce** line length (MD013) or inline-HTML bans (MD033) — long prose, wide tables, and
  long links are fine and must not be mangled to satisfy a line limit.

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
     README placeholder. `commands/` stays as-is unless the project has commands to add;
     `skills/` gets the detected stack's agent skills copied in during Step 3.8.
   - `.agents/reference/*` — the deep docs (see item 5).

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
   that says to read `AGENTS.md`, and tell the user. Either way, record in the generated
   `AGENTS.md` header that these files are symlinks/shims to it (see Step 3.9).

5. **`.agents/reference/*`** — from `templates/agents/reference/`. The deep detail that keeps the
   root `AGENTS.md` an index. **Emit each file only when the project has that substance**; delete
   the ones that don't apply rather than shipping an empty shell:
   - `architecture.md` — the module map from Step 2B (responsibilities, entry points, layers, state
     machines). Emit for any non-trivial project. Keep the *full route listing* out of here — it
     goes in `routes.md`.
   - `routes.md` — the complete route table, generated from code (method, path, group,
     handler `file:symbol`, auth, SSE, purpose, status). Emit for any project with an HTTP/RPC
     surface. Follow the anti-rot rule: prefer a generator + refresh command; flag disabled/
     commented-out routes rather than dropping them.
   - **Feature docs — the per-feature-point map (not one line per domain).** Choose the shape by
     size (guidance, not a hard number):
     - Few domains / few feature points → a single `features.md`.
     - Many domains or many feature points → a `product/` folder, **one file per domain**
       (`product/auth.md`, `product/backup.md`, …) plus `product/README.md` as the index. Copy
       `templates/agents/reference/product/_domain.md` per domain (the `_domain.md` skeleton itself
       is not shipped). Use `product/` for the *product's functionality* — never name it
       `production` and never conflate it with deployment or `deploy/`.
   - `api-contracts.md` — emit for an API service: envelope, error codes, pagination, SSE/stream
     format, auth/signature, and the pointer to the contract source of truth.
   - `config.md` — emit when the project has meaningful runtime configuration.
   - `data-model.md` — emit when any datastore client is present (even without a migrations tool).
   Fill these using the anti-rot and markdown-lint rules above, and link them from `AGENTS.md` /
   `.agents/AGENTS.md`.

## Step 3.5 — Mandatory testing policy

Every generated project must document and enforce automated tests. Bake the following into the
root `AGENTS.md` **Build, Test & Push Instructions** and into `.agents/rules/testing.md`. Pick
the concrete tools from the detected/declared stack — do not leave the *choice* as a `TODO:`, only
leave a marker for values you genuinely cannot know (an exact custom script name → `TODO(detect)`;
tests that don't exist yet → `TODO(add)`).

**Testing is regression coverage, not just a runner choice (critique: testing.md was a wishlist).**
Beyond picking runners, define in `.agents/rules/testing.md`: a per-domain critical-path matrix
(rows from the feature map), an acceptance criterion per flow, one always-pass golden path, a
fixture/setup-teardown & cleanup strategy, and an "always green" regression baseline wired into
pre-push/CI. Distinguish `TODO(add)` (no tests exist — build them) from `TODO(detect)` (a suite
may exist but wasn't found).

**Frontend unit / component tests — required when a frontend stack exists (omit this whole
section for a pure-backend project):**

- If the frontend build tool is **Vite** (a `vite.config.*` exists, or `vite` is a dependency)
  → use **Vitest** (https://vitest.dev). It shares Vite's config and transform pipeline, so it
  is the correct default there.
- If the frontend is **not** Vite (Create React App, Next.js, Webpack, Angular CLI, plain
  bundler, etc.) → use **Jest** (or the framework's built-in test runner where one is canonical,
  e.g. Angular's Jasmine/Karma). Do not force Vitest onto a non-Vite toolchain.
- Pair the runner with the framework's component-testing library (React Testing Library,
  Vue Test Utils, etc.) when a UI framework is present.

**End-to-end / browser tests — required for any web app or site with a UI (omit for a UI-less
backend/API service):**

- Use **Playwright** (https://playwright.dev) as the E2E framework. Document the install/run
  commands (`npm init playwright@latest`, `npx playwright test`) and where specs live
  (`e2e/` or `tests/e2e/`).

**Backend tests — required for every backend language present (omit for a pure-frontend project):**

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
(concrete commands from the detected stack; only leave a `TODO(detect)`/`TODO(confirm)` marker for
values you truly cannot know — never a bare `TODO:`).

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
  error-response shape, and explicit sign-off for breaking changes / versioning. The concrete
  invariants go in `reference/api-contracts.md`.
- **Data layer — whenever a datastore client is present, not only when a migrations tool exists
  (critique: pgx-without-migrations was missed).** Document the datastore and schema in
  `reference/data-model.md`. If there is a client but **no** migrations mechanism, flag it as
  `TODO(add)` rather than skipping the data layer. When migrations do exist: already-applied
  migrations are immutable; changes are additive; each ships with a paired rollback.
- **Observability — when logging/metrics/tracing is present or expected.** Where logs go, levels,
  and correlation/trace IDs.
- **Audit & log redaction — when the project handles PII, secrets, or auditable actions.** What
  must be redacted from logs and what must be audited.
- **Deployment runbook — when a `deploy/`, Helm chart, Dockerfile, or CI deploy exists.** Map the
  deploy artifacts to the actual steps to ship, in the root `AGENTS.md` or a reference doc.

Detection should be specific: base each section on a concrete signal (a client library, a config
key, a directory), not a coarse yes/no, so real layers aren't dropped because one tool was absent.

### Open decision — per-domain rules

Some projects want **domain-scoped rules** (e.g. constraints specific to `network`, `ha`,
`backup`) in addition to the cross-cutting `.agents/rules/{style,security,testing}.md`. This is a
judgment call, so surface it rather than deciding silently:

- **Suggested default:** keep the three cross-cutting rule files, and put any domain-specific
  constraints inside that domain's feature doc (`reference/product/<domain>.md`) — colocated with
  the feature description, no extra structure.
- **Alternative (offer it):** if a domain has substantial standalone rules, add
  `.agents/rules/<domain>.md` and link it from `.agents/AGENTS.md`.
- Ask the user which they prefer when the project clearly has heavy per-domain constraints; do not
  hardcode either shape.

## Step 3.8 — Framework skills (wire the detected stack to agent skills)

For **every** framework, library, or tool detected in Step 2 that has a matching agent skill,
copy that skill into the project's `.agents/skills/` and reference it from the rules, so any
agent working in the repo picks up its conventions. Do this for the whole detected stack, not
just styling.

The skills ecosystem is managed by the `npx skills` CLI (`npx skills find <query>` to search,
`npx skills add <owner/name>` to install; browse at https://skills.sh).

1. **Resolve a candidate skill per detected technology.** Start from this map, then fall back to
   search for anything not listed:
   - Vue → `vue`, `vue-best-practices`, `vueuse-functions`; Nuxt → `nuxt`; Pinia → `pinia`
   - React → `vercel-react-best-practices`; React Native → `vercel-react-native-skills`
   - Tailwind CSS → `tailwindcss`; UnoCSS → `unocss`; shadcn/ui → `shadcn`
   - Vite → `vite`; Vitest → `vitest`; pnpm → `pnpm`; Turborepo → `turborepo`; tsdown → `tsdown`
   - Go → `golang-pro`; Rust → `rust-best-practices`; Tauri → `tauri-v2`
   - VitePress → `vitepress`; Slidev → `slidev`
   - **Fallback** — for anything not in this map, run `npx skills find <technology>` and pick the
     top result that is well-installed and from a reputable source. If nothing solid turns up,
     skip it (do not invent a package name).

2. **Check whether each candidate is already installed.** Look for a directory or symlink of that
   name containing a `SKILL.md` under `~/.agents/skills/`, `~/.claude/skills/`, and the
   project-local `./.claude/skills/`. Treat that as installed.

3. **For candidates that are NOT installed, ask before installing anything** — installing hits
   the network and writes outside the repo. Use the AskUserQuestion tool, listing the missing
   skills in one batch ("Install these skills for the detected stack?"). For each one the user
   approves, resolve the exact `owner/name` with `npx skills find` and run `npx skills add
   <owner/name>`. If the user declines a skill, skip it and instead leave a plain-text convention
   note for that technology in `style.md` rather than a link.

4. **Copy the resolved skills into the project**, following symlinks so the real files land in the
   repo and are version-pinned with it:
   ```
   cp -RL <resolved skill dir> <project>/.agents/skills/<name>
   ```
   Skip any `<name>` that already exists under `.agents/skills/` (idempotent). Do not copy this
   `harness-skill` itself.

5. **Reference them from the rules.** In `.agents/rules/style.md`, under a
   **Framework conventions (skills)** heading, list each copied skill, what it governs, and a link
   to `.agents/skills/<name>/`. Group styling/frontend skills there; backend/test skills may be
   noted in the same section or alongside the relevant rule.

## Step 3.9 — Symlink guardrails in the output

Symlinks are fragile across platforms and confuse editors. Make the generated repo self-explain:

- In the root `AGENTS.md` header, state that `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` are
  symlinks (or Windows shims) to `AGENTS.md` — so contributors edit `AGENTS.md`, not the links.
- If you fell back to shim files (Windows / symlink creation failed), say so explicitly and tell
  the user which files are shims.
- The `templates/root-AGENTS.md` header already carries this note — keep it when you fill the file
  in.

## Step 4 — Idempotency & safety

- If `AGENTS.md`, `.agents/` (any of `AGENTS.md`, `rules/*`, `reference/*`, `commands/`,
  `skills/`), or `llms.txt` already exist, show the user what exists and ask whether to (a) skip,
  (b) merge/update, or (c) overwrite. Never blow away existing agent rules without explicit
  confirmation. When merging into an existing flat `.agents/AGENTS.md`, offer to split its
  contents into the `rules/` files rather than duplicating them.
- For symlinks, skip any name that is already taken and report it.
- For framework skills (Step 3.8), skip any `.agents/skills/<name>` that already exists rather
  than overwriting it, and never install a skill without the user's explicit approval.
- Respect existing nested `AGENTS.md` files (Step 2.6) — reference, don't overwrite.

## Step 5 — Report

Summarize what was created (as a short file tree). Then list the outstanding markers **grouped by
type** so the user knows what each demands:

- **`TODO(add)`** — real gaps to build (e.g. no tests, no migrations).
- **`TODO(confirm)`** — product intent awaiting the user's answer.
- **`TODO(verify)`** — auto-derived content to double-check against code.
- **`TODO(detect)`** — detection blind spots (including anything skipped because a subagent was
  unavailable) that need a manual pass.

Do not recap file contents line by line.
