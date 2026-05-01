# ADR-0004: Search and Alumni Discovery Architecture

## Status

Accepted

## Context

Sprint 2 requires a search system that allows users to find people and posts by name, field, tags, and skills, and an alumni discovery page with field/skill filters, authority scores, and contribution metrics.

We needed to decide:
1. How to implement search across profiles and posts.
2. How to compute and serve authority scores for discovery pages.
3. How to structure alumni filtering and sorting.

## Options Considered

### Search Implementation

- **Option A: PostgreSQL full-text search with `tsvector` + GIN indexes** — Native, no extra services, supported by Supabase.
- **Option B: Client-side filtering** — Simple but doesn't scale and requires loading all data.
- **Option C: External search service (e.g. Algolia, Meilisearch)** — Powerful but introduces external dependency and deployment complexity.

### Authority Score Computation

- **Option A: Compute on read (SUM of votes on each request)** — Simple, always accurate, no materialization needed.
- **Option B: Materialized column updated by triggers** — Faster reads but adds trigger complexity and potential consistency issues.
- **Option C: Materialized view** — Good for batch reads but adds refresh complexity.

## Decision

### Search: PostgreSQL `tsvector` with GIN indexes (Option A)

- Added `search_vector` generated columns on `profiles` (name, bio, email) and `posts` (title, content).
- Created GIN indexes for fast full-text search.
- Frontend uses Supabase `.or()` combining `textSearch` with `ilike` fallback for partial matches.
- This approach is zero-dependency, uses existing Supabase infrastructure, and is sufficient for the MVP user scale.

### Authority Score: Compute on read (Option A)

- Created `compute_authority_score(profile_id)` SQL function for individual queries.
- Frontend bulk-fetches votes and computes scores client-side for list views.
- At MVP scale (hundreds of users, thousands of votes), this is fast enough and avoids materialization complexity.

### Alumni Discovery: Filtered Supabase query with client-side score enrichment

- Alumni are queried with `user_type = 'alumni'` filter.
- Field and skill filters applied at the database level where possible (field_id) and post-query for junction tables (skills).
- Authority scores and post counts are fetched in bulk and merged client-side.
- Sorting by authority is done client-side after score computation.

## Consequences

- **Positive**: No external search dependencies. Full-text search is accurate and fast for MVP scale. Authority scores are always consistent.
- **Tradeoff**: Full-text search with `tsvector` is English-language optimized. Skill-based filtering requires post-query processing due to junction table structure.
- **Risk**: At very large scale (10k+ users), the on-read authority computation may need to be replaced with a materialized approach. This is acceptable for MVP.
- **Follow-up**: Consider adding a `search_vector` that includes skill names via trigger if skill-name search performance becomes important.
