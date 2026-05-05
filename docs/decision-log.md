# Decision Log

Record major project decisions here.

## Template

`Decision`

- Date:
- Owner:
- Status:
- Context:
- Options Considered:
- Decision:
- Reason:
- Impact:

## Decisions

### Decision 1: Keep SECI as the Knowledge Management Framework

- Date: 2026-04-21
- Owner: M4 - Knowledge Management Analyst
- Status: Approved
- Context: The revised MVP needed a clear KM framework after the shift away from mentor-request and messaging workflows to a feed, comments, and voting model.
- Options Considered: SECI, generic content platform model, community-only framing
- Decision: Keep SECI as the central framework.
- Reason: SECI maps directly to the revised MVP — Socialization (alumni sharing stories in the feed), Externalization (posts and structured content), Combination (tagged fields and search-based retrieval), and Internalization (students acting on knowledge through comments and voting).
- Impact:
  - SECI must appear in MVP documentation, oral defense materials, and KM analyst deliverables.
  - SECI must guide taxonomy, field structure, moderation logic, and badge criteria.

---

### Decision 2: Replace Messaging with Comments-Based Interaction

- Date: 2026-04-21
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: The original MVP included private messaging and mentor-request workflows. The revised scope needed to reduce complexity and satisfy professor requirements for a demonstrable, reviewable knowledge-sharing system.
- Options Considered: Private messaging, mentor-request chat, post comments
- Decision: Use posts and comments as the main interaction layer.
- Reason: Comments support visible knowledge capture, moderation, and reuse. Messaging would require additional tables, auth flows, and real-time infrastructure outside the approved stack.
- Impact:
  - Private messaging is removed from features, pages, and database structure.
  - The `conversations` and `messages` tables are not implemented.
  - Feed, posts, and comments become the center of alumni-student interaction.

---

### Decision 3: Use Google OAuth as the Only Authentication Method

- Date: 2026-04-21
- Owner: M2 - Full Stack Developer / Technical Lead
- Status: Approved
- Context: The original MVP allowed password-based authentication. The revised MVP needed a simpler, more secure auth flow aligned to the university Google Workspace environment.
- Options Considered: Email and password auth, Google OAuth, multi-provider OAuth
- Decision: Use Google OAuth exclusively via Supabase Auth.
- Reason: Google OAuth removes password management complexity, fits the university email context, and Supabase supports it natively without extra infrastructure.
- Impact:
  - No password fields, reset flows, or credential storage in the database.
  - All users must authenticate via Google.
  - First-time setup flow triggers on first OAuth sign-in to collect profile data.
  - The `profiles` table stores the Supabase user ID linked to the OAuth provider.

---

### Decision 4: Adopt Feed-first UX as the Primary Navigation Pattern

- Date: 2026-04-23
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: The original MVP prioritized community pages and mentor-request flows. After the scope revision, the team needed a clear primary entry point that showcases knowledge sharing and is demonstrable from the first login.
- Options Considered: Profile-first (user lands on their profile), community-first (user lands on a group feed), universal feed-first
- Decision: Land all authenticated users on the Universal Feed immediately after sign-in and first-time setup.
- Reason: The Universal Feed is the most visible demonstration of knowledge sharing and satisfies the sprint gate requirement that users can view the app shell and interact with content right away.
- Impact:
  - Feed is the default route after OAuth sign-in.
  - Navigation shell links feed, search, alumni discovery, leaderboard, and profile.
  - Community pages are removed from MVP scope.
  - M3 wireframes and UI components prioritize the feed layout first.

---

### Decision 5: Simplify MVP Scope — Remove Messaging, Video, and Recommendation Features

- Date: 2026-04-21
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: The original project plan included private messaging, video calls, mentor-request workflows, community approval flows, and a recommendation engine. These were scoped out after team review to focus on a deliverable, demonstrable MVP within the 6-week sprint timeline.
- Options Considered: Keep all original features with reduced quality, scope down to core feed and interaction features, defer non-essential features to a future phase
- Decision: Remove private messaging, video calls, mentor-request and community approval workflows, recommendation engine, and advanced real-time systems from the MVP.
- Reason: Reducing scope allows the team to deliver a fully integrated, working product within 6 weeks and focus sprint effort on the feed, comments, search, voting, moderation, and leaderboard flows that best demonstrate the KM use case.
- Impact:
  - Messaging is removed from features, pages, and database structure.
  - Feed and comments become the center of interaction.

---

## Sprint 3 Decisions

### Decision 7: Limit the Badge System to 16 Tier 1 Auto-Awarded Badges

- Date: 2026-05-02
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 3 required a badge system. The original MVP concept included multi-tier badge progression and complex awarding criteria. The team evaluated whether a tiered badge system was achievable within the Sprint 3 window alongside moderation and deployment work.
- Options Considered: Multi-tier badges (Tier 1, Tier 2, Tier 3 with escalating criteria), manual badge assignment only (Admin-controlled), 16 auto-awarded Tier 1 badges based on measurable contribution thresholds
- Decision: Implement 16 Tier 1 badges with automatic awarding via a Supabase trigger function (`check_and_award_badges`).
- Reason: 16 predefined badges cover the main contribution dimensions (posting, commenting, voting, fields, tags, and milestones) and can be awarded automatically without Admin overhead. Multi-tier progression is a post-MVP feature given the 6-week timeline.
- Impact:
  - `badges` and `user_badges` tables implemented in migration 004.
  - `check_and_award_badges()` function auto-evaluates on each vote mutation.
  - Profile page displays earned badges; alumni cards show top 3.
  - Advanced badge tiers and custom criteria are deferred to post-MVP.

---

### Decision 8: Use Vercel as the Deployment Platform

- Date: 2026-05-02
- Owner: M2 - Full Stack Developer / Technical Lead (coordinated with M1)
- Status: Approved
- Context: Sprint 3 required a deployment target before hardening and release could begin. The approved tech stack listed Vercel and Netlify as options.
- Options Considered: Vercel, Netlify, manual server hosting
- Decision: Deploy to Vercel.
- Reason: Vercel has native Vite/React support, automatic SPA routing via `vercel.json` rewrites, zero-config HTTPS, and environment variable management aligned to Supabase secrets handling. It requires the least manual server configuration for the team's skill set.
- Impact:
  - `vercel.json` added with Vite build settings and SPA route rewrites.
  - `npm run verify:deploy` script validates lint, tests, and production build before deployment.
  - Supabase URL and key validation added to app startup.
  - ADR-0008 documents the deployment decision.
  - Final live URL must be confirmed and documented in the release checklist.

---

### Decision 9: Lock MVP Scope — No New Features After Sprint 3 Week 5

- Date: 2026-05-03
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: As Sprint 3 progressed into Week 6, requests or suggestions for additional features (e.g., richer analytics, notification delivery, advanced badge tiers) emerged. The team needed a clear scope-freeze point to protect delivery timelines and QA coverage.
- Options Considered: Accept feature additions if implementation was quick, freeze scope at Sprint 3 midpoint, freeze scope only at Week 6
- Decision: Freeze MVP feature scope at the end of Sprint 3 Week 5 (2026-05-03). All subsequent work in Week 6 is limited to bug fixes, QA, documentation, and deployment hardening.
- Reason: Scope creep in the final week risks breaking integrated features, compressing QA time, and producing incomplete implementations that cannot be demonstrated at the oral defense.
- Impact:
  - No new routes, tables, or service functions after 2026-05-03.
  - Week 6 work is limited to defect fixes, final UI polish, documentation, and deployment verification.
  - Post-MVP features (real-time notifications, advanced analytics, recommendation engine) are explicitly deferred.
  - M5 QA work in Week 6 targets the frozen feature set.

---

### Decision 10: Restrict Analytics to Platform-Wide Counts for Admin and Moderator

- Date: 2026-05-02
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 3 included basic analytics as a required MVP feature. The team had to decide how detailed the analytics should be given the sprint timeline and the professor's requirement for a demonstrable analytics view.
- Options Considered: Per-user analytics (post counts, vote history, login frequency per user), field-level engagement analytics (top fields by post volume), platform-wide summary counts only (total users, posts, alumni, students)
- Decision: Implement platform-wide summary counts only, visible exclusively to Admin and Moderator roles via the Analytics tab in User Management.
- Reason: Platform-wide counts satisfy the professor's requirement for visible analytics without requiring complex query design, separate analytics tables, or per-user data aggregation. The `platform_analytics()` Supabase function returns the needed metrics in a single call.
- Impact:
  - Analytics tab in User Management shows total students, total alumni, total posts, total comments, and moderation action count.
  - Analytics are not visible to Student or Alumni roles.
  - Per-user analytics and field-level engagement metrics are deferred to post-MVP.
  - ADR-0006 documents the analytics scope decision alongside badge and leaderboard logic.
  - `conversations`, `messages`, and `mentor_requests` tables are not created.
  - No video or real-time communication infrastructure is set up.
  - AGENTS.md and CONTRIBUTING.md reflect these boundaries explicitly.
  - All sprint deliverables and acceptance criteria are scoped to the revised feature set.
