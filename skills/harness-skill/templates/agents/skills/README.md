# Skills

Agent skills for this project's stack — framework/library conventions agents load on demand.

The `harness-skill` scaffolder copies a skill in here for each detected technology that has one
(e.g. `vue/`, `tailwindcss/`, `vitest/`), so they travel with the repo and are version-pinned.
Each skill is a self-contained subdirectory with its own `SKILL.md`. The rules in
[`../rules/style.md`](../rules/style.md) link to the relevant ones.

To add more later, install with `npx skills add <owner/name>` then copy the resolved directory
here (`cp -RL`), or run the `harness-skill` again. Browse skills at https://skills.sh.
