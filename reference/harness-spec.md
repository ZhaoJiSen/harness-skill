# The AGENTS.md Standard (reference)

Condensed reference for the public AGENTS.md hierarchical configuration standard, as promoted
by Harness for building "agent-native" repositories. Load this only when you need the details.

## Core idea

- READMEs serve humans; `AGENTS.md` serves agents. It captures operational knowledge that
  otherwise lives in chat history or tool-specific config, and makes it version-controlled and
  portable across tools (Claude Code, Codex, Cursor, Gemini, etc.).
- Separate **what/why** (project requirements) from **how** (behavioral rules).

## Five loading tiers (concatenated, most specific wins)

1. **Global base** — `~/.agents/AGENTS.md`: user-level safety, identity, preferences.
2. **Project PRD** — `llms.txt` at repo root: goals, architecture, tech stack, scope.
3. **Project base** — `.agents/AGENTS.md` at repo root: committed team conventions.
4. **Project active** — `AGENTS.md` at repo root: task/session rules; the canonical touchpoint.
5. **Folder** — `AGENTS.md` in any subdirectory: component-scoped overrides (optional).

Each tier concatenates onto the broader ones rather than replacing them. The project root is a
ceiling — agents detect it from the initial working directory and must not traverse above it.

## Root AGENTS.md — four core sections (Harness recommendation)

Keep it under ~300 lines, imperative, and operational.

1. **Project Overview** — purpose, architecture, directory structure, key components, tech
   stack, critical dependencies.
2. **Build, Test & Push Instructions** — exact build/test commands (not "run tests"), linter /
   formatter rules, pre-push validation. "Agents execute what they are told."
3. **Development Workflow** — naming, logging, security, architectural constraints. Link out to
   a separate standards doc instead of bloating the root file.
4. **Common Pitfalls & Prohibited Patterns** — anti-patterns, deprecated APIs, common wrong
   assumptions, public APIs that must not change. "Defensive programming for AI collaboration."

## Format

- Plain Markdown. No YAML frontmatter, no schema — just write rules.
- Write imperatively. Don't duplicate the README; reference it.
- Update as the code evolves; treat it as part of the execution surface.

## Hierarchical layout for larger projects

```
root/
  AGENTS.md              # global conventions
  module-a/
    AGENTS.md            # local invariants
  module-b/
    AGENTS.md
    sub-feature/
      AGENTS.md          # edge cases
```

Agents automatically read nested files when working inside those directories. Each module-level
file is owned and reviewed by that module's engineers.

## Single source of truth / symlinks

Maintain one canonical file. For tools that expect other filenames, symlink them to `AGENTS.md`:

```
CLAUDE.md    -> AGENTS.md
GEMINI.md    -> AGENTS.md
.cursorrules -> AGENTS.md
```

Use relative link targets so links survive moving/cloning the repo.

## Signals

If agents keep ignoring documented rules, treat it as a signal that the instruction is unclear
or the file is too long and getting truncated — tighten it rather than adding more.
