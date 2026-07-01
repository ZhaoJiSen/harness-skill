# API Contracts & Invariants

> Deep reference for agents. The interface invariants that a schema dump (swagger) often misses
> but that must not silently change. Linked from the root `AGENTS.md`.
>
> TODO markers: `TODO(add)` = missing, should be built · `TODO(verify)` = auto-derived, confirm
> against code · `TODO(detect)` = could not determine, investigate · `TODO(confirm)` = ask a human.

## Source of truth

- **Schema / spec:** TODO(verify): where the real contract lives — `swagger.yaml`, OpenAPI route,
  `pkg/api/.../resp`, `pkg/model`, proto files. Point at files, not prose.
- **Derivation caveat:** TODO(verify): if request/response types are **inline** (e.g. `gin.H{}`,
  anonymous dicts) rather than named types, field tables here CANNOT be fully auto-derived — they
  are hand-written and WILL drift. Recommend extracting inline shapes into named types so
  swagger/codegen can see them. Note the split (e.g. "112 typed vs 111 inline responses").

## Response envelope

- TODO(verify): the standard success/error wrapper (e.g. `{ code, message, data }`), and which
  endpoints deviate.

## Error codes

| Code | Meaning | HTTP status | Where defined |
| --- | --- | --- | --- |
| TODO(verify): code | meaning | status | file:symbol |

## Pagination

- TODO(verify): the pagination convention (page/pageSize vs cursor), request params, and the
  response shape for lists.

## Streaming / async contracts

- TODO(verify): SSE / websocket event format — event names, payload shape, terminating/heartbeat
  events. TODO(detect): if none, remove this section.

## Auth

- TODO(verify): auth scheme(s) — bearer/session/AK-SK. For signed requests, document the exact
  string-to-sign, header names, and clock-skew tolerance.

## Compatibility rules

- Backward compatibility is required; breaking changes need explicit sign-off and versioning.
- TODO(confirm): which endpoints/fields are frozen public contract vs internal and changeable.
