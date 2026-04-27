# ADR-0003: Supabase PostgreSQL Schema Baseline for Sprint 1

## Status

Accepted

## Context

Sprint 1 required a database baseline that supports profile setup and feed foundations while preserving revised MVP boundaries. Migration `001_profile_field_skill_feed_schema.sql` establishes core enums, tables, triggers, row-level security policies, and taxonomy seeds for fields/skills/tags.

Current implementation behavior includes:

- Profile model linked to `auth.users` with role, user type, and setup-completion state.
- Feed-base entities for posts, tags, and post-tag relations.
- Field and skill taxonomy with profile-skill mapping.
- RLS policies and helper functions for role-aware moderation boundaries.

## Options Considered

- Supabase PostgreSQL schema with RLS and role-aware policies.
- Minimal schema without RLS, deferring access control to frontend only.
- Non-Supabase backend and custom API/database layer in Sprint 1.

## Decision

Adopt Supabase PostgreSQL as the Sprint 1 baseline with explicit RLS policies, profile-first identity linkage, and feed-base relational tables needed by revised MVP flows.

## Consequences

- Provides a secure and extensible data foundation for feed, comments, voting, and moderation expansion.
- Aligns authentication and profile lifecycle with Supabase-managed users.
- Increases migration and policy complexity that must be validated in tests.
- Requires strict scope control to avoid out-of-scope messaging/community-approval tables.