# M5 Prompt Log

Member: Reyes, Diem Andreif F.
Role: QA & Documentation Lead

## Entry 1

Date: 2026-05-02
Sprint: 1
PR: PR-01
Tool / AI Used: AI Assistant

Prompt:

```text
Create a QA test case template for the revised MVP covering OAuth login, first-time profile setup, and the feed shell. Store it in docs/test-cases/README.md.
```

Output Used:
- Test case format template with required fields (TC-XXX, Feature, Role, Preconditions, etc.).
- Required coverage list mapped to Sprint 1 features.

Changes Made After Review:
- Adjusted the "Required Coverage" to explicitly include role restrictions and badge visibility for later sprints.

Reflection:
- What helped? Having the MVP constraints clearly defined helped limit the test cases to only OAuth and feed shell without testing removed features like messaging.
- What did you verify? Ensured the format matched the expected repo standards for QA documentation.
- What did you change manually? Added placeholders for related issues/PRs.

## Entry 2

Date: 2026-05-03
Sprint: 1
PR: PR-02
Tool / AI Used: AI Assistant

Prompt:

```text
Update the README.md to reflect the revised project tech stack (React, Vite, Supabase, Tailwind) and the OAuth-only authentication flow. Remove any old references to username/password or messaging.
```

Output Used:
- The updated README structure with environment setup instructions.
- The revised project summary.

Changes Made After Review:
- Formatted the prerequisites section to highlight Node.js and Supabase CLI.

Reflection:
- What helped? The AI quickly dropped the out-of-scope items (passwords, conversations).
- What did you verify? Verified the setup steps against a clean clone.
- What did you change manually? Clarified the local development server commands.

## Entry 3

Date: 2026-05-03
Sprint: 1
PR: PR-02
Tool / AI Used: AI Assistant

Prompt:

```text
Draft a CONTRIBUTING.md file based on our ROLE_PR_MAP.md. It needs to include branch naming rules, PR title formats, and our review policy.
```

Output Used:
- Branch prefix rules (feat/, fix/, docs/, etc.).
- The PR checklist requirements.

Changes Made After Review:
- Added explicit instructions about using the `.github/pull_request_template.md`.

Reflection:
- What helped? AI perfectly extracted the branching rules from our PR map.
- What did you verify? Checked that the target branch rule strictly specified `dev`.
- What did you change manually? Emphasized that direct commits to `main` are prohibited.

## Entry 4

Date: 2026-05-05
Sprint: 1
PR: PR-03
Tool / AI Used: AI Assistant

Prompt:

```text
Generate a Sprint 1 documentation checklist to ensure all M1-M5 roles have submitted their required documentation artifacts before we close Sprint 1.
```

Output Used:
- Role-by-role checklist of documentation deliverables.

Changes Made After Review:
- Mapped each item exactly to the SPRINT_DELIVERABLES.md list.

Reflection:
- What helped? Quick aggregation of the docs/ artifacts across the 5 roles.
- What did you verify? Checked the repo to see if the files actually existed.
- What did you change manually? Formatted it as a markdown checklist for easy tracking.

## Entry 5

Date: 2026-05-05
Sprint: 1
PR: PR-03
Tool / AI Used: AI Assistant

Prompt:

```text
Review the test cases prepared for Sprint 1 (OAuth, Profile Setup, Feed Shell). Ensure they meet the acceptance criteria and test both successful paths and edge cases.
```

Output Used:
- Refined test steps and expected results for the OAuth flow.

Changes Made After Review:
- Added specific checks for what happens when a user tries to access the feed before completing the first-time setup.

Reflection:
- What helped? The AI suggested edge cases I hadn't fully detailed (e.g., interrupted profile setup).
- What did you verify? Verified that the test cases align with the Acceptance Criteria document.
- What did you change manually? Condensed the steps to make them quicker to execute during manual QA.
