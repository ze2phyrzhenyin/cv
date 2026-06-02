{% extends "base.md" %}

{% block task_workflow %}
1. Clarify the expected behavior and user-visible contract from the request and codebase.
2. Draft a short implementation plan before editing.
3. Implement the smallest coherent feature slice.
4. Add or update tests for the new behavior.
5. Update docs only when public behavior, setup, or operations changed.
6. Run relevant tests and report residual gaps.
{% endblock %}
