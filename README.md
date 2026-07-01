# agents-md-init

Install the **`harness-init`** agent skill with one command. The skill scaffolds a complete set
of **AGENTS.md-standard** files into a project — the public "agent-native repo" spec promoted by
Harness.

It handles two cases:

- **Empty project** — asks you about your frontend/backend tech stack interactively, then
  generates a spec-compliant skeleton with `TODO:` placeholders.
- **Existing project** — auto-detects your stack, build/test commands, and layout from the code
  and config, then generates populated files.

## Install (Node)

Run the installer with npx (no global install needed):

```bash
npx agents-md-init
```

…or install it globally so the command stays available:

```bash
npm install -g agents-md-init
agents-md-init
```

Either way it copies the skill into `~/.claude/skills/harness-init`. Then, in any project,
invoke it with `/harness-init` in Claude Code (or just ask your agent to "set up AGENTS.md").

### Installer options

```
-p, --project      Install into ./.claude/skills instead of the home dir
-d, --dir <path>   Install into a custom skills base directory
-f, --force        Overwrite an existing installation
-v, --version      Print version
-h, --help         Show help
```

## What the skill generates

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

## Repo layout

- `bin/cli.js` — the Node installer (zero dependencies).
- `SKILL.md` — the skill's instructions (the flow the agent follows).
- `templates/` — file skeletons for `AGENTS.md`, `.agents/AGENTS.md`, and `llms.txt`.
- `reference/harness-spec.md` — condensed spec, loaded on demand.

## The standard

Based on the AGENTS.md hierarchical configuration standard. See `reference/harness-spec.md` for
a condensed version, and:

- https://agentsstandard.com/
- https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard
