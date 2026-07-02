# Feature Map

> Deep reference for agents. What the product actually does — **one entry per feature point**, not
> one line per domain. Use this single file when the project has only a few domains; when it grows
> (many domains / many feature points) split into `product/` with one file per domain (see SKILL.md
> Step 2B / Step 3). Linked from the root `AGENTS.md`.
>
> Feature descriptions are intent-level and relatively stable, so hand-written or derived content
> marked `TODO(verify)` is fine here — this does not violate the anti-rot rule (that rule targets
> volatile derived tables like field/route lists).
>
> TODO markers: `TODO(add)` = missing, build it · `TODO(verify)` = derived, confirm · `TODO(detect)`
> = not found, investigate · `TODO(confirm)` = ask a human.

## <Domain — e.g. Auth>

TODO(verify): one line on what this domain covers.

- **<feature name — user/ops view, not a function name>** — TODO(verify): what it does, 1–2
  sentences of observable behavior/intent.
  - Route(s): `METHOD /path` → handler `file:symbol` (see [`routes.md`](routes.md))
  - UI: TODO(verify): page/component, if any
  - CLI: TODO(verify): command, if any
  - Status: enabled / disabled (commented-out) / planned
- **<next feature point>** — TODO(verify): ...

## <Domain 2>

TODO(verify): repeat the structure above. Break each domain down to its individual feature points
— e.g. a "backup" domain is not one line but many: tag-scoped config, global config, keys, SFTP
test, chunked-upload resume, record list/detail/download, run, restore, upload-restore, SFTP sync
— each its own entry with a "what it does".
