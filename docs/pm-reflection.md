# PM Reflection — Alumni Knowledge Network

Member: M1 - Miranda, Jermaine Carl P.
Role: Project Manager / Scrum Master
Date: 2026-05-05
Sprint Coverage: Sprint 1 through Sprint 3 (6 weeks)

---

## 1. Project Overview

Alumni Knowledge Network is a React and Supabase web application that enables alumni-student knowledge sharing through a universal feed, posts, comments, voting, leaderboard, badges, and moderation. The system uses the SECI knowledge-management model as its conceptual backbone and was built in three two-week sprints by a five-member team.

The project started with a broader scope that included private messaging, mentor-request workflows, and complex community approval flows. The first major PM action was coordinating a scope revision that removed these features and refocused the MVP on a feed-first, comments-based interaction model — a decision that shaped the entire project structure.

---

## 2. What Was Delivered vs. Planned

### Delivered

All core MVP features were implemented and merged to `dev`:

- Google OAuth authentication and first-time profile setup (Sprint 1)
- Universal Feed with posts, comments, field filters, and post-type selection (Sprint 2)
- Search by name, field, tag, and skill (Sprint 2)
- Alumni and Mentors discovery page (Sprint 2)
- Voting and authority score system (Sprint 2)
- Profile metrics with contribution history and earned badges (Sprint 2–3)
- Leaderboard with podium view and field filter (Sprint 3)
- 16 Tier 1 auto-awarded badges (Sprint 3)
- Admin and Moderator User Management with five tabs (Sprint 3)
- Basic platform analytics for Admin and Moderator (Sprint 3)
- Vercel deployment configuration and production-ready hardening (Sprint 3)

All nine pages in the MVP page map are present and reachable on `dev`.

### Deferred to Post-MVP

The following were explicitly scoped out and documented in Decision 5:

- Private messaging and conversations
- Mentor-request and community approval workflows
- Real-time notification delivery
- Multi-tier badge progression
- Per-user and field-level analytics dashboards
- Recommendation engine
- Video-call integration

No deferred feature was dropped without documentation — each is traceable to a logged decision or the scope boundary in AGENTS.md and CONTRIBUTING.md.

---

## 3. Key PM Decisions Made

| Decision | Sprint | Impact |
|---|---|---|
| Scope revision: remove messaging and mentor-request | Sprint 1 | Enabled full 6-week delivery of feed-first MVP |
| OAuth-only authentication | Sprint 1 | Eliminated password management complexity |
| Feed-first UX as the default landing page | Sprint 1 | Made the sprint gate demonstrable from the first login |
| Information and Question post types | Sprint 2 | Gave M4 a clear framework and M3 a defined composer UX |
| Stitch API authorization for M3 | Sprint 2 | Accelerated UI delivery without sacrificing stack compliance |
| Hide, remove, and block moderation action set | Sprint 2 | Gave M2 a scoped implementation target for Sprint 3 |
| Five-route navigation shell | Sprint 2 | Aligned M3 UI work to a single agreed layout |
| 16 Tier 1 badges only | Sprint 3 | Bounded badge system to what was deliverable in the window |
| Vercel as deployment platform | Sprint 3 | Resolved deployment target before hardening began |
| Scope freeze at Week 5 | Sprint 3 | Protected QA time and oral defense preparation |
| Analytics restricted to platform-wide counts | Sprint 3 | Kept analytics simple and demonstrable within the sprint |

---

## 4. Team Coordination Observations

**M2 — Full Stack Developer / Technical Lead:** M2 delivered the most PRs of any team member (11 across three sprints) and set the pace for the rest of the team. Schema decisions in Sprint 1 were critical path items — M4 field taxonomy and M5 QA cases both depended on M2 schema being stable before they could proceed. M2 consistently delivered ahead of schedule, which allowed M3 UI work and M4 documentation to start earlier than planned.

**M3 — UX/UI Designer / Front-End Contributor:** The Stitch API blocker in Sprint 2 Week 3 was the most visible coordination risk of the project. Authorizing Stitch API usage (Decision 4) unblocked M3 and allowed all five Sprint 2 UI PRs and both Sprint 3 UI PRs to land by end of Sprint 3 Week 6. M3's design rationale documentation was thorough and will support the oral defense effectively.

**M4 — Knowledge Management Analyst:** M4 delivered all nine KM documentation PRs across three sprints and maintained strong SECI alignment throughout. The field taxonomy document was particularly useful for grounding M2's schema decisions. M4 was the most consistently on-schedule member of the team.

**M5 — QA & Documentation Lead:** M5's Sprint 1, Sprint 2, and Sprint 3 QA PRs are pending as of this reflection. This is the most significant risk to the final gate sign-off. Sprint 3 gate closure requires M5 to open and merge four QA PRs covering the final E2E page map, README, failure analysis, and QA sign-off.

---

## 5. What Went Well

- The scope revision in Sprint 1 was the single most important PM action. It kept the team focused on a deliverable, demonstrable product instead of spreading effort across features that could not be completed in six weeks.
- Source-of-truth documentation (AGENTS.md, ROLE_PR_MAP.md, SPRINT_DELIVERABLES.md) worked as intended. Agents reading these documents before acting stayed within scope and produced the right outputs.
- M2 and M4 delivered ahead of their sprint gates, which created buffer time for integration and documentation.
- The decision log produced a clear, traceable record of why the product looks the way it does — useful for both the oral defense and any future iteration.

---

## 6. What Could Have Been Done Better

- M5 QA work was consistently behind schedule across all three sprints. Earlier PM escalation and clearer dependency tracking would have helped surface this risk sooner.
- Sprint 1 PR-02 (Decision Log) and PR-03 (Sprint 1 Tracking) were filed late in the sprint rather than being set up at the start. Decision logging should be a Week 1 Day 1 action, not a deliverable filed near the end of the sprint.
- GitHub milestones were created in Sprint 1 PR-03, but issue-to-milestone linking was never enforced. The board evidence documents are accurate but the live GitHub board did not consistently reflect actual sprint state.

---

## 7. SECI Alignment Assessment

| SECI Phase | Product Feature | Status |
|---|---|---|
| Socialization | Posts, comments, alumni-student interaction in the feed | Delivered |
| Externalization | Post creation with Information and Question types, tags, and fields | Delivered |
| Combination | Search by name, field, tag, and skill; feed filters; leaderboard ranking | Delivered |
| Internalization | Authority score, badges, profile contribution history, and voting feedback | Delivered |

All four SECI phases have corresponding features in the delivered MVP. M4's SECI evidence summary (Sprint 3 PR-03, #26) documents this alignment in detail and is available for the oral defense.

---

## 8. Lessons Learned

1. **Scope revision is a PM action, not a team failure.** Removing messaging and community approval workflows was the right call and made the project deliverable. PM must be willing to cut scope explicitly and document it — not leave it as an implied understanding.

2. **Dependency tracking matters more than status reporting.** The most useful standup information was not "what is done" but "what is blocked and why." Future sprints should structure standups around dependency chains first.

3. **AI-assisted documentation works when the source-of-truth documents are clear.** AGENTS.md, ROLE_PR_MAP.md, and SPRINT_DELIVERABLES.md functioned as reliable inputs for AI-assisted PR generation. When these documents were incomplete or ambiguous, the outputs required more correction.

4. **QA is a gate, not an afterthought.** M5 QA PRs were consistently the last items to land across all three sprints. A tighter gate — no sprint closes until QA evidence is merged — would enforce this earlier in future projects.
