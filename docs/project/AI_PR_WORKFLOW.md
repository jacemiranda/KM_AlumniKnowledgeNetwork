# AI PR Workflow

Use this workflow when asking an AI agent to complete a planned PR.

## Before Prompting

1. Find your exact PR in `docs/project/ROLE_PR_MAP.md`.
2. Confirm the sprint context in `docs/project/SPRINT_DELIVERABLES.md`.
3. Confirm product behavior in `docs/project/MVP.md`.
4. Copy the correct role template from `docs/project/PROMPT_TEMPLATES.md`.

## Base Prompt Template

`I am M<member number> <role>. Work on Sprint <number> PR-<number> from docs/project/ROLE_PR_MAP.md. Use the exact branch, PR title, target branch, and PR body format. Implement only this PR.`

## Example

`I am M2 Full Stack Developer. Work on Sprint 2 PR-01 from docs/project/ROLE_PR_MAP.md. Use the exact branch, PR title, target branch, and PR body format. Implement only this PR.`

## Role-Based Prompt Templates

Use `docs/project/PROMPT_TEMPLATES.md` as the copy-paste source for:

- M1 Project Manager / Scrum Master
- M2 Full Stack Developer / Technical Lead
- M3 UX/UI Designer / Front-End Contributor
- M4 Knowledge Management Analyst
- M5 QA & Documentation Lead

## Agent Steps

The AI agent should:

1. Read `AGENTS.md`.
2. Read `docs/project/ROLE_PR_MAP.md`.
3. Find the exact sprint, member, and PR.
4. Read relevant sections of `docs/project/SPRINT_DELIVERABLES.md`.
5. Read relevant product context from `docs/project/MVP.md`.
6. Create or switch to the exact branch.
7. Implement only the assigned deliverable.
8. Run relevant tests or checks.
9. Prepare the PR body using `.github/pull_request_template.md`.
10. Open a draft PR to `dev`.

## Do Not

- Do not invent PR titles.
- Do not change the target branch unless asked.
- Do not bundle multiple planned PRs together.
- Do not add out-of-scope features such as private messaging, video calls, or recommendation engine.
- Do not change unrelated files.
- Do not commit secrets.
- Do not skip the PR template.

## Recommended Team Workflow

1. Member identifies the assigned PR.
2. Member copies the correct role template from `PROMPT_TEMPLATES.md`.
3. Agent reads `AGENTS.md` and source-of-truth project docs.
4. Agent implements only the assigned PR.
5. Agent prepares a PR using the exact title, branch, target branch, and PR template.
6. Teammate reviews before merge to `dev`.
