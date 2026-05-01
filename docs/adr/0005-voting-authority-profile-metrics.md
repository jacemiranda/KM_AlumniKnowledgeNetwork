# ADR-0005: Voting Authority and Profile Metrics Architecture

## Status

Accepted

## Context

Sprint 2 requires users to vote on contributors, see authority score effects, and expose profile contribution metrics without adding private messaging, recommendation logic, or advanced analytics. The current Sprint 2 implementation includes `votes`, `posts`, and `comments`, plus helper functions for authority and contribution counts.

The architecture needed to decide:

1. How votes should map to authority score.
2. Whether authority should be stored, materialized, or computed on read.
3. Which contribution metrics should support profile visibility in the MVP.

## Options Considered

- **Option A: User-to-user votes with compute-on-read authority** - Store each viewer's vote once per target profile and sum values when authority is needed.
- **Option B: Store an `authority_score` column on `profiles`** - Faster reads but requires triggers or application code to keep the value synchronized.
- **Option C: Materialized leaderboard or authority view** - Useful for larger datasets, but adds refresh complexity before the MVP needs it.

## Decision

Use the existing `votes` table as the source of authority. Each vote is a user-to-user signal with `value` restricted to `1` or `-1`, a unique `(voter_id, target_id)` pair, and a database-level self-vote constraint.

Authority score is computed as the net total of received votes:

```text
authority score = sum(votes.value where target_id = profile.id)
```

For MVP profile metrics, use the existing feed tables and helper functions:

- Posts created: published posts where `author_id` is the profile.
- Posts tagged in: published posts where `tagged_alumni_id` is the profile.
- Comments activity: published comments where `author_id` is the profile.
- Authority score: net received votes from `votes`.

The frontend should still prevent self-voting for usability, but the database constraint remains the source of enforcement.

## Consequences

- Keeps authority consistent with the source vote rows and avoids stale cached score columns.
- Reuses the existing Supabase PostgreSQL schema and RLS policy model.
- Keeps Sprint 2 implementation simple enough for MVP scale.
- Allows search, alumni discovery, profile metrics, and future leaderboard work to share the same authority definition.
- Large-scale ranking may later need a materialized view or cached score, but that is intentionally deferred until the MVP requires it.
