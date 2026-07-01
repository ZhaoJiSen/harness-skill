# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This repo is the **distribution package for a single agent skill**, `harness-skill`. It is not a
conventional application — there is no build step, no test framework, and almost no executable
code. The deliverable is the skill itself, and the skill is written in natural-language prose,
not code.

The skill scaffolds AGENTS.md-standard files (the "agent-native repo" spec promoted by Harness)
into *other* projects. See `README.md` for user-facing install/usage.

## The critical distinction: repo files vs. generated files

Two sets of files look similar but serve opposite roles. Do not confuse them:

- **`skills/harness-skill/templates/*`** — skeletons the skill *writes into a target project*
  when a user runs it. `root-AGENTS.md`, `agents-base.md`, `llms.txt` are output templates full
  of `TODO:` placeholders. Editing these changes what end users' projects get.
- A `CLAUDE.md` / `AGENTS.md` at the root of *this* repo (like this file) configures work *on
  this repo itself*. The skill never reads these.

## Architecture

- **`skills/harness-skill/SKILL.md`** — the actual product. It is a prompt: step-by-step
  instructions an agent follows (detect empty vs. existing project → interactive intake or
  auto-detect → generate files → idempotency check). To change the skill's behavior, edit this
  prose — there is no code path to trace.
- **`skills/harness-skill/reference/harness-spec.md`** — condensed AGENTS.md standard, loaded by
  the skill on demand. Kept out of SKILL.md deliberately so it does not bloat the agent's context.
- **`bin/cli.js`** — a zero-dependency Node installer (built-ins only). Its sole job is to copy
  `skills/harness-skill/` into a skills directory (default `~/.claude/skills/harness-skill`). It
  contains no scaffolding logic; the AI in the installed skill does that work.

## Structural constraints (don't break these)

- `skills/harness-skill/` must stay a **self-contained directory** (SKILL.md + templates +
  reference, nothing else). skills.sh installs exactly this directory via
  `npx skills add ZhaoJiSen/harness-skill`, so packaging files (package.json, bin/) must live
  outside it.
- The name `harness-skill` is used in **three coupled places** — the npm `name`/`bin`, the
  `SKILL_NAME` constant in `bin/cli.js`, and the `name:` in SKILL.md frontmatter (which
  determines the `/harness-skill` invocation). Rename all three together.
- `bin/cli.js` uses `fs.cpSync` (Node ≥16.7, declared in `engines`). Keep it dependency-free.

## Commands

There is no build/lint/test tooling. Verification is done by exercising the installer:

```bash
node bin/cli.js --help
node bin/cli.js --version
node bin/cli.js --dir /tmp/hs        # dry install to a scratch dir, then inspect the tree
npm pack --dry-run                   # confirm exactly which files would publish
```

Installer flags: `-p/--project` (install to `./.claude/skills`), `-d/--dir <path>`, `-f/--force`,
`-v/--version`, `-h/--help`.

## Publishing

- **skills.sh**: no submission step — pushing to the public GitHub repo makes it installable
  immediately; rankings come from install telemetry.
- **npm**: not currently published. `package.json` is ready; `npm publish --access public` after
  `npm login` would ship it.
