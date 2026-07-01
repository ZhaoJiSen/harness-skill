# Team Base Conventions

> Committed, stable conventions for this project. Changes slowly and is reviewed like code.
> The root `AGENTS.md` links here so it stays short. Loaded before the root file in the
> AGENTS.md cascade.

## Code Style

- **General:** favor clarity over cleverness; match surrounding code.
- **Per language:**
  - TODO: e.g. TypeScript — strict mode on, no `any`, prefer named exports.
  - TODO: e.g. Python — type hints required, format with ruff/black.
- **Types:** no new type errors; never silence the type checker (`any`, `@ts-ignore`,
  `# type: ignore`, etc.) without a written justification.
- **Error handling:** fail loud, not silent — never swallow exceptions or ignore returned
  errors. Surface actionable messages; TODO: project error-handling pattern (Result type,
  exceptions, error middleware…).
- **Comments:** explain *why*, not *what*. Match the file's existing comment density.

## Dependencies

- Prefer the standard library or an already-present dependency before adding a new one.
- Adding a new runtime dependency requires an explicit reason; avoid one-off micro-packages.
- Pin exact/locked versions; flag unusual or typosquatting-looking package names.

## Security Baseline

- Never commit secrets; use environment variables / a secrets manager.
- Keep a committed `.env.example`; read config from the environment, never hardcode it.
- Validate and sanitize all external input.
- Use parameterized queries; never build SQL by string concatenation.
- Pin dependency versions; flag unusual or typosquatting-looking package names.

## Testing

Automated tests are mandatory, not optional.

- **Frontend unit/component tests:** use **Vitest** if the project builds with Vite; otherwise
  use **Jest** (or the framework's canonical runner, e.g. Angular's Karma/Jasmine). Do not force
  Vitest onto a non-Vite toolchain. TODO: name the runner chosen and where specs live.
- **End-to-end tests:** use **Playwright** for any UI. TODO: E2E specs live in `e2e/`.
- **Backend tests:** every backend language ships with test files in its idiomatic framework
  (pytest / JUnit / `go test` / `cargo test` / Vitest|Jest for Node …). TODO: name the
  framework(s) and test directory layout per service.
- New features and bug fixes ship with tests; new backend code lands with matching test files.
- Test behavior and critical paths, not implementation details. TODO: coverage expectation, if any.
- Do not mark work done while tests fail. Run the full unit suite plus relevant E2E specs before
  pushing.

## Commits & Branches

- **Commit format:** TODO: e.g. Conventional Commits (`feat:`, `fix:`, `chore:`…).
- **Branching:** TODO: e.g. work on feature branches, never push directly to `main`.
- Keep commits focused; stage specific files rather than `git add .`.

## Documentation

- Update `AGENTS.md` and `llms.txt` when architecture, commands, or scope change.
- Treat agent instruction files as part of the execution surface, not static docs.
