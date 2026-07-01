# harness-skill

English | [中文](./README.zh-CN.md)

An agent skill that scaffolds a complete set of **AGENTS.md-standard** files into a project —
the public "agent-native repo" spec promoted by Harness.

It handles two cases:

- **Empty project** — asks about your frontend/backend tech stack interactively, then generates
  a spec-compliant skeleton with `TODO:` placeholders.
- **Existing project** — auto-detects your stack, build/test commands, and layout, then generates
  populated files.

## Install

### Via skills.sh (recommended)

```bash
npx skills add ZhaoJiSen/harness-skill
```

This installs the skill into `~/.claude/skills/harness-skill`. Then, in any project, invoke it
with `/harness-skill` in Claude Code (or just ask your agent to "set up AGENTS.md").

### From source (local)

Clone this repo and run the bundled zero-dependency installer:

```bash
git clone git@github.com:ZhaoJiSen/harness-skill.git
cd harness-skill
node bin/cli.js
```

Installer options:

```
-p, --project      Install into ./.claude/skills instead of the home dir
-d, --dir <path>   Install into a custom skills base directory
-f, --force        Overwrite an existing installation
-v, --version      Print version
-h, --help         Show help
```

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

## Repo layout

```
skills/harness-skill/
├── SKILL.md                  # the skill's instructions (the flow the agent follows)
├── templates/                # skeletons for AGENTS.md, .agents/AGENTS.md, llms.txt
└── reference/harness-spec.md # condensed spec, loaded on demand
bin/cli.js                    # zero-dependency installer
```

`skills/harness-skill/` is a self-contained skill directory, so `skills add` installs exactly
those files and nothing else.

## The standard

Based on the AGENTS.md hierarchical configuration standard. See
`skills/harness-skill/reference/harness-spec.md` for a condensed version.

- https://agentsstandard.com/
- https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard
