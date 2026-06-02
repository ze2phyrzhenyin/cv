# Business Blueprints

Blueprints are packaged business project templates. They turn a repeatable project type into docs, app scaffold, domain skills, task cards, evals, and acceptance checks.

## Smart Menu MVP

`smart-menu-mvp` targets a French restaurant mobile web QR ordering MVP.

It includes:

- product docs
- ADRs
- Next.js and Prisma scaffold
- domain-specific AGENTS rules
- Smart Menu skills
- initial task cards
- local routing eval cases
- acceptance checklist

Version 1 implements ordering and order receiving only. It does not implement online payment, POS integration, full cash register behavior, complex AI, delivery, loyalty, invoices, or reporting.

## Commands

```bash
cx blueprints
cx blueprint-show smart-menu-mvp
cx blueprint-validate smart-menu-mvp
cx blueprint-init smart-menu-mvp ../smart-menu-mvp
cx blueprint-kickoff smart-menu-mvp ../smart-menu-mvp "法国餐厅移动端 Web 扫码点餐系统" --profile strict
```

Write operations require `--yes`. Overwrites require `--force --backup`.

## Adding Another Blueprint

Create a directory under package defaults:

```text
src/cx/resources/defaults/blueprints/<name>/
```

Required files:

- `blueprint.yaml`
- `README.md`
- `AGENTS.fragment.md`
- `project/*.md.j2`
- `app/**`
- `tasks/*.md.j2`
- `evals/*.yaml`
- `skills/<skill>/SKILL.md`

The blueprint should define:

- recommended profile
- project type
- stack
- includes
- non-goals
- safety boundaries
- acceptance checklist

## Rules

- Default mode must be dry-run.
- Do not install dependencies during generation.
- Do not initialize git during generation.
- Do not call Codex.
- Do not call gh.
- Do not push or create PRs.
- Do not merge, release, or deploy.
- Do not write `.env`; `.env.example` is allowed.
- Do not write real secrets.
