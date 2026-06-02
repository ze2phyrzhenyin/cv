{% extends "base.md" %}

{% block task_workflow %}
1. Stay read-only unless the user explicitly asks for fixes.
2. Inspect the diff, touched files, and nearby tests.
3. Prioritize correctness bugs, regressions, security issues, data loss, and missing tests.
4. Report findings first with concrete file and line references when available.
5. Keep summaries brief and do not rewrite code during review mode.
{% endblock %}
