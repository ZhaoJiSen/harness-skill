# Testing Policy

> Loaded via `.agents/AGENTS.md`. Automated tests are mandatory, not optional.

## Frontend unit / component tests — required when a frontend stack exists

- Use **Vitest** if the project builds with **Vite** (a `vite.config.*` exists, or `vite` is a
  dependency) — it shares Vite's config and transform pipeline.
- Otherwise use **Jest** (or the framework's canonical runner, e.g. Angular's Karma/Jasmine).
  Do not force Vitest onto a non-Vite toolchain.
- Pair the runner with the framework's component-testing library (React Testing Library, Vue
  Test Utils, …). TODO: name the runner chosen and where specs live.

## End-to-end / browser tests — required for any web app or site with a UI

- Use **Playwright**. TODO: E2E specs live in `e2e/` (or `tests/e2e/`); document the run command
  (e.g. `npx playwright test`).

## Backend tests — required for every backend language present

- Each backend language/service ships with test files in its idiomatic framework:
  pytest (Python) / JUnit (Java) / `go test` (Go) / `cargo test` (Rust) / Vitest|Jest (Node) /
  RSpec|Minitest (Ruby) / PHPUnit (PHP) / xUnit|NUnit (.NET). TODO: name the framework(s) and
  test directory layout per service.

## Expectations

- New features and bug fixes ship with tests; new backend code lands with matching test files.
- Test behavior and critical paths, not implementation details. TODO: coverage expectation, if any.
- Do not mark work done while tests fail. Run the full unit suite plus relevant E2E specs before
  pushing.
