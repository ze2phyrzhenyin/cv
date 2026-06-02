{% extends "base.md" %}

{% block task_workflow %}
1. Inspect the failing CI signal, command, or workflow configuration available locally.
2. Reproduce the failing check locally when possible.
3. Isolate whether the failure is code, test, dependency, environment, or workflow configuration.
4. Apply the smallest fix that addresses the failed check.
5. Re-run the failed or closest equivalent check and report exact results.
{% endblock %}
