# Codex Task

## User Request

{{ user_prompt }}

## Route

- intent: {{ route.intent }}
- skill: {{ route.skill }}
- mode: {{ route.mode }}
- risk_level: {{ route.risk_level }}
- sandbox: {{ route.sandbox }}
- approval: {{ route.approval }}
- docs_policy: {{ route.docs_policy }}
- tests_policy: {{ route.tests_policy }}
- git_policy: {{ route.git_policy }}
- requires_human_approval: {{ route.requires_human_approval | join(", ") if route.requires_human_approval else "none" }}
- reasoning_summary: {{ route.reasoning_summary }}

## Execution Boundaries

- Only handle the scope of this task.
- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- push, PR, merge, release, and deploy require explicit approval.

## Selected Skill Instructions

{% if selected_skill is string %}
{{ selected_skill }}
{% else %}
- name: {{ selected_skill.name }}
- description: {{ selected_skill.description }}
- path: {{ selected_skill.path }}

{{ selected_skill.body }}
{% endif %}

## Task Workflow

{% block task_workflow %}
1. Inspect the relevant files in read-only mode first.
2. Summarize what the task appears to require and identify ambiguity.
3. If edits are needed, propose the smallest safe change before proceeding.
4. Verify with the narrowest relevant checks available.
{% endblock %}

## Required Final Output

- Summary
- Files changed
- Tests added or updated
- Docs decision
- Commands run and results
- Risks
- Next action
