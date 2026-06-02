{% extends "base.md" %}

{% block task_workflow %}
1. Establish the current behavior and relevant tests before changing structure.
2. Plan the refactor boundaries and keep behavior unchanged.
3. Make small mechanical changes that preserve public contracts.
4. Avoid mixing feature work or bug fixes into the refactor.
5. Run behavior-guarding tests and report any coverage gaps.
{% endblock %}
