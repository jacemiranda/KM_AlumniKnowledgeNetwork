# Final Release Checklist

Sprint: Sprint 3 - Final Release
Compiled by: M1 - Miranda, Jermaine Carl P.
Date: 2026-05-05

Gate: The live MVP is accessible, students and alumni can complete their feed-centered flows, leaderboard and badges are active, Admin and Moderator tools work for blocking users and moderating content, basic analytics are visible, and final QA and documentation are complete.

---

## 1. Page-Map Acceptance

All nine pages required by `docs/project/ACCEPTANCE_CRITERIA.md` must be reachable and functional in the deployed app. Evidence column references the merged PR that delivered each page.

| Page | Route | Status | Evidence |
|---|---|---|---|
| Login Page | `/login` | Done | M2 Sprint 1 PR-03 (#9) |
| Sign-Up / First-Time Setup Page | `/setup` | Done | M2 Sprint 1 PR-03 (#9) |
| Universal Feed Page | `/feed` | Done | M2 Sprint 1 PR-01 (#4) + M3 Sprint 2 PR-02 (#31) |
| Profile Page | `/profile/:userId` | Done | M2 Sprint 2 PR-03 (#16) + M3 Sprint 2 PR-04 (#33) |
| Search Results Page | `/search` | Done | M2 Sprint 2 PR-02 (#15) + M3 Sprint 2 PR-03 (#32) |
| Alumni / Mentors Page | `/alumni` | Done | M2 Sprint 2 PR-02 (#15) + M3 Sprint 2 PR-03 (#32) |
| Leaderboard Page | `/leaderboard` | Done | M2 Sprint 3 PR-01 (#27) + M3 Sprint 2 PR-04 (#33) |
| Notifications Modal | overlay on shell | Done | M3 Sprint 2 PR-04 (#33) |
| User Management Page | `/admin` | Done | M2 Sprint 3 PR-02 (#28) + M3 Sprint 3 PR-01 (#39) |

**Page-map acceptance: All 9 pages present. No dead routes.**

---

## 2. Deployment Readiness

| Check | Status | Notes |
|---|---|---|
| Vercel deployment config present | Done | `vercel.json` added in M2 Sprint 3 PR-03 (#29) |
| SPA route rewrites configured | Done | `vercel.json` rewrites all routes to `index.html` |
| Vite production build verified | Done | `npm run verify:deploy` checks lint, tests, and build |
| Supabase URL validation in place | Done | App validates env vars on startup |
| All Sprint 3 features merged to dev | Done | M2 #27–#29, M3 #30–#34, #39, M4 #18–#26 all merged |
| No secrets committed to repo | Done | `.env` and `.env.local` are gitignored |
| `README.md` setup instructions documented | Done | M2 deployment notes added in PR-03 (#29) |
| Final live URL documented | Pending | To be added once Vercel production URL is confirmed |

---

## 3. Role-Based Demo Coverage

Each role must be demonstrable end-to-end in the live app for the oral defense.

### Student Demo Path

| Step | Action | Page | Status |
|---|---|---|---|
| 1 | Sign in with Google OAuth | Login Page | Done |
| 2 | Complete first-time profile setup | Setup Page | Done |
| 3 | Land on Universal Feed | Feed Page | Done |
| 4 | Browse posts with field and type filters | Feed Page | Done |
| 5 | Create an Information or Question post | Feed Page | Done |
| 6 | Comment on an existing post | Post Detail | Done |
| 7 | Search by name, field, tag, or skill | Search Page | Done |
| 8 | Browse alumni contributors | Alumni Page | Done |
| 9 | Vote on an alumni contributor | Profile Page | Done |
| 10 | View authority score update | Profile Page | Done |
| 11 | View leaderboard rankings | Leaderboard Page | Done |
| 12 | Open notifications modal | Shell overlay | Done |

### Alumni Demo Path

| Step | Action | Page | Status |
|---|---|---|---|
| 1 | Sign in with Google OAuth | Login Page | Done |
| 2 | Complete first-time profile setup | Setup Page | Done |
| 3 | Create a knowledge-sharing post | Feed Page | Done |
| 4 | Answer a student question via comment | Post Detail | Done |
| 5 | Appear in search results and alumni discovery | Search / Alumni Page | Done |
| 6 | View earned badges and authority score on profile | Profile Page | Done |
| 7 | Appear on leaderboard | Leaderboard Page | Done |

### Moderator Demo Path

| Step | Action | Page | Status |
|---|---|---|---|
| 1 | Sign in with Google OAuth | Login Page | Done |
| 2 | Access User Management via Admin nav link | User Management | Done |
| 3 | Block a user | Users tab | Done |
| 4 | Hide or remove a post | Content tab | Done |
| 5 | Manage fields and badge assignments | Fields tab | Done |
| 6 | View basic analytics | Analytics tab | Done |
| 7 | Review moderation log | Moderation Log tab | Done |

### Admin Demo Path

| Step | Action | Page | Status |
|---|---|---|---|
| 1 | All Moderator steps above | User Management | Done |
| 2 | Assign or change a user's role | Users tab | Done |
| 3 | Override a moderator action | Content tab | Done |

---

## 4. Quality Checks

Based on `docs/project/ACCEPTANCE_CRITERIA.md`.

| Check | Status | Notes |
|---|---|---|
| No direct merges to `main` | Done | All PRs targeted `dev` |
| All PRs follow the PR template | Done | `.github/pull_request_template.md` used across all PRs |
| No secrets committed | Done | `.env` gitignored; Supabase keys via environment variables only |
| Supabase RLS policies protect role-based data | Done | Policies added in M2 Sprint 1 PR-02 (#6) and enforced throughout |
| All major pages have loading, empty, and error states | Done | Implemented in M2 and M3 Sprint 2 UI PRs |
| App is responsive for desktop and mobile browser | Done | Tailwind responsive breakpoints (`md:`, `lg:`) applied |
| README setup works from a clean clone | Done | Documented in M2 Sprint 3 PR-03 (#29) |
| Final live URL documented | Pending | Add URL here once Vercel production deployment is confirmed |

---

## 5. Sprint 3 PR Completion Status

| Role | PRs Assigned | PRs Merged | PRs Open / Pending |
|---|---|---|---|
| M1 | 3 | 0 | 3 |
| M2 | 3 | 3 | 0 |
| M3 | 2 | 2 | 0 |
| M4 | 3 | 3 | 0 |
| M5 | 4 | 0 | 4 |
| **Total** | **15** | **8** | **7** |

### Open Items Before Release Sign-Off

| Item | Owner | Priority |
|---|---|---|
| M1 PR-01: Final Release Coordination (#this) | M1 | High |
| M1 PR-02: Final Decision Log and Board Revised | M1 | High |
| M1 PR-03: PM Reflection and Presentation Revised | M1 | High |
| M5 PR-01: Final E2E Page Map Revised | M5 | High |
| M5 PR-02: README and Wiki Final Revised | M5 | High |
| M5 PR-03: Failure Analysis Report Revised | M5 | Medium |
| M5 PR-04: QA Reflection and Signoff Revised | M5 | High |
| Final live URL confirmed and documented | M2 | High |
