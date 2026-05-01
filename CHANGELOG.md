# Changelog

All notable project changes should be recorded here.

## Unreleased

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

## Sprint 1 - Foundation

- OAuth authentication, first-time profile setup, field and skill taxonomy, feed foundation, and SECI setup.

## Sprint 2 - Core Interaction

- Posts, comments, search, alumni discovery, voting, authority score, and notifications modal.

## Sprint 3 - Final Release

- Leaderboard, badges, moderation, user management, analytics, deployment, QA, and final documentation.
