# M5 Prompt Log

Member: M5 - Reyes, Diem Andreif F.
Role: QA & Documentation Lead

## Entry 1

Date: 2025-05-05
Sprint: 1
PR: PR-01: Sprint 1 OAuth Profile Feed Checklist
Tool / AI Used: Gemini (Antigravity)

Prompt:

```text
Read AGENTS.md first.
I am M5 QA & Documentation Lead.
Work on Sprint 1 PR-01 from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md and docs/project/ACCEPTANCE_CRITERIA.md.
If needed, use docs/test-cases/README.md, README.md, and docs/prompt-logs/README.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
Implement only this PR.
After implementation, draft the matching CHANGELOG.md entry based only on completed work in this branch.
Keep it short and factual.
```

Output Used:

- 20 acceptance test cases covering OAuth login, route protection, first-time profile setup, feed shell, and cross-cutting checks.
- Test cases follow the format defined in `docs/test-cases/README.md` (TC-001 through TC-020).
- Each test case includes feature, role, sprint, priority, preconditions, steps, and expected result fields.
- CHANGELOG entry drafted for this branch.
- M5 prompt log created.

Changes Made After Review:

- Verified test cases against actual implemented source code in `src/features/auth/`, `src/features/setup/`, `src/features/feed/`, `src/features/shell/`, and `src/app/router.tsx`.
- Confirmed field names, form validation behavior, route guards, and redirect logic match the codebase.
- Priority levels assigned based on MVP acceptance criteria from `docs/project/ACCEPTANCE_CRITERIA.md`.

Reflection:

- What helped? Reading the actual source code before writing test cases ensured accuracy. The test case template in `docs/test-cases/README.md` provided a consistent structure.
- What did you verify? Each test case step references real component behavior observed in the codebase (e.g., SetupGuard redirect logic, LoginPage error display, form validation messages).
- What did you change manually? Adjusted test case priorities based on the acceptance criteria. Added cross-cutting checks for catch-all routes and responsive layout that were not in the initial generation.
