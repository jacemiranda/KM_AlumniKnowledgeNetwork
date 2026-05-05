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
  - `conversations`, `messages`, and `mentor_requests` tables are not created.
  - No video or real-time communication infrastructure is set up.
  - AGENTS.md and CONTRIBUTING.md reflect these boundaries explicitly.
  - All sprint deliverables and acceptance criteria are scoped to the revised feature set.
