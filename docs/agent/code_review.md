# Code Review Guidance

Use read-only review for PR or diff risk checks.

- Prioritize correctness, security, data loss, regressions, and missing tests.
- Avoid pure style comments unless they hide a real issue.
- Cite files and lines when available.
- Do not modify files during review mode.

## `cx pr-review`

Use `cx pr-review` for read-only review of the current branch diff or a specified PR.

Findings must include:

- severity
- file
- evidence
- impact
- suggested fix

Do not output pure style suggestions unless they represent real risk. Cover correctness, regression, security, tests, docs, maintainability, and obvious performance risks.
