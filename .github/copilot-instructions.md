# Copilot Repository Instructions

Read `AGENTS.md` first when working in this repository.

## Source of Truth

Follow this order:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. `docs/project/ACCEPTANCE_CRITERIA.md`

## Rules

- Use the exact PR title and branch from `ROLE_PR_MAP.md`.
- Target `dev`, never `main`, unless explicitly instructed otherwise.
- Use `.github/pull_request_template.md` for PR bodies.
- Implement only the assigned PR.
- Keep changes focused and module-sized.
- Follow the approved stack in `docs/project/TECH_STACK.md`.

## Revised MVP Scope

This project is based on the revised MVP:

- OAuth-only authentication
- universal feed
- posts and comments
- search
- voting and authority score
- leaderboard
- badges
- moderation
- basic analytics

## Out of Scope

Do not add these unless explicitly requested:

- private messaging
- conversations/messages tables
- password-based authentication
- complex community approval workflow
- video-call integration
- recommendation engine

