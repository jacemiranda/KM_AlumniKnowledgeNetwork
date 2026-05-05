# Final Demo Flow — Oral Defense

Project: Alumni Knowledge Network
Presenter: M1 - Miranda, Jermaine Carl P. (facilitating; each member presents their own section)
Suggested Total Time: 15–20 minutes
Date: 2026-05-05

---

## Segment 1 — Introduction (2 minutes)

**Who presents:** M1 (Project Manager)

**Talking points:**

- Alumni Knowledge Network is a React and Supabase web app for alumni-student knowledge sharing through a structured feed, posts, comments, voting, leaderboard, badges, and moderation.
- The system uses the SECI knowledge-management model — Socialization, Externalization, Combination, Internalization — as its conceptual backbone.
- The team is five members across PM, full-stack development, UX/UI, knowledge management, and QA.
- The MVP was delivered in three two-week sprints with a scope revision in Sprint 1 that refocused the product on a feed-first, comments-based interaction model.

**Key file to reference:** `docs/project/MVP.md` — App Overview and SECI table.

---

## Segment 2 — Student Role Demo (5 minutes)

**Who presents:** M2 or M3 (demonstrating the live app)

**Steps:**

1. Open the app's login page — show the Google OAuth button. Mention: no password-based auth, OAuth only.
2. Sign in with Google — land on the First-Time Setup page. Fill in name, bio, field, and skills. Submit.
3. Land on the Universal Feed — point out the sidebar navigation (Feed, Search, Alumni, Leaderboard, Profile).
4. Show the feed with existing posts — point out field filter and post-type filter (Information / Question).
5. Create a new post — select a post type, enter content, add a field and tags. Submit.
6. Open a post detail — show the comments thread. Add a comment.
7. Navigate to the Search page — search by a skill or field name. Show results across People and Posts tabs.
8. Navigate to the Alumni page — filter by field, sort by authority. Click an alumni profile.
9. Vote on the alumni contributor — show the authority score increase on their profile.
10. Navigate to the Leaderboard — show top contributors ranked by authority score.
11. Open the Notifications modal — show notification entries (badge earned, tagged in post, etc.).

**SECI callout:** Posts = Externalization. Search + feed filters = Combination. Voting + badges = Internalization.

---

## Segment 3 — Alumni Role Demo (3 minutes)

**Who presents:** M2 or M3

**Steps:**

1. Sign in as an alumni user (different Google account or use a seeded alumni profile).
2. Navigate to the feed — create an Information post sharing practical knowledge.
3. Open a student question post — add a comment answering the question.
4. Navigate to own profile — show authority score, posts created, comments activity, and earned badges.
5. Show badge display — point out which badges were auto-awarded based on contribution thresholds.
6. Navigate to the Leaderboard — confirm the alumni account appears in the ranking.

**SECI callout:** Alumni creating posts = Socialization → Externalization. Being tagged and appearing in search = Combination. Badge and authority recognition = Internalization.

---

## Segment 4 — Moderator and Admin Demo (3 minutes)

**Who presents:** M2

**Steps:**

1. Sign in as an Admin or Moderator user (use a seeded admin account: `sanchezjm76@gmail.com` or `jcesperanza@neu.edu.ph`).
2. Navigate to User Management via the Admin nav link in the sidebar.
3. Open the Users tab — show the user list. Block a user. Show the block confirmation.
4. Open the Content tab — show a list of posts. Hide a post. Show the hidden status.
5. Open the Fields tab — demonstrate field management (toggle active/inactive).
6. Open the Analytics tab — show platform-wide counts (total students, alumni, posts, comments).
7. Open the Moderation Log tab — show the audit trail of moderation actions.

**Talking point:** The moderation action set (hide, remove, block) was an explicit Sprint 2 PM decision that balanced oversight needs with implementation feasibility. All actions are soft — content is recoverable; users can be unblocked.

---

## Segment 5 — SECI and KM Highlight (2 minutes)

**Who presents:** M4 (Knowledge Management Analyst)

**Talking points:**

- The SECI model is not a label applied to the project after the fact — it guided the design of post types, the field and tag taxonomy, the voting and authority system, and the badge criteria.
- Each feature in the feed maps to a SECI phase: posting (Externalization), commenting (Socialization), search and filtering (Combination), and authority and badges (Internalization).
- The field taxonomy ensures that knowledge is organized by academic discipline, not just freeform tags, which supports structured retrieval (Combination).
- Authority score and badges create an incentive structure for sustained Internalization — students and alumni are recognized for their contributions, which encourages repeat engagement.

**Key file to reference:** `docs/km/` (SECI evidence summary, M4 Sprint 3 PR-03, #26).

---

## Segment 6 — Closing (1–2 minutes)

**Who presents:** M1

**Talking points:**

- The MVP delivers all nine pages in the agreed page map: Login, Setup, Feed, Profile, Search, Alumni, Leaderboard, Notifications, and User Management.
- The product is deployed to Vercel with Supabase as the backend, Google OAuth as the only auth method, and RLS policies protecting role-based data throughout.
- All major Sprint 1, Sprint 2, and Sprint 3 decisions are documented in `docs/decision-log.md` — the product is traceable from scope decision through implementation.
- Post-MVP features (real-time notifications, multi-tier badges, recommendation engine, per-user analytics) are explicitly deferred and documented — not forgotten.

**Final statement:** The Alumni Knowledge Network demonstrates that SECI-aligned knowledge sharing can be built as a practical, accessible web app within a six-week sprint timeline using a focused MVP scope, clear governance, and disciplined AI-assisted development.

---

## Reference Links for Presenters

| Resource | File |
|---|---|
| Page-map acceptance | `docs/sprint-tracking/release-checklist.md` |
| Sprint 3 board closure | `docs/sprint-tracking/sprint3-board.md` |
| Decision log | `docs/decision-log.md` |
| SECI and KM documentation | `docs/km/` |
| ADR index | `docs/adr/` |
| PM reflection | `docs/pm-reflection.md` |
