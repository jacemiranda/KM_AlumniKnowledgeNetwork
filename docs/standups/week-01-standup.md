# Week 1 Standup

Date: 2026-04-25
Sprint: Sprint 1 - Foundation
Facilitator: M1 - Miranda, Jermaine Carl P.

## Member Updates

### M1 - Project Manager / Scrum Master

- Done:
  - Repository initialized with main, dev, and feature branch structure.
  - Core governance documents drafted: AGENTS.md, CONTRIBUTING.md, ROLE_PR_MAP.md, SPRINT_DELIVERABLES.md.
  - Sprint 1 scope decisions logged: OAuth-only auth, feed-first UX, simplified MVP, SECI retention.
  - GitHub Projects board columns and milestone structure planned.
- Doing:
  - Finalizing decision log entries with dates and owners.
  - Coordinating Week 1 standup notes and filing in repo.
- Blocked:
  - None.

### M2 - Full Stack Developer / Technical Lead

- Done:
  - Project scaffold initialized with React, Vite, TypeScript, and Tailwind CSS.
  - App shell with protected routing and development-only mock OAuth session flow in place.
  - Vitest baseline tests added for scaffold verification.
  - AI context pack and Copilot instructions committed to `.github/`.
- Doing:
  - Preparing Supabase schema for profiles, fields, skills, and feed-base tables (PR-02).
- Blocked:
  - None.

### M3 - UX/UI Designer / Front-End Contributor

- Done:
  - Annotated wireframes completed for login, first-time setup, universal feed, and profile pages.
- Doing:
  - Design system foundation in progress (colors, typography, spacing, cards, forms).
  - Starting OAuth login and setup UI components.
- Blocked:
  - None.

### M4 - Knowledge Management Analyst

- Done:
  - SECI framework confirmed as the KM backbone for the revised MVP.
  - Initial field taxonomy and skill-tag logic outlined.
- Doing:
  - Rewriting SECI mapping for posts, comments, tags, fields, voting, and badges.
  - Drafting predefined field taxonomy document.
- Blocked:
  - Waiting for M2 schema to confirm field and skill table structure before finalizing taxonomy rules.

### M5 - QA & Documentation Lead

- Done:
  - QA template structure outlined for auth, first-time setup, profile creation, and feed-shell access.
- Doing:
  - Writing acceptance test cases for OAuth and first-time setup flows.
  - Reviewing README and CONTRIBUTING for revised stack and OAuth usage notes.
- Blocked:
  - None.

## Decisions

- Confirmed OAuth-only authentication using Google OAuth via Supabase (Decision 3).
- Confirmed Universal Feed as the post-login landing page (Decision 4).
- Confirmed removal of messaging, video, mentor-request, and recommendation features from MVP scope (Decision 5).

## Risks / Blockers

- M4 field taxonomy depends on M2 schema being finalized — M2 targeting PR-02 delivery by end of Week 1.
- M3 UI implementation blocked until design system and wireframes are signed off — on track for Week 2 start.

## Next Actions

- M1: File decision log and Week 1 standup note (PR-02).
- M2: Open PR-02 (profile, field, skill, and feed-base schema).
- M3: Complete design system foundation and begin OAuth login UI (PR-02).
- M4: Complete SECI mapping revision (PR-01) and field taxonomy draft (PR-02).
- M5: Complete Sprint 1 QA checklist and acceptance test cases (PR-01).
