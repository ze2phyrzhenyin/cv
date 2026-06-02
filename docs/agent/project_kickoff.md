# Project Kickoff

Use `cx project-kickoff` to create planning documents before implementation starts.

## Documents

Generated docs:

- `docs/project/PROJECT_BRIEF.md`
- `docs/project/ROADMAP.md`
- `docs/project/ARCHITECTURE.md`
- `docs/project/TASKS.md`
- `docs/project/RISKS.md`
- `docs/adr/0001-initial-direction.md`

Default mode is dry-run. Use `--yes` to write files. Use `--force --backup` before overwriting existing planning docs.

## ADR Rules

Use ADRs for material architecture decisions. Keep the first ADR proposed until the team confirms the project direction.

Each ADR should include:

- Status
- Context
- Decision
- Consequences

## Task Cards

Use `cx task-new` for local execution cards. A task card records route, skill, risk, sandbox, approval, acceptance criteria, verification, docs decision, and risks.

`cx task-new` does not execute the task.

## Suggested Flow

1. Run `cx init <project> --profile strict --yes`.
2. Run `cx project-kickoff "project idea" --target <project> --yes`.
3. Create the first task with `cx task-new`.
4. Review with `cx readiness --target <project>`.
5. Use `cx dry-run` or `cx compile` before any guarded execution.

Do not introduce merge, release, or deploy automation as part of kickoff.
