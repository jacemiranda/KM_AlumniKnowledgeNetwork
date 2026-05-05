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

## Sprint 2 Decisions

### Decision 3: Adopt Information and Question as the Two Feed Post Types

- Date: 2026-04-28
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 2 required a clear post type model for the Universal Feed. Users needed a way to distinguish knowledge-sharing posts from help-seeking posts so the feed remains useful for both alumni contributors and student learners.
- Options Considered: Single post type (no distinction), free-form tags only, three types (Information, Question, Announcement), two types (Information, Question)
- Decision: Use two post types — Information and Question.
- Reason: Two types are simple enough to implement and understand, map directly to the SECI externalization and internalization modes, and give M4 a clear framework for content quality rules without overcomplicating the composer UI.
- Impact:
  - The post composer requires the user to select a post type before submitting.
  - Feed filters expose type as a filter option alongside field.
  - M4 documented post quality rules separately for each type.
  - M2 implemented post type as an enum column in the `posts` table.

---

### Decision 4: Authorize Stitch API for M3 UI Generation

- Date: 2026-04-28
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 2 required M3 to implement multiple UI components (feed, composer, search, alumni, profile, leaderboard, notifications). Hand-coding all components from scratch within the sprint window would risk delivery. The team evaluated whether AI-assisted UI generation via the Stitch API was appropriate given the project scope and professor expectations.
- Options Considered: Manual Tailwind component implementation only, Stitch API with unrestricted output, Stitch API with strict refactoring rules
- Decision: Authorize M3 to use the Stitch API for UI generation with mandatory refactoring into React TypeScript components using only Tailwind CSS utility classes.
- Reason: Stitch API reduces time spent on boilerplate layout while still requiring M3 to make all structural, accessibility, and component decisions. Refactoring into TypeScript components ensures maintainability and stack compliance.
- Impact:
  - M3 Sprint 2 PR-01 (chore/update-stitch-agent-rules) established the authorization and rules.
  - All Stitch HTML output must be stripped of inline or custom CSS and refactored into modular components.
  - AGENTS.md was updated to document the Stitch API authorization rule for M3.
  - Stitch is a UI reference and generation tool only — backend logic, schema, and routing remain in ROLE_PR_MAP source-of-truth documents.

---

### Decision 5: Adopt Hide, Remove, and Block as the Moderation Action Set

- Date: 2026-04-30
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 2 required a moderation design decision before Sprint 3 implementation could begin. The team needed to agree on what actions Admin and Moderator roles could take on users and content, and how those actions would be logged and surfaced to the moderation team.
- Options Considered: Delete-only (hard delete with no audit trail), soft-delete with restore (hide/remove/restore), full moderation suite (warnings, strikes, escalation, appeals)
- Decision: Implement three moderation action types — Hide (content hidden from feed, recoverable), Remove (content marked removed, recoverable by Admin), and Block (user blocked from platform activity).
- Reason: Three actions cover the realistic moderation needs of the revised MVP without requiring a complex workflow system. Soft actions (hide/remove) preserve audit evidence and allow mistake recovery. Block is sufficient for user-level enforcement without a full strike or warning system.
- Impact:
  - M2 Sprint 3 PR-02 (Moderation and User Management) implemented hide, remove, block, and restore with `moderation_log` audit trail.
  - Admin and Moderator roles see a User Management page with dedicated tabs for Users, Content, and Moderation Log.
  - Hard deletes are not used for moderated content — only hide/remove/restore and block/unblock.
  - M4 documented moderation rules and field governance guidance aligned to this action set.

---

### Decision 6: Establish Five-Route Navigation Shell as the Primary UX Structure

- Date: 2026-04-28
- Owner: M1 - Project Manager / Scrum Master
- Status: Approved
- Context: Sprint 2 UI implementation required M3 to build a navigation shell that covered all major MVP pages without dead routes. The team needed to agree on the primary navigation structure before UI components could be wired to routes.
- Options Considered: Top navigation bar only, sidebar only, sidebar with top bar, bottom navigation (mobile-first), tab-based navigation
- Decision: Use a sidebar navigation shell with five primary routes: Feed, Search, Alumni, Leaderboard, and Profile. Admin users receive a sixth link to the User Management page.
- Reason: A sidebar is standard for knowledge platform applications, works well on desktop and can be collapsed on mobile, and groups discovery (Search, Alumni) separately from personal (Profile) and social (Feed, Leaderboard) flows. Five routes cover every major revised MVP page without overcrowding.
- Impact:
  - The AppShell component renders the sidebar on all authenticated routes.
  - Admin/Moderator role check controls visibility of the sixth User Management link.
  - M3 Sprint 2 and Sprint 3 UI work follows this route structure for all component and layout decisions.
  - Sprint 2 demo path (Feed → Post Detail → Search → Alumni → Profile → Leaderboard) maps directly to these five routes.
