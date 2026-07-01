# harness-init

A Claude Code / agent skill that scaffolds a complete set of **AGENTS.md-standard** files into
a project — the public "agent-native repo" spec promoted by Harness.

It handles two cases:

- **Empty project** — asks you about your frontend/backend tech stack interactively, then
  generates a spec-compliant skeleton with `TODO:` placeholders.
- **Existing project** — auto-detects your stack, build/test commands, and layout from the code
  and config, then generates populated files.

## What it generates

```
<project root>/
├── AGENTS.md        # active session rules (canonical touchpoint), 4 core sections
├── .agents/
│   └── AGENTS.md    # committed team base conventions
├── llms.txt         # project PRD: goals, architecture, tech stack, scope
├── CLAUDE.md    -> AGENTS.md   (symlink)
├── GEMINI.md    -> AGENTS.md   (symlink)
└── .cursorrules -> AGENTS.md   (symlink)
```

## Install

Install as a personal skill by linking (or copying) this repo into your skills directory:

```bash
# symlink (recommended — pull updates with git)
ln -s "$(pwd)" ~/.claude/skills/harness-init

# or copy
cp -r "$(pwd)" ~/.claude/skills/harness-init
```

Then, in a project, invoke it with `/harness-init` (or just ask the agent to "set up AGENTS.md").

## Layout

- `SKILL.md` — the skill's instructions (the flow the agent follows).
- `templates/` — file skeletons for `AGENTS.md`, `.agents/AGENTS.md`, and `llms.txt`.
- `reference/harness-spec.md` — condensed spec, loaded on demand.

## The standard

Based on the AGENTS.md hierarchical configuration standard. See `reference/harness-spec.md` for
a condensed version, and:

- https://agentsstandard.com/
- https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard
