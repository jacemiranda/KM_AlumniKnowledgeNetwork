# Week 4 Standup

Date: 2026-05-02
Sprint: Sprint 2 - Core Interaction
Facilitator: M1 - Miranda, Jermaine Carl P.

## Member Updates

### M1 - Project Manager / Scrum Master

- Done:
  - Sprint 2 GitHub board updated with PR status for M2 (#14–#17), M4 (#18–#23).
  - Integration checkpoint confirmed: posts, comments, search, voting, and authority score all merged and functional on dev.
  - Sprint 2 demo path verified — Feed → Post Detail → Search → Alumni Page → Profile is navigable without dead routes.
- Doing:
  - Tracking M3 UI PRs for Sprint 2 completion.
  - Coordinating Sprint 2 documentation close-out with M4 and M5.
- Blocked:
  - None.

### M2 - Full Stack Developer / Technical Lead

- Done:
  - PR-01: Posts Comments and Tags (#14) — merged 2026-05-01.
  - PR-02: Search and Alumni Discovery (#15) — merged 2026-05-01.
  - PR-03: Voting Authority and Profile Metrics (#16) — merged 2026-05-01.
  - PR-04: Search Voting Architecture (ADR and docs) (#17) — merged 2026-05-01.
  - All Sprint 2 M2 deliverables complete.
- Doing:
  - Starting Sprint 3 work: Badges, Leaderboard, and Analytics (PR-01).
- Blocked:
  - None.

### M3 - UX/UI Designer / Front-End Contributor

- Done:
  - PR-01: Update Stitch Agent Rules (#30) — Stitch API connection authorized and confirmed.
  - PR-02: Universal Feed Posting UI (#31) — post composer, feed filters, comments thread UI merged.
- Doing:
  - PR-03: Search and Alumni Page UI — search results and alumni discovery UI in progress.
  - PR-04: Profile Leaderboard Notifications UI — planned after PR-03.
- Blocked:
  - None — Stitch API blocker from Week 3 resolved.

### M4 - Knowledge Management Analyst

- Done:
  - PR-01: Authority and Voting Rules (#21) — merged.
  - PR-02: Search and Retrieval Guidelines (#22) — merged.
  - PR-03: Post and Comment Quality Rules (#23) — merged.
  - All Sprint 2 M4 deliverables complete.
- Doing:
  - Starting Sprint 3 KM work: Badge and Authority Guidelines.
- Blocked:
  - None.

### M5 - QA & Documentation Lead

- Done:
  - Sprint 2 test case drafts started for posting, comments, and search.
- Doing:
  - Completing Sprint 2 test cases (target: at least 10 cases covering feed, search, comments, profile metrics, and voting).
  - Filing GitHub issues for any integration defects found during Sprint 2 review.
- Blocked:
  - M3 UI PRs still in progress — final UI test cases depend on search and alumni pages being merged.

## Decisions

- Sprint 3 start confirmed for M2 — all Sprint 2 M2 features are merged and on dev.
- M4 Sprint 3 KM work can proceed in parallel with M3 UI close-out.
- Sprint 2 gate met: users can create posts, comment, search, browse alumni, vote, and see authority score updates on dev.

## Risks / Blockers

- M5 Sprint 2 test case count may fall short of 10 if M3 UI PRs (#32–#34) delay — M1 tracking this for Sprint 2 close review.
- M3 has multiple Sprint 2 UI PRs still open (#32: Search UI, #33: Leaderboard/Notifications UI, #34: Design Rationale) — targeting end of Week 4.

## Next Actions

- M1: File Sprint 2 standup notes and decision log update (PR-01, PR-02).
- M2: Open Sprint 3 PR-01 (Badges Leaderboard and Analytics).
- M3: Merge PR-03 (Search and Alumni Page UI) and PR-04 (Profile Leaderboard Notifications UI).
- M4: Open Sprint 3 PR-01 (Badge and Authority Guidelines).
- M5: Complete Sprint 2 test cases and file integration issues.
