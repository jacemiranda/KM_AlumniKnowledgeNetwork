# Sprint 2 Board Audit

Sprint: Sprint 2 - Core Interaction
Weeks: 3–4
Compiled by: M1 - Miranda, Jermaine Carl P.
Date: 2026-05-05

Gate: A user can create posts, comment on feed content, search by name, field, tags, and skills, browse alumni contributors, vote on users, and see authority score updates and notification previews without dead navigation.

---

## GitHub Milestone

Milestone: **Sprint 2 - Core Interaction** (GitHub Milestone #2)
State: Open
Description: Weeks 3–4: Posts, comments, search, voting, and alumni discovery.

---

## Sprint 2 PR Status

### M1 — Project Manager / Scrum Master

| PR | Title | Branch | GitHub PR | Status |
|---|---|---|---|---|
| PR-01 | Standups Sprint 2 Revised | `docs/standups-sprint2-revised` | #38 | Open — Awaiting Review |
| PR-02 | Decision Log Sprint 2 Revised | `docs/decision-log-sprint2-revised` | #40 | Open — Awaiting Review |
| PR-03 | Sprint 2 Board Audit Revised | `chore/sprint2-board-audit-revised` | — | In Progress |

### M2 — Full Stack Developer / Technical Lead

| PR | Title | Branch | GitHub PR | Status |
|---|---|---|---|---|
| PR-01 | Posts Comments and Tags | `feat/posts-comments-and-tags` | #14 | Merged |
| PR-02 | Search and Alumni Discovery | `feat/search-and-alumni-discovery` | #15 | Merged |
| PR-03 | Voting Authority and Profile Metrics | `feat/voting-authority-profile-metrics` | #16 | Merged |
| PR-04 | Search Voting Architecture | `docs/adr-search-voting-architecture` | #17 | Merged |

### M3 — UX/UI Designer / Front-End Contributor

| PR | Title | Branch | GitHub PR | Status |
|---|---|---|---|---|
| PR-01 | Update Stitch Agent Rules | `chore/update-stitch-agent-rules` | #30 | Merged |
| PR-02 | Universal Feed Posting UI | `feat/ui-universal-feed-posting` | #31 | Merged |
| PR-03 | Search and Alumni Page UI | `feat/ui-search-and-alumni-page` | #32 | Merged |
| PR-04 | Profile Leaderboard Notifications UI | `feat/ui-profile-leaderboard-notifications` | #33 | Merged |
| PR-05 | Design Rationale Sprint 2 Revised | `docs/design-rationale-sprint2-revised` | #34 | Merged |

### M4 — Knowledge Management Analyst

| PR | Title | Branch | GitHub PR | Status |
|---|---|---|---|---|
| PR-01 | Authority and Voting Rules | `docs/authority-and-voting-rules` | #21 | Merged |
| PR-02 | Search and Retrieval Guidelines | `docs/search-and-retrieval-guidelines` | #22 | Merged |
| PR-03 | Post and Comment Quality Rules | `docs/post-and-comment-quality-rules` | #23 | Merged |

### M5 — QA & Documentation Lead

| PR | Title | Branch | GitHub PR | Status |
|---|---|---|---|---|
| PR-01 | Sprint 2 Feed Search Voting Cases | `test/sprint2-feed-search-voting-cases` | — | Pending |
| PR-02 | GitHub Issues QA Log Revised | `test/github-issues-qa-log-revised` | — | Pending |
| PR-03 | Wiki and QA Update Sprint 2 | `docs/wiki-and-qa-update-sprint2` | — | Pending |

---

## Sprint 2 Summary

| Role | PRs Assigned | PRs Merged | PRs Open / Pending |
|---|---|---|---|
| M1 | 3 | 0 | 3 |
| M2 | 4 | 4 | 0 |
| M3 | 5 | 5 | 0 |
| M4 | 3 | 3 | 0 |
| M5 | 3 | 0 | 3 |
| **Total** | **18** | **12** | **6** |

---

## Sprint 2 Gate Status

| Gate Criterion | Status | Evidence |
|---|---|---|
| Users can create posts | Done | M2 PR-01 (#14) merged |
| Users can comment on feed content | Done | M2 PR-01 (#14) merged |
| Search by name, field, tags, and skills | Done | M2 PR-02 (#15) merged |
| Browse alumni contributors | Done | M2 PR-02 (#15) merged |
| Vote on users and content | Done | M2 PR-03 (#16) merged |
| Authority score updates visible | Done | M2 PR-03 (#16) merged |
| Notification previews accessible | Done | M3 PR-04 (#33) merged |
| No dead navigation routes | Done | M3 PR-02–04 (#31–#33) merged |
| Sprint 2 standups filed | In Progress | M1 PR-01 (#38) open |
| Sprint 2 decision log updated | In Progress | M1 PR-02 (#40) open |
| Sprint 2 QA test cases | Pending | M5 PRs not yet opened |

**Sprint 2 Gate: Met for functional criteria. Documentation and QA artifacts in progress.**

---

## Integration Checkpoint

Sprint 2 required M2 backend features to be integrated with M3 UI components on the `dev` branch. Confirmed integrations as of 2026-05-05:

| Integration | M2 PR | M3 PR | Status |
|---|---|---|---|
| Feed posts and composer UI | #14 | #31 | Integrated — live on dev |
| Comments thread UI | #14 | #31 | Integrated — live on dev |
| Search results page | #15 | #32 | Integrated — live on dev |
| Alumni discovery page | #15 | #32 | Integrated — live on dev |
| Voting and authority score display | #16 | #33 | Integrated — live on dev |
| Profile metrics page | #16 | #33 | Integrated — live on dev |
| Notifications modal | #16 | #33 | Integrated — live on dev |
| Navigation shell (all Sprint 2 routes) | #14–#16 | #31–#33 | Integrated — no dead routes |

---

## Review Readiness

| Role | Review Status | Notes |
|---|---|---|
| M2 | Ready | All four Sprint 2 PRs merged; ADR documentation complete |
| M3 | Ready | All five Sprint 2 PRs merged; design rationale filed |
| M4 | Ready | All three Sprint 2 KM documentation PRs merged |
| M1 | Awaiting review | PR-01 (#38) and PR-02 (#40) open as drafts |
| M5 | Not started | Three Sprint 2 QA PRs pending — blocker for final gate sign-off |

---

## Open Items and Risks

| Item | Owner | Priority | Status |
|---|---|---|---|
| M1 PR-01: Sprint 2 standups (#38) | M1 | High | Open — needs reviewer |
| M1 PR-02: Decision log update (#40) | M1 | High | Open — needs reviewer |
| M5 PR-01: Sprint 2 test cases | M5 | High | Not opened — Sprint 2 gate depends on this |
| M5 PR-02: GitHub Issues QA log | M5 | Medium | Not opened |
| M5 PR-03: Wiki and QA update | M5 | Medium | Not opened |

---

## Sprint 2 Demo Path

Confirmed working on `dev` as of 2026-05-05:

1. Sign in via Google OAuth
2. Land on Universal Feed — post composer visible, feed filters functional
3. Create a post (Information or Question type)
4. View post detail — comments thread visible and functional
5. Search by name, field, tag, or skill — results shown in tabs (All / People / Posts)
6. Navigate to Alumni page — filter by field or skill, sort by authority or alphabetical
7. View alumni profile — authority score, post count, and badges displayed
8. Vote on an alumni contributor — authority score updates
9. Navigate to Leaderboard — top contributors ranked
10. View own profile — contribution metrics and badges shown
