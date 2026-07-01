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
│   └── AGENTS.md    # committed team base conventions
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
- **Test framework** — if known
- **Anything critical to know upfront** — deployment target, key constraints (optional)

Where the user does not know a value, leave a clearly-marked `TODO:` placeholder in the
generated files rather than guessing.

## Step 2B — Existing project: auto-detect

Read the manifests and skim the directory structure to infer:

- Languages, frameworks, and key dependencies
- Build / test / lint commands (from `scripts` in package.json, Makefile targets, CI config,
  Maven/Gradle tasks, etc.) — capture the **exact** commands, not "run tests"
- Directory layout and key components
- Any existing conventions (linter config, formatter, commit style)

Only ask the user for things you genuinely cannot infer. Prefer detection over questions here.

## Step 3 — Generate the files

Use the templates in `templates/` as the base and fill them in from Step 2. Keep the root
`AGENTS.md` under ~300 lines, imperative, and operational.

1. **`AGENTS.md`** (project root) — from `templates/root-AGENTS.md`. Four core sections:
   - Project Overview (purpose, architecture, directory structure, tech stack, key deps)
   - Build, Test & Push Instructions (exact commands, linter/formatter, pre-push checks)
   - Development Workflow (naming, logging, security, architectural constraints; link out to
     `.agents/AGENTS.md` rather than bloating this file)
   - Common Pitfalls & Prohibited Patterns (anti-patterns, deprecated APIs, frozen public APIs)

2. **`.agents/AGENTS.md`** — from `templates/agents-base.md`. Committed, stable team base
   conventions (per-language style, security baseline, commit format).

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

## Step 4 — Idempotency & safety

- If `AGENTS.md`, `.agents/AGENTS.md`, or `llms.txt` already exist, show the user what exists
  and ask whether to (a) skip, (b) merge/update, or (c) overwrite. Never blow away existing
  agent rules without explicit confirmation.
- For symlinks, skip any name that is already taken and report it.

## Step 5 — Report

Summarize what was created (as a short file tree) and point out any `TODO:` placeholders the
user still needs to fill in. Do not recap file contents line by line.
