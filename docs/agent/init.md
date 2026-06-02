# Project Init

Use `cx init` to install the standard local AI development workflow into another project.

Default mode is dry-run. It reports files that would be created, skipped, or conflicted and writes nothing unless `--yes` is supplied.

Installed files include:

- `AGENTS.md`
- `.cx/config.yaml`
- `.cx/policies/*.yaml`
- `.cx/prompts/*.md`
- `.agents/skills/<skill>/SKILL.md`
- `docs/agent/*.md`
- `.github/pull_request_template.md` only when requested

Existing files are not overwritten unless `--force` is supplied. Use `--backup` with `--force` to keep a backup copy before overwriting.

`cx init` does not initialize git, push, create PRs, merge, release, or deploy.
