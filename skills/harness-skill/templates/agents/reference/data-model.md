# Data Model

> Deep reference for agents. Persistent data shapes and their invariants. Emitted whenever a
> datastore client is present, even if there is no migrations tool. Linked from the root
> `AGENTS.md`.
>
> TODO markers: `TODO(add)` = missing, should be built · `TODO(verify)` = auto-derived, confirm
> against code · `TODO(detect)` = could not determine, investigate · `TODO(confirm)` = ask a human.

## Datastore(s)

- TODO(verify): datastore(s) and client library (e.g. Postgres via `pgx`, Redis, SQLite). Point
  at the connection/setup code.

## Schema / tables

One row per table/collection (or note that the schema is defined elsewhere / inferred).

| Table / entity | Key fields | Owned by module | Notes / invariants |
| --- | --- | --- | --- |
| TODO(verify): name | fields | module | constraints, soft-delete, tenancy |

## Migrations

- TODO(detect): migrations tool and directory. If a datastore client exists but **no** migrations
  are found, say so explicitly and flag it: `TODO(add)` — no migration mechanism; schema changes
  are currently ad hoc.
- When migrations exist: already-applied migrations are immutable; changes are additive; each
  ships with a paired rollback.

## Audit & PII

- TODO(confirm): which tables/fields hold PII or audit trails, retention expectations, and log
  redaction rules for them. See [`../rules/security.md`](../rules/security.md).
