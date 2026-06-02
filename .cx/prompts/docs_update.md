{% extends "base.md" %}

{% block task_workflow %}
1. Identify the exact documentation requested or affected by the change.
2. Check current behavior before editing docs.
3. Update only the relevant documentation.
4. Avoid documenting behavior that is not implemented.
5. Run docs lint or formatting checks when available.
{% endblock %}
