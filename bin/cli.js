#!/usr/bin/env node
'use strict';

/**
 * Installer for the "harness-skill" agent skill.
 * Copies the skill into an agent skills directory (default: ~/.claude/skills).
 * Zero runtime dependencies — Node built-ins only.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'harness-skill';
const PKG_ROOT = path.join(__dirname, '..');
const SKILL_SRC = path.join(PKG_ROOT, 'skills', SKILL_NAME);

function readPkg() {
  try {
    return JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
  } catch {
    return { name: SKILL_NAME, version: '0.0.0' };
  }
}

const HELP = `
harness-skill — install the "${SKILL_NAME}" agent skill

Usage:
  npx harness-skill [options]
  harness-skill [options]           (after: npm i -g harness-skill)

The skill scaffolds AGENTS.md-standard files into a project. Once installed,
invoke it in a project with /${SKILL_NAME} (Claude Code) or by asking your
agent to "set up AGENTS.md".

Options:
  -p, --project        Install into ./.claude/skills instead of the home dir
  -d, --dir <path>     Install into a custom skills base directory
  -f, --force          Overwrite an existing installation
  -v, --version        Print version
  -h, --help           Show this help

Default install location:
  ~/.claude/skills/${SKILL_NAME}
`;

function parseArgs(argv) {
  const opts = { force: false, project: false, dir: null, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-f' || a === '--force') opts.force = true;
    else if (a === '-p' || a === '--project') opts.project = true;
    else if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '-v' || a === '--version') opts.version = true;
    else if (a === '-d' || a === '--dir') opts.dir = argv[++i];
    else if (a.startsWith('--dir=')) opts.dir = a.slice('--dir='.length);
    else { console.error(`Unknown option: ${a}`); opts.help = true; }
  }
  return opts;
}

function resolveSkillsBase(opts) {
  if (opts.dir) return path.resolve(opts.dir);
  if (opts.project) return path.resolve('.claude', 'skills');
  return path.join(os.homedir(), '.claude', 'skills');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const pkg = readPkg();

  if (opts.version) {
    console.log(pkg.version);
    return;
  }
  if (opts.help) {
    console.log(HELP);
    return;
  }

  if (!fs.existsSync(SKILL_SRC)) {
    console.error(`✖ Skill source not found at ${SKILL_SRC}. Is the package intact?`);
    process.exitCode = 1;
    return;
  }

  const base = resolveSkillsBase(opts);
  const target = path.join(base, SKILL_NAME);

  if (fs.existsSync(target) && !opts.force) {
    console.error(`✖ ${target} already exists.`);
    console.error(`  Re-run with --force to overwrite it.`);
    process.exitCode = 1;
    return;
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(SKILL_SRC, target, { recursive: true });

  console.log(`✔ Installed the "${SKILL_NAME}" skill to:`);
  console.log(`    ${target}`);
  console.log('');
  console.log(`Use it in any project: run /${SKILL_NAME} in Claude Code,`);
  console.log(`or ask your agent to "set up AGENTS.md".`);
}

main();
