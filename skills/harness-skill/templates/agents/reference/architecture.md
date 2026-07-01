# Architecture & Module Map

> Deep reference for agents. The root `AGENTS.md` links here instead of inlining this. Describes
> what each module *does*, not just where it lives. Keep it in sync with the code — see the
> refresh note at the bottom.
>
> TODO markers: `TODO(add)` = missing, should be built · `TODO(verify)` = auto-derived, confirm
> against code · `TODO(detect)` = could not determine, investigate · `TODO(confirm)` = ask a human.

## System shape

- **What it is:** TODO(confirm): one paragraph — the system's job and its main runtime pieces.
- **Data flow:** TODO(verify): how a request/job flows through the layers (entry → handler →
  domain → store → response), including any async paths (queues, SSE, websockets).
- **Processes / services:** TODO(verify): each long-running process, its entry point, and how they
  talk (HTTP, gRPC, UDS, netlink, signals…).

## Modules

For every top-level module / package / service, one entry — responsibility, entry point, key
types, and who it talks to. Do not just restate the directory name.

| Module / path | Responsibility | Entry point | Talks to | Notes |
| --- | --- | --- | --- | --- |
| TODO(verify): `path/` | what it owns | file:symbol | deps/callers | invariants, gotchas |

## Feature map

What the product actually does, derived from routes / handlers / CLI commands / UI pages / jobs
(not from the README). Point at the real source of truth for each.

- TODO(verify): feature — surfaced by `path/to/router-or-handler` — one line on behavior.
- TODO(detect): area the scan could not map — needs a human pass.

## State machines & non-obvious mechanisms

- TODO(verify): HA / leader-election state machine, retry/backoff, netlink proxy, background
  reconcilers — anything whose *motivation* isn't obvious from the code.

## Refresh

This file is partly derived from code and will drift. Regenerate the module/feature map by
re-running the `harness-skill`, or update by hand when modules, routes, or entry points change.
TODO(add): if you have a generator (route dumper, etc.), record the exact command here.
