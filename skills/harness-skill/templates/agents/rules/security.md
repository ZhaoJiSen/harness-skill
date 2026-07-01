# Security Baseline

> Loaded via `.agents/AGENTS.md`. Applies to every change, regardless of stack.

- Never commit secrets; use environment variables / a secrets manager.
- Keep a committed `.env.example`; read config from the environment, never hardcode it.
- Validate and sanitize all external input.
- Use parameterized queries; never build SQL by string concatenation.
- Pin dependency versions; flag unusual or typosquatting-looking package names.
- Do not add authentication-, authorization-, or access-control-affecting changes without an
  explicit note in the change describing the impact.
- TODO(confirm): project-specific security constraints (auth model, data classification, PII handling).
