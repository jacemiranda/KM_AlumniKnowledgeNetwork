# Changelog

All notable project changes should be recorded here.

## Unreleased

- Added Sprint 3 PR-03: Deploy and Hardening Revised.
  - Added Vercel deployment config with Vite build settings and SPA route rewrites.
  - Added `npm run verify:deploy` for lint, tests, and production build verification.
  - Added Supabase URL validation, deployment README notes, and ADR-0008.

- Added Sprint 3 PR-02: Moderation and User Management.
  - Database migration 005: `moderation_log` table, `is_admin()` helper, `auto_promote_admin` trigger, and default admin seeding for `sanchezjm76@gmail.com` and `jcesperanza@neu.edu.ph`.
  - Moderation service with user blocking/unblocking, post/comment hide/remove/restore, role assignment, field toggles, badge award/revoke, and audit logging.
  - TanStack Query hooks for all moderation operations.
  - UserManagementPage with 5 tabs: Users, Content, Fields, Analytics, and Moderation Log.
  - Admin nav link conditionally visible for Admin/Moderator roles.
  - `/admin` route added to the app router.
  - ADR-0007: Moderation and User Management.
  - Updated schema migration tests.

- Added Sprint 3 PR-01: Badges, Leaderboard, and Analytics.
  - Database migration 004: `badges` and `user_badges` tables with RLS policies, `check_and_award_badges()` auto-award function, `platform_analytics()` stats function, and 16 Tier 1 badge seed definitions.
  - Badge service, leaderboard service, and analytics service with TanStack Query hooks.
  - LeaderboardPage with top-3 podium cards, ranked table, field filter, and pagination.
  - BadgeDisplay component with category-colored chips and inline SVG icons.
  - AnalyticsSummary component for Admin/Moderator showing platform-wide metrics.
  - Profile page now displays earned badges and auto-checks for new badge eligibility.
  - Alumni cards show top 3 earned badges.
  - Vote mutations now invalidate leaderboard and badge caches.
  - ADR-0006: Badges, Leaderboard, and Basic Analytics.
  - Updated schema migration tests for Sprint 3 tables and functions.

- Revised the MVP from mentor-request and messaging workflows to a feed, comments, voting, leaderboard, and moderation model.
- Added revised AI context pack and source-of-truth markdown files.
- Added the Sprint 1 project scaffold with TypeScript app structure, protected shell routing, and a development-only mock OAuth session flow.
- Added Vitest-based scaffold tests and updated the frontend toolchain for TypeScript, linting, and production build verification.
- Added the Sprint 1 PR-02 Supabase schema foundation for profiles, fields, skills, feed posts, and tags with RLS policies and seed taxonomy.
- Added the Sprint 1 PR-03 Supabase Google OAuth session flow and first-time profile setup persistence.
- Added Sprint 1 PR-04 documentation artifacts: initial ADR set for implemented decisions and the expanded M2 developer prompt log.
- Added Sprint 2 PR-01: Posts, comments, tags, voting, and post-type flow.
  - Database migration 002: `comments` and `votes` tables with RLS policies, indexes, and triggers.
  - Service layer: `post-service`, `comment-service`, `vote-service`, `tag-service` with Supabase CRUD.
  - TanStack Query hooks: `usePosts`, `usePost`, `useCreatePost`, `useDeletePost`, `useComments`, `useCreateComment`, `useDeleteComment`, `useCastVote`, `useRemoveVote`, `useTags`.
  - Zod validation schemas for post creation and comment creation.
  - Rebuilt FeedPage with live data, feed filters (field, post type), pagination, loading/empty/error states.
  - New components: PostComposer, PostCard, PostDetail, CommentThread, FeedFilters.
  - Added `/post/:postId` route for post detail with comments thread and author voting.
  - Updated schema migration tests and App integration test for Sprint 2 changes.
- Added Sprint 2 PR-02: Search and Alumni Discovery.
  - Database migration 003: `search_vector` tsvector generated columns on `profiles` and `posts` with GIN indexes; `compute_authority_score`, `count_user_posts`, `count_user_comments`, and `count_tagged_in_posts` helper functions.
  - Service layer: `search-service` (searchUsers, searchPosts, searchAll) and `alumni-service` (fetchAlumni, fetchAlumniProfile) with full-text search and bulk metrics computation.
  - TanStack Query hooks: `useSearchUsers`, `useSearchPosts`, `useAlumni`, `useAlumniProfile`.
  - New SearchPage with debounced input, tabbed results (All/People/Posts), URL param sync, and inline PostResultCard.
  - New AlumniPage with field/skill filters, sort controls (authority/alphabetical/recent), alumni card grid, and pagination.
  - Reusable SearchBar component integrated into AppShell sidebar.
  - Added `/search` and `/profile/:userId` routes.
  - ADR-0004: Search and Alumni Discovery Architecture.
- Added Sprint 2 PR-03: Voting Authority and Profile Metrics.
  - Replaced the profile placeholder with signed-in and public profile metrics for authority score, posts created, tagged-in posts, and comments.
  - Added vote-state display, vote changing, and vote removal for profile and post-author voting flows.
  - Added focused tests for authority score computation, profile metrics loading, and profile route behavior.
- Added Sprint 2 PR-04 architecture documentation for search, voting, authority score, and profile metrics decisions.

## Sprint 1 - Foundation

- OAuth authentication, first-time profile setup, field and skill taxonomy, feed foundation, and SECI setup.

## Sprint 2 - Core Interaction

- Added M1 PR-03: Sprint 2 Board Audit Revised.
  - Created `docs/sprint-tracking/sprint2-board.md` with Sprint 2 PR status table, gate criteria status, integration checkpoint, review readiness, open items, and confirmed demo path.

- Posts, comments, search, alumni discovery, voting, authority score, and notifications modal.

## Sprint 3 - Final Release

- Leaderboard, badges, moderation, user management, analytics, deployment, QA, and final documentation.
