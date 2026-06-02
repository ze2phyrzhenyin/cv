# Skill Development

Skills live in directory form:

```text
<skills-root>/<skill-name>/SKILL.md
```

Project-installed skills normally live under `.agents/skills`. Framework built-ins live under `skills/` and package resources.

## Structure

`SKILL.md` must start with YAML frontmatter:

- `name`
- `description`

The `name` should match the directory name. The description should say when to use the skill, when not to use it, and key trigger scenarios.

The body must include:

- Goal
- Trigger examples
- Do not use when
- Workflow
- Boundaries
- Required output

## Lint Rules

Run:

```bash
cx skill-lint .agents/skills
cx skill-lint .agents/skills --strict
```

Lint checks required metadata, required sections, boundary language, and dangerous suggestions. Strict mode also checks description length, trigger count, workflow steps, and required output count.

## Testing Fixtures

`cx skill-test <skill>` reads YAML cases and validates that router and compiler select the expected skill and include expected prompt text.

Fixture format:

```yaml
skill: bug-fix-minimal
cases:
  - input: "修一下登录失效"
    expected_intent: bug_fix
    expected_skill: bug-fix-minimal
    must_include:
      - "Selected Skill Instructions"
      - "Required Final Output"
```

`cx skill-test` does not call Codex.

## Packaging

`cx skill-pack <skill>` creates a local tar.gz archive. It does not upload, publish, install into remote projects, or access the network.

## Remote Installation

Remote skill installation is not implemented. Do not install skills from URLs or registries.
