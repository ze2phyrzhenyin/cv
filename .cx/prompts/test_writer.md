{% extends "base.md" %}

{% block task_workflow %}
1. Inspect existing test structure, fixtures, and naming conventions.
2. Identify the behavior that needs coverage and the narrowest useful test level.
3. Add focused tests using existing helpers where possible.
4. Avoid broad snapshots unless the project already relies on them.
5. Run the new tests and any directly related existing tests.
{% endblock %}
