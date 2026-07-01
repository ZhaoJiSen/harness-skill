# Team Base Conventions

> Committed, stable conventions for this project. Changes slowly and is reviewed like code.
> The root `AGENTS.md` links here so it stays short. Loaded before the root file in the
> AGENTS.md cascade.

## Code Style

- **General:** favor clarity over cleverness; match surrounding code.
- **Per language:**
  - TODO: e.g. TypeScript — strict mode on, no `any`, prefer named exports.
  - TODO: e.g. Python — type hints required, format with ruff/black.
- **Comments:** explain *why*, not *what*. Match the file's existing comment density.

## Security Baseline

- Never commit secrets; use environment variables / a secrets manager.
- Validate and sanitize all external input.
- Use parameterized queries; never build SQL by string concatenation.
- Pin dependency versions; flag unusual or typosquatting-looking package names.

## Testing

- TODO: test framework and where tests live.
- New features and bug fixes ship with tests.
- Do not mark work done while tests fail.

## Commits & Branches

- **Commit format:** TODO: e.g. Conventional Commits (`feat:`, `fix:`, `chore:`…).
- **Branching:** TODO: e.g. work on feature branches, never push directly to `main`.
- Keep commits focused; stage specific files rather than `git add .`.

## Documentation

- Update `AGENTS.md` and `llms.txt` when architecture, commands, or scope change.
- Treat agent instruction files as part of the execution surface, not static docs.
