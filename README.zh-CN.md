# harness-skill

[English](./README.md) | 中文

一个 agent skill,为项目生成一整套符合 **AGENTS.md 标准**的文件——即 Harness 推广的
"agent-native repo"(面向智能体的仓库)公开规范。

它覆盖两种场景:

- **空项目** —— 交互式询问前后端技术栈,生成带 `TODO:` 占位符的合规骨架。
- **已有项目** —— 自动探测技术栈、构建/测试命令和目录结构,生成填充好的文件。

## 安装

### 通过 skills.sh(推荐)

```bash
npx skills add ZhaoJiSen/harness-skill
```

该命令会把 skill 安装到 `~/.claude/skills/harness-skill`。之后在任意项目里用 `/harness-skill`
触发(或直接让 agent "生成 AGENTS.md")。

### 从源码本地安装

克隆本仓库,运行内置的零依赖安装器:

```bash
git clone git@github.com:ZhaoJiSen/harness-skill.git
cd harness-skill
node bin/cli.js
```

安装器选项:

```
-p, --project      安装到当前项目的 ./.claude/skills,而非用户主目录
-d, --dir <path>   安装到自定义的 skills 基目录
-f, --force        覆盖已存在的安装
-v, --version      打印版本
-h, --help         显示帮助
```

## 生成什么

```
<项目根目录>/
├── AGENTS.md        # 活动会话规则(规范入口),4 个核心段落
├── .agents/
│   └── AGENTS.md    # 团队基线约定
├── llms.txt         # 项目 PRD:目标、架构、技术栈、范围
├── CLAUDE.md    -> AGENTS.md   (软链)
├── GEMINI.md    -> AGENTS.md   (软链)
└── .cursorrules -> AGENTS.md   (软链)
```

## 仓库结构

```
skills/harness-skill/
├── SKILL.md                  # skill 主流程指令(agent 遵循的步骤)
├── templates/                # AGENTS.md / .agents/AGENTS.md / llms.txt 的骨架模板
└── reference/harness-spec.md # 精简版规范,按需加载
bin/cli.js                    # 零依赖安装器
```

`skills/harness-skill/` 是自包含的 skill 目录,因此 `skills add` 只会安装这些文件,不带其他内容。

## 相关标准

基于 AGENTS.md 分层配置标准。精简版见
`skills/harness-skill/reference/harness-spec.md`。

- https://agentsstandard.com/
- https://www.harness.io/blog/the-agent-native-repo-why-agents-md-is-the-new-standard
