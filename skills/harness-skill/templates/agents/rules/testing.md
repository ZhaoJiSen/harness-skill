# Testing Policy

> Loaded via `.agents/AGENTS.md`. Automated tests are mandatory, not optional. This defines the
> *regression coverage* expected, not just which runner to install.
>
> TODO markers: `TODO(add)` = no tests exist yet, build them · `TODO(detect)` = runner/setup not
> found, confirm · `TODO(verify)` = derived, check against code.

## Runners (the tools)

> Keep only the subsections that match this project's stack. A pure-backend project drops the
> frontend and E2E subsections; a pure-frontend project drops the backend subsection. Replace the
> JS/`pnpm` examples with the real commands for the detected stack.

### Frontend unit / component tests — required when a frontend stack exists (drop if pure backend)

- Use **Vitest** if the project builds with **Vite** (a `vite.config.*` exists, or `vite` is a
  dependency) — it shares Vite's config and transform pipeline.
- Otherwise use **Jest** (or the framework's canonical runner, e.g. Angular's Karma/Jasmine).
  Do not force Vitest onto a non-Vite toolchain.
- Pair the runner with the framework's component-testing library (React Testing Library, Vue
  Test Utils, …). TODO(detect): name the runner chosen and where specs live.

### End-to-end / browser tests — required for any web app or site with a UI (drop if UI-less backend)

- Use **Playwright**. TODO(detect): E2E specs live in `e2e/` (or `tests/e2e/`); document the run
  command (e.g. `npx playwright test`).

### Backend tests — required for every backend language present (drop if pure frontend)

- Each backend language/service ships with test files in its idiomatic framework:
  pytest (Python) / JUnit (Java) / `go test` (Go) / `cargo test` (Rust) / Vitest|Jest (Node) /
  RSpec|Minitest (Ruby) / PHPUnit (PHP) / xUnit|NUnit (.NET). TODO(detect): name the framework(s)
  and test directory layout per service.

## Regression coverage (what must be tested, not just how)

Picking a runner is not a test plan. Define and keep the baseline below green.

- **Critical-path matrix — per domain/module.** One row per user-critical flow, so gaps are
  visible. Rows come from the feature map in
  [`../reference/architecture.md`](../reference/architecture.md).

  | Domain / flow | What "correct" means (acceptance) | Test type | Spec location | Status |
  | --- | --- | --- | --- | --- |
  | TODO(add): flow | observable acceptance criteria | unit / integration / E2E | file | missing / green |

- **Golden path:** TODO(add): the one end-to-end happy-path scenario that must always pass — the
  canary for "is the product fundamentally working".
- **Fixtures & isolation:** TODO(add): how test data/fixtures are created and **cleaned up** (DB
  reset/transaction rollback, temp dirs, mocked externals). Tests must not depend on each other or
  on leftover state.
- **Always-green baseline:** the matrix above is the regression baseline. TODO(add): wire it into
  CI; a red baseline blocks merge. Never delete/skip a baseline test to make a build pass — fix
  the cause or get explicit sign-off.

## Expectations

- New features and bug fixes ship with tests; new backend code lands with matching test files.
- Test behavior and critical paths, not implementation details. TODO(confirm): coverage
  expectation, if any.
- Distinguish **`TODO(add)`** (no tests exist — build them) from **`TODO(detect)`** (a runner/
  suite may exist but wasn't found — confirm) so readers know what's a real gap vs a blind spot.
- Do not mark work done while tests fail. Run the full unit suite plus relevant E2E specs before
  pushing.
