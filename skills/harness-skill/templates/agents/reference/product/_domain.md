# <Domain — e.g. Backup>

> Per-domain feature doc. Copy this skeleton to `<domain>.md` (one per domain) and add it to
> `README.md`. Intent-level content; `TODO(verify)` is acceptable here (see the anti-rot note in
> the root `AGENTS.md`). This file is a template — the leading `_` means "don't ship as-is".

## Overview

TODO(verify): what this domain is responsible for, in 1–2 sentences.

## Feature points

One entry per feature — not one line for the whole domain. A "backup" domain, for example,
expands to: tag-scoped config, global config, keys, SFTP test, chunked-upload resume, record
list/detail/download, run, restore, upload-restore, SFTP sync — each its own entry.

- **<feature name — user/ops view>** — TODO(verify): what it does (observable behavior/intent).
  - Route(s): `METHOD /path` → `file:symbol` (see [`../routes.md`](../routes.md))
  - UI: TODO(verify): page/component, if any
  - CLI: TODO(verify): command, if any
  - Status: enabled / disabled (commented-out) / planned

## Key flows & state machines

- TODO(verify): important sequences or state machines in this domain.

## Known pitfalls & disabled items

- TODO(verify): gotchas, and any commented-out/disabled routes or pages — flag them, don't ignore.
