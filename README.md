# harness-skill

An agent skill that scaffolds a complete set of **AGENTS.md-standard** files into a project —
the public "agent-native repo" spec promoted by Harness.

一个 agent skill,为项目生成一整套符合 **AGENTS.md 标准**的文件——即 Harness 推广的
"agent-native repo"(面向智能体的仓库)公开规范。

It handles two cases / 它覆盖两种场景:

- **Empty project** — asks about your frontend/backend tech stack interactively, then generates
  a spec-compliant skeleton with `TODO:` placeholders.
  **空项目** —— 交互式询问前后端技术栈,生成带 `TODO:` 占位符的合规骨架。
- **Existing project** — auto-detects your stack, build/test commands, and layout, then generates
  populated files.
  **已有项目** —— 自动探测技术栈、构建/测试命令和目录结构,生成填充好的文件。

## Install / 安装

### Via skills.sh (recommended) / 通过 skills.sh(推荐)

```bash
npx skills add ZhaoJiSen/harness-skill
```

This installs the skill into `~/.claude/skills/harness-skill`. Then, in any project, invoke it
with `/harness-skill` in Claude Code (or just ask your agent to "set up AGENTS.md").

该命令会把 skill 安装到 `~/.claude/skills/harness-skill`。之后在任意项目里用 `/harness-skill`
触发(或直接让 agent "生成 AGENTS.md")。

### From source (local) / 从源码本地安装

Clone this repo and run the bundled zero-dependency installer:
克隆本仓库,运行内置的零依赖安装器:

```bash
git clone git@github.com:ZhaoJiSen/harness-skill.git
cd harness-skill
node bin/cli.js
```

Installer options / 安装器选项:

```
-p, --project      Install into ./.claude/skills instead of the home dir
                   安装到当前项目的 ./.claude/skills,而非用户主目录
-d, --dir <path>   Install into a custom skills base directory
                   安装到自定义的 skills 基目录
-f, --force        Overwrite an existing installation
                   覆盖已存在的安装
-v, --version      Print version / 打印版本
-h, --help         Show help / 显示帮助
```

## What it generates / 生成什么

```
<project root>/
├── AGENTS.md        # active session rules (canonical touchpoint), 4 core sections
│                    # 活动会话规则(规范入口),4 个核心段落
├── .agents/
│   └── AGENTS.md    # committed team base conventions / 团队基线约定
├── llms.txt         # project PRD: goals, architecture, tech stack, scope
│                    # 项目 PRD:目标、架构、技术栈、范围
├── CLAUDE.md    -> AGENTS.md   (symlink / 软链)
├── GEMINI.md    -> AGENTS.md   (symlink / 软链)
└── .cursorrules -> AGENTS.md   (symlink / 软链)
```

## Repo layout / 仓库结构

```
skills/harness-skill/
├── SKILL.md                  # the skill's instructions / skill 主流程指令
├── templates/                # skeletons for AGENTS.md, .agents/AGENTS.md, llms.txt
│                             # AGENTS.md / .agents/AGENTS.md / llms.txt 的骨架模板
└── reference/harness-spec.md # condensed spec, loaded on demand / 精简版规范,按需加载
bin/cli.js                    # zero-dependency installer / 零依赖安装器
```

`skills/harness-skill/` is a self-contained skill directory, so `skills add` installs exactly
those files and nothing else.

`skills/harness-skill/` 是自包含的 skill 目录,因此 `skills add` 只会安装这些文件,不带其他内容。

## The standard / 相关标准

Based on the AGENTS.md hierarchical configuration standard. See
`skills/harness-skill/reference/harness-spec.md` for a condensed version.

基于 AGENTS.md 分层配置标准。精简版见
`skills/harness-skill/reference/harness-spec.md`。

- https://agentsstandard.com/
- https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard
