# Contributing Guide

This guide explains how team members and AI agents should work on Alumni Knowledge Network.

## Before You Start

Read these documents in order before making any changes:

1. `AGENTS.md` — AI agent rules and source-of-truth priority.
2. `docs/project/ROLE_PR_MAP.md` — Your assigned PR number, title, branch, and target.
3. `docs/project/SPRINT_DELIVERABLES.md` — Sprint outputs, gates, and role expectations.
4. `docs/project/MVP.md` — Product behavior, page map, and feature scope.

## Branch Flow

```
feature branch → PR → dev → release PR → main
```

Rules:

- Create a branch for each planned PR.
- Target all feature PRs to `dev`.
- Do not merge directly to `main`.
- Keep PRs focused on one planned deliverable.
- Ask at least one teammate to review before merging.

## Branch Naming

Use the exact branch listed in `docs/project/ROLE_PR_MAP.md`.

Allowed prefixes:

| Prefix | Use For |
|---|---|
| `feat/` | New features and functionality |
| `fix/` | Bug fixes |
| `db/` | Database schema and migration work |
| `docs/` | Documentation changes |
| `test/` | Test cases and QA artifacts |
| `chore/` | Repo maintenance, config, and tooling |

Examples:

- `feat/project-scaffold-oauth-shell`
- `db/profile-field-skill-feed-schema`
- `feat/posts-comments-and-tags`
- `test/sprint1-oauth-profile-feed-checklist`
- `docs/readme-contributing-revised`

## Pull Request Titles

Use the exact title from `docs/project/ROLE_PR_MAP.md`.

Format:

```
PR-XX: Exact Title
```

Example:

```
PR-02: README Contributing Revised
```

Do not invent PR titles if the task matches a listed sprint deliverable.

## Pull Request Body

Use `.github/pull_request_template.md`. Every PR must contain:

- **Branch** — the branch name
- **What Changed?** — list of changes with sub-details
- **Why Was It Needed?** — reason, problem solved, and sprint alignment
- **How Do I Test It?** — steps to verify, including role-based and edge cases

## Commit Messages

Use short, clear commit messages with a type prefix:

```
feat: add post creation and comments flow
db: add profiles fields and skills schema
docs: revise README with setup guide and contributor notes
test: add Sprint 1 acceptance test cases
fix: correct auth redirect loop on expired session
chore: update eslint config for TypeScript strict mode
```

## Code and File Rules

- Do not commit secrets (`.env`, API keys, tokens). Use `.env.example` for templates.
- Do not bundle unrelated work in a single PR.
- Update documentation when behavior changes.
- Add tests or QA evidence when possible.
- Preserve existing work from other contributors.
- Follow the approved tech stack in `docs/project/TECH_STACK.md`.

## Supabase and Database Changes

- Commit schema changes as SQL migration files in `db/migrations/`.
- Number migration files sequentially (e.g., `006_next_change.sql`).
- Include RLS policies in migration files where applicable.
- Verify migrations against a Supabase project before marking as ready.
- Database and RLS work should be committed in `db/` PRs and verified before UI features depend on them.

## Review Checklist

Reviewers should check:

- [ ] The PR matches the assigned deliverable in `ROLE_PR_MAP.md`.
- [ ] The branch and title match `ROLE_PR_MAP.md`.
- [ ] The change does not include unrelated work.
- [ ] The PR includes testing or QA evidence.
- [ ] No secrets are committed.
- [ ] UI changes are accessible and responsive.
- [ ] Supabase changes include RLS and policy considerations.
- [ ] The PR body follows `.github/pull_request_template.md`.
- [ ] The target branch is `dev`.

## AI Agent Usage

When asking an AI agent for help, include:

- Your member number and role (e.g., M5 QA & Documentation Lead).
- Sprint number and PR number.
- Branch name from `ROLE_PR_MAP.md`.
- Whether the agent should implement, test, document, or prepare a draft PR.
- References to relevant docs the agent should read.

Example:

```
I am M5 QA & Documentation Lead.
Work on Sprint 1 PR-02 from docs/project/ROLE_PR_MAP.md.
Read the relevant sections of docs/project/SPRINT_DELIVERABLES.md and docs/project/ACCEPTANCE_CRITERIA.md.
Use the exact branch, PR title, target branch, and .github/pull_request_template.md.
Implement only this PR.
```

## Prompt Logs

Each member must keep a prompt log showing how AI assistance was used. Store logs in `docs/prompt-logs/` using the naming convention `m<number>-prompt-log.md`. See `docs/prompt-logs/README.md` for the required template and minimum entry counts.

## QA and Test Cases

Store QA test cases in `docs/test-cases/`. Follow the format defined in `docs/test-cases/README.md`. Each test case must include:

- Feature, Role, Sprint, Priority
- Preconditions and Steps
- Expected Result, Actual Result, Status
- Evidence and Related Issue / PR

## Running Checks Before PR

Before opening a draft PR, run:

```bash
npm run verify:deploy
```

This runs lint, Vitest tests, and the production build. Also confirm:

- [ ] Branch name matches `ROLE_PR_MAP.md`.
- [ ] PR title matches `ROLE_PR_MAP.md` exactly (`PR-XX: Exact Title`).
- [ ] PR body follows `.github/pull_request_template.md`.
- [ ] Target branch is `dev`.
- [ ] No `.env` files or secrets are committed.
