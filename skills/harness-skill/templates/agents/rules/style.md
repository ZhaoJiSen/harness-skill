# Code Style & Conventions

> Loaded via `.agents/AGENTS.md`. How code should be written and changed in this project.

## Code Style

- **General:** favor clarity over cleverness; match surrounding code.
- **Per language:**
  - TODO: e.g. TypeScript — strict mode on, no `any`, prefer named exports.
  - TODO: e.g. Python — type hints required, format with ruff/black.
- **Comments:** explain *why*, not *what*. Match the file's existing comment density.

## Types & Static Analysis

- Typecheck is a first-class gate: `TODO: e.g. tsc --noEmit / mypy / go vet`.
- No new type errors. Never silence the type checker (`any`, `@ts-ignore`, `# type: ignore`,
  etc.) without a written justification in the change.

## Error Handling

- Fail loud, not silent — never swallow exceptions or ignore returned errors.
- Surface actionable messages. TODO: project error-handling pattern (Result type, exceptions,
  error middleware…).

## Dependencies

- Prefer the standard library or an already-present dependency before adding a new one.
- Adding a new runtime dependency requires an explicit reason; avoid one-off micro-packages.
- Pin exact/locked versions; flag unusual or typosquatting-looking package names.

## Commits & Branches

- **Commit format:** TODO: e.g. Conventional Commits (`feat:`, `fix:`, `chore:`…).
- **Branching:** TODO: e.g. work on feature branches, never push directly to `main`.
- Keep commits focused; stage specific files rather than `git add .`.

## Documentation

- Update `AGENTS.md` and `llms.txt` when architecture, commands, or scope change.
- Treat agent instruction files as part of the execution surface, not static docs.
