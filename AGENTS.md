# Alumni Knowledge Network Agent Instructions

These instructions are for AI agents working in this repository.

## Read First

Before doing any implementation, documentation, test, database, or PR task, read these files in order:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. `docs/project/TECH_STACK.md`
5. `docs/project/SECI_COMMUNITIES_CONTEXT.md`
6. `.github/pull_request_template.md`

## Document Usage by Phase

Use the project documents in phases instead of reading everything at once.

### Before Building

- `AGENTS.md`
- `docs/project/ROLE_PR_MAP.md`
- `docs/project/SPRINT_DELIVERABLES.md`
- `docs/project/MVP.md`

Purpose:

- identify the exact PR
- understand sprint expectations
- understand product behavior and scope
- follow repo rules before touching code

### While Building

- `docs/project/TECH_STACK.md`
- `docs/project/SECI_COMMUNITIES_CONTEXT.md`
- `docs/adr/README.md`

Purpose:

- stay inside the approved stack
- preserve SECI, feed, field, tag, and moderation behavior
- document important technical decisions when needed

### While Documenting and Testing

- `docs/test-cases/README.md`
- `docs/prompt-logs/README.md`
- `docs/decision-log.md`

Purpose:

- create QA evidence
- record AI usage
- record important project decisions

### Before Merging

- `docs/project/ROLE_PR_MAP.md`
- `.github/pull_request_template.md`
- `CONTRIBUTING.md`
- `docs/project/ACCEPTANCE_CRITERIA.md`

Purpose:

- confirm the exact PR title and branch again
- format the PR correctly
- follow branch, review, and merge rules
- verify the work is acceptable and runnable


## Stitch Usage Rule

The Stitch workspace is used as a UI and design reference only.

Source of truth order:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. existing implemented code
5. Stitch workspace for UI reference only

Rules:

- M2 and other technical roles must not use Stitch as the source of truth for backend logic, database design, architecture, or PR scope.
- M2 may use Stitch only when UI-facing data, labels, flow, or response shape need visual alignment.
- M3 may use Stitch as the main design workspace for UI implementation.
- If Stitch conflicts with the MVP, sprint deliverables, or implemented behavior, surface the conflict clearly instead of guessing.

## Commit Messages

Use short, clear commit messages:

- `feat: add post creation and comments flow`
- `db: add profiles fields and skills schema`
- `docs: add authority score guidelines`
- `test: add final page-map QA checklist`

## Source of Truth Order

For implementation work, follow this priority order:

1. `docs/project/ROLE_PR_MAP.md` - exact PR owner, number, title, branch, target branch, and deliverable.
2. `docs/project/SPRINT_DELIVERABLES.md` - sprint outputs, gates, and role expectations.
3. `docs/project/MVP.md` - product behavior, page map, SECI usage, and feature scope.
4. `docs/project/ACCEPTANCE_CRITERIA.md` - final quality and runnable-app checks.

If there is a conflict:

- PR title, branch, and owner come from `ROLE_PR_MAP.md`.
- Sprint scope comes from `SPRINT_DELIVERABLES.md`.
- Product behavior comes from `MVP.md`.
- Final release checks come from `ACCEPTANCE_CRITERIA.md`.

## Project Summary

Alumni Knowledge Network is a React + Supabase web app for alumni-student knowledge sharing through a universal feed, posts, comments, voting, leaderboard visibility, badges, and moderation tools. The system uses the SECI knowledge-management model as its conceptual backbone.

Core roles:

- Admin
- Moderator
- End User - Student
- End User - Alumni

Core modules:

- OAuth Authentication
- First-Time Profile Setup
- Universal Feed
- Posts and Comments
- Search
- Alumni / Mentors Discovery
- Voting and Authority Score
- Leaderboard
- Notifications Modal
- Badges
- User and Content Moderation
- Basic Analytics

## Required Tech Stack

Use the approved revised MVP stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Supabase
- Vercel
- Vitest
- React Testing Library
- Playwright

Do not switch frameworks or backend platforms unless the user explicitly asks.

## Scope Boundaries

The revised MVP does not include:

- private messaging
- conversations/messages tables
- password-based authentication
- complex community approval workflow
- video calls
- recommendation engine
- advanced real-time systems

Do not implement these unless the user explicitly requests them.

## Branch Rules

- Work from a feature branch.
- Target PRs to `dev` unless the assigned deliverable says otherwise.
- Never merge directly to `main`.
- Use module-sized PRs.
- Do not bundle unrelated work.

Allowed branch prefixes:

- `feat/`
- `fix/`
- `db/`
- `docs/`
- `test/`
- `chore/`

## Pull Request Title Rule

When creating a pull request, use the exact PR number, title, and branch from `docs/project/ROLE_PR_MAP.md`.

Do not invent a new PR title if the task matches a listed sprint deliverable.

Required GitHub PR title format:

`PR-XX: Exact Title From ROLE_PR_MAP`

Example:

`PR-02: Posts Comments and Tags`

## Pull Request Body Rule

Use `.github/pull_request_template.md` exactly.

The PR body must contain:

- Branch
- What Changed?
- Why Was It Needed?
- How Do I Test It?

## Working Rules

- Implement only the assigned PR.
- Read the relevant MVP and sprint sections before editing.
- Preserve existing user work.
- Do not commit secrets.
- Update documentation when behavior changes.
- Add tests or QA evidence when possible.
- Keep changes focused and reviewable.

## Final Checks Before PR

Before opening a draft PR:

- Confirm the branch name matches `ROLE_PR_MAP.md`.
- Confirm the title matches `ROLE_PR_MAP.md`.
- Confirm the PR body follows `.github/pull_request_template.md`.
- Confirm the target branch is `dev`.
- Mention the sprint, role, and planned PR in the PR body if useful.
- Run relevant checks or state what could not be run.

## Stitch API & Usage Rules

The Stitch workspace is used as a UI reference for most roles, but functions as an automated generation tool for M3 (UX/UI Designer) tasks.

Source of truth order:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. existing implemented code
5. Stitch UI outputs

Rules:

- **M3 Automation Authorization:** When executing M3 UI implementation PRs (e.g., `feat/ui-*`), the AI Agent is explicitly authorized to read Stitch API credentials from `.env.local`. The Agent must send the provided UI prompts to the Stitch API, retrieve the raw HTML/Tailwind response, and strictly refactor it into modular React/TypeScript components.
- M2 and other technical roles must not use Stitch as the source of truth for backend logic, database design, architecture, or PR scope.
- M2 may use Stitch only when UI-facing data, labels, flow, or response shape need visual alignment.
- When refactoring Stitch HTML, always strip custom CSS and strictly use Tailwind CSS utility classes. Ensure mobile-first responsiveness (`md:`, `lg:` breakpoints).
- If Stitch outputs conflict with the MVP, sprint deliverables, or implemented behavior, surface the conflict clearly instead of guessing.