{% extends "base.md" %}

{% block task_workflow %}
1. Identify the dependency, current version, target version, and migration notes.
2. Plan compatibility checks before editing dependency files.
3. Update only the dependency and required compatibility code.
4. Run the full relevant test suite for the affected surface.
5. Update setup, deployment, or migration docs if installation or runtime behavior changed.
6. Do not publish, release, or deploy without explicit approval.
{% endblock %}
