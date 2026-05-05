# GitHub Projects Board Setup

This file documents the GitHub Projects board configuration for Alumni Knowledge Network.

## Board Columns

Create a GitHub Projects (v2) board with these four columns in order:

| Column | Purpose |
|---|---|
| **Backlog** | Planned issues not yet started |
| **In Progress** | Issues actively being worked on this sprint |
| **In Review** | PR opened and awaiting review |
| **Done** | Merged to `dev` and verified |

## Milestones

Create three milestones in the GitHub repository under **Issues > Milestones**:

| Milestone | Weeks | Description |
|---|---|---|
| Sprint 1 - Foundation | Weeks 1–2 | OAuth, profiles, feed base, SECI setup |
| Sprint 2 - Core Interaction | Weeks 3–4 | Posts, comments, search, voting, alumni discovery |
| Sprint 3 - Final Release | Weeks 5–6 | Leaderboard, badges, moderation, analytics, deployment |

## Issue Linking Convention

Each planned PR from `docs/project/ROLE_PR_MAP.md` should have a matching GitHub issue with:

- **Title:** `PR-XX: Exact Title From ROLE_PR_MAP`
- **Milestone:** The sprint it belongs to
- **Labels:** One type label + sprint label + member label (e.g., `feat`, `sprint-1`, `m2`)
- **Assignee:** The responsible team member

Example issue for M2 Sprint 1 PR-01:

```
Title:     PR-01: Project Scaffold OAuth Shell
Milestone: Sprint 1 - Foundation
Labels:    feat, sprint-1, m2
Assignee:  M2 (Sanchez, John Marc R.)
```

## Definition of Done

A PR is considered **Done** when all of the following are true:

- [ ] Branch was created from `dev`
- [ ] Branch name matches `docs/project/ROLE_PR_MAP.md`
- [ ] PR title matches `docs/project/ROLE_PR_MAP.md` exactly (`PR-XX: Exact Title`)
- [ ] PR body uses `.github/pull_request_template.md`
- [ ] At least one teammate has reviewed and approved
- [ ] No secrets, `.env` files, or credentials committed
- [ ] Tests pass (Vitest) if the PR includes testable code
- [ ] Merged to `dev` — never directly to `main`
- [ ] Linked GitHub issue moved to **Done** column on the board

## Review Assignment Rule

- Every PR requires at least one reviewer from the team.
- M1 reviews coordination and documentation PRs.
- M2 reviews all backend, schema, and integration PRs.
- M3 reviews frontend and UI PRs.
- Cross-role review is encouraged for shared-impact changes.
