{% extends "base.md" %}

{% block task_workflow %}
1. Reproduce or localize the bug from the reported symptom.
2. Identify the smallest code path responsible for the failure.
3. Make the minimal fix needed to restore expected behavior.
4. Add or update a regression test that fails without the fix when practical.
5. Run the targeted regression test first, then broader relevant tests if risk justifies it.
6. Do not commit, push, or open a PR unless the required approval gate has been explicitly cleared.
{% endblock %}
