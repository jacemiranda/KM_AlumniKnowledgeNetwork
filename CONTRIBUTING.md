# Contributing Guide

This guide explains how team members should work on Alumni Knowledge Network.

## Branch Flow

`feature branch -> PR -> dev -> release PR -> main`

Rules:

- Create a branch for each planned PR.
- Target all feature PRs to `dev`.
- Do not merge directly to `main`.
- Keep PRs focused on one planned deliverable.
- Ask at least one teammate to review before merging.

## Branch Naming

Use the branch listed in `docs/project/ROLE_PR_MAP.md`.

Allowed prefixes:

- `feat/`
- `fix/`
- `db/`
- `docs/`
- `test/`
- `chore/`

Examples:

- `feat/project-scaffold-oauth-shell`
- `db/profile-field-skill-feed-schema`
- `feat/posts-comments-and-tags`
- `feat/moderation-and-user-management`
- `test/final-e2e-page-map-revised`

## Pull Request Titles

Use the exact title from `docs/project/ROLE_PR_MAP.md`.

Format:

`PR-XX: Exact Title`

Example:

`PR-01: Posts Comments and Tags`

## Pull Request Body

Use `.github/pull_request_template.md`.

Required sections:

- Branch
- What Changed?
- Why Was It Needed?
- How Do I Test It?

## Commit Messages

Use short, clear commit messages:

- `feat: add post creation and comments flow`
- `db: add profiles fields and skills schema`
- `docs: add authority score guidelines`
- `test: add final page-map QA checklist`

## Reviews

Reviewers should check:

- The PR matches the assigned deliverable.
- The branch and title match `ROLE_PR_MAP.md`.
- The change does not include unrelated work.
- The PR includes testing or QA evidence.
- No secrets are committed.
- UI changes are accessible and responsive.
- Supabase changes include RLS and policy considerations.

## AI Agent Usage

When asking an AI agent for help, include:

- your member number and role
- sprint number
- PR number
- branch name from `ROLE_PR_MAP.md`
- whether the agent should implement, test, document, or prepare a draft PR

Example:

`I am M2. Work on Sprint 2 PR-01 from docs/project/ROLE_PR_MAP.md. Use the exact branch, PR title, and PR body format. Open a draft PR to dev.`
