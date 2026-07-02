# Route Table

> Deep reference for agents. The complete HTTP/RPC route table, generated from code — not
> hand-transcribed. Linked from the root `AGENTS.md`. See the refresh note before editing by hand.
>
> TODO markers: `TODO(add)` = missing, build it · `TODO(verify)` = derived, confirm · `TODO(detect)`
> = not found, investigate · `TODO(confirm)` = ask a human.

## Source of truth

- **Route registration:** TODO(verify): the file where routes are declared (e.g. a gin
  `RouterGroup` tree in `pkg/api/v1/v1.go`, Express router, FastAPI app, Spring controllers).
- **Generated spec:** TODO(verify): runtime `swagger.json` / OpenAPI export, if any.
- **Refresh command:** TODO(add): the exact command that regenerates this table (a route dumper or
  swagger export). If none exists, record here that one should be built — a large route table must
  not be hand-maintained long-term (see the anti-rot rule in the root `AGENTS.md`).

## Routes

One row per route. Mark disabled / commented-out routes explicitly in the Status column — do not
drop them, they are not dead code.

| Method | Path | Group | Handler (file:symbol) | Auth | SSE | Purpose | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TODO(verify): GET | `/api/v1/...` | group | `file:Handler` | public / session / AK-SK / trusted-UDS | no | what it does | enabled / disabled |
