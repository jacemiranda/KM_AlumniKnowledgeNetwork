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

- Date:
- Owner: M4 Knowledge Management Analyst
- Status: Proposed
- Context: The revised MVP still needs a clear KM framework after the shift to feed, comments, and voting.
- Options Considered: SECI, generic content platform model, community-only framing
- Decision: Keep SECI as the central framework.
- Reason: SECI maps clearly to posts, comments, fields, tags, and badges.
- Impact:
  - SECI must appear in the MVP documentation.
  - SECI must guide taxonomy, moderation logic, and final presentation.

### Decision 2: Replace Messaging with Comments-Based Interaction

- Date:
- Owner:
- Status: Proposed
- Context: The revised MVP needed less complexity and better alignment with professor requirements.
- Options Considered: private messaging, mentor-request chat, post comments
- Decision: Use posts and comments as the main interaction layer.
- Reason: Comments better support visible knowledge capture, moderation, and reuse.
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
