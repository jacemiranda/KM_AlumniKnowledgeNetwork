# Prompt Templates

Use these templates when asking an AI agent to work on a planned PR.

All templates assume the repo already contains the source-of-truth docs and that the agent should follow them strictly.

## General Rule

Always start with:

`Read AGENTS.md first.`

Then identify:

- your member role
- sprint number
- PR number
- exact PR map reference

## M1 - Project Manager / Scrum Master

```text
Read AGENTS.md first.

I am M1 Project Manager / Scrum Master.
Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
If needed, use docs/decision-log.md and docs/standups/README.md.
Implement only this PR.
```

## M2 - Full Stack Developer / Technical Lead

```text
Read AGENTS.md first.

I am M2 Full Stack Developer / Technical Lead.
Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md, docs/project/MVP.md, and docs/project/TECH_STACK.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
If architecture decisions are involved, use docs/adr/README.md.
Implement only this PR.
```

## M3 - UX/UI Designer / Front-End Contributor

```text
Read AGENTS.md first.

I am M3 UX/UI Designer / Front-End Contributor.
Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md and docs/project/MVP.md.
If needed, use docs/project/SECI_COMMUNITIES_CONTEXT.md for content structure and knowledge-flow alignment.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
Implement only this PR.
```

## M4 - Knowledge Management Analyst

```text
Read AGENTS.md first.

I am M4 Knowledge Management Analyst.
Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md, docs/project/MVP.md, and docs/project/SECI_COMMUNITIES_CONTEXT.md.
If the task affects project reasoning or scope, use docs/decision-log.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md if a PR draft is needed.
Implement only this PR.
```

## M5 - QA & Documentation Lead

```text
Read AGENTS.md first.

I am M5 QA & Documentation Lead.
Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md and docs/project/ACCEPTANCE_CRITERIA.md.
If needed, use docs/test-cases/README.md, README.md, and docs/prompt-logs/README.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
Implement only this PR.
```

## If You Want the Agent to Open a Draft PR

Add this at the end of any template:

```text
When done, prepare and open a draft PR to dev using the exact title and PR template.
```

## If You Want Planning First

Add this instead:

```text
Do not implement yet. First summarize the task, affected files, and planned steps based on the repo docs.
```

## Short Reliable Prompt

```text
Read AGENTS.md first.
I am M<member>. Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Use the exact branch, PR title, target branch, and PR template.
Implement only this PR.
```
