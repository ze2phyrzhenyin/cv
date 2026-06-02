{% extends "base.md" %}

{% block task_workflow %}
1. Stay read-only and inspect only the provided diff context.
2. Look for concrete bugs, regressions, security risks, data loss, and missing tests.
3. Do not report pure style preferences unless they hide a real defect.
4. Put findings first and cite files or hunks when available.
5. If no real issues are found, say so and note residual test or review risk.
{% endblock %}
