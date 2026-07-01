# Team Base Conventions

> Committed, stable conventions for this project. Changes slowly and is reviewed like code.
> The root `AGENTS.md` links here so it stays short. Loaded before the root file in the
> AGENTS.md cascade.

## How this directory is organized

The detailed rules live in `rules/`, split by concern so each file stays focused and easy to
review. Read the file relevant to the change you are making:

- [`rules/style.md`](rules/style.md) — code style, types, error handling, comments,
  dependencies, commits & branches, documentation.
- [`rules/security.md`](rules/security.md) — secrets, input validation, and the security baseline
  every change must respect.
- [`rules/testing.md`](rules/testing.md) — the mandatory testing policy (frontend, E2E, backend).

Two extension directories hold project-specific agent assets:

- [`commands/`](commands/) — reusable prompts / slash-commands for agents working in this repo.
- [`skills/`](skills/) — agent skills for this project's stack (Vue, Tailwind, etc.), copied in
  and linked from [`rules/style.md`](rules/style.md).

## Non-negotiables (summary)

The rule files are authoritative; this is the short version so nothing is missed:

- Automated tests are mandatory — new features and fixes ship with tests, and work is not done
  while tests fail. See [`rules/testing.md`](rules/testing.md).
- Never commit secrets; validate all external input; use parameterized queries. See
  [`rules/security.md`](rules/security.md).
- No new type errors and no silencing the type checker without a written reason. See
  [`rules/style.md`](rules/style.md).
- Update `AGENTS.md`, `llms.txt`, and these rules when architecture, commands, or scope change —
  treat agent instruction files as part of the execution surface, not static docs.

## Deep reference

Depth that would blow the root `AGENTS.md` past ~300 lines lives in `reference/` (emitted only
when it applies). Consult and keep it current:

- [`reference/architecture.md`](reference/architecture.md) — module map, feature map, state machines.
- [`reference/api-contracts.md`](reference/api-contracts.md) — response envelope, error codes,
  pagination, streaming/auth invariants, and the API source of truth.
- [`reference/config.md`](reference/config.md) — configuration fields and runtime gotchas.
- [`reference/data-model.md`](reference/data-model.md) — datastores, schema, migrations, PII.
