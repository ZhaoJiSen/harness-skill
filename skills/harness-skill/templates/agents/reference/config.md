# Configuration Reference

> Deep reference for agents. Runtime configuration is a common source of production surprises —
> document every field, not just the happy path. Linked from the root `AGENTS.md`.
>
> TODO markers: `TODO(add)` = missing, should be built · `TODO(verify)` = auto-derived, confirm
> against code · `TODO(detect)` = could not determine, investigate · `TODO(confirm)` = ask a human.

## Sources & precedence

- TODO(verify): config mechanism (env vars, `config.yaml`, viper, flags, secrets manager) and the
  precedence order when they overlap.
- TODO(verify): where config is loaded/validated in code (file:symbol), and what happens on a
  missing/invalid value (fail-fast vs default).

## Fields

One row per field. Include the runtime impact — the reason a field is a footgun.

| Field / env | Type | Default | Required | Runtime impact / gotcha |
| --- | --- | --- | --- | --- |
| TODO(verify): name | type | default | yes/no | what breaks if wrong (e.g. UDS path, TLS, license path, HA toggle, CGO flag, port range) |

## Build / runtime flags

- TODO(verify): build-time flags that change behavior (e.g. `CGO_ENABLED`, build tags) and why
  they matter.

## Secrets

- TODO(verify): which config values are secret, where they come from, and the committed
  `.env.example` (never commit real values). See [`../rules/security.md`](../rules/security.md).
