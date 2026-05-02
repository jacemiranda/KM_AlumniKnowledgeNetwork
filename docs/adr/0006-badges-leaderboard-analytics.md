# ADR-0006: Badges, Leaderboard, and Basic Analytics

## Status

Accepted

## Context

Sprint 3 requires badge logic, a leaderboard page, and basic analytics. The MVP specifies:

- A badge system with criteria managed by Moderator and Admin.
- A leaderboard page showing global ranking and field-filtered ranking.
- Basic analytics showing total students, total alumni, and online counts.

The existing schema has user-to-user voting (authority score), posts, comments, and profiles. There is no post-level voting, no view tracking, no login streak tracking, and no time-of-day activity logs.

## Options Considered

1. **Complex rules engine** — Build a configurable badge rules engine with triggers, temporal conditions, and dynamic thresholds. Rejected because it exceeds MVP scope and timeline.

2. **All manual badges** — Only allow Moderator/Admin to award badges. Rejected because it removes gamification motivation and creates operational burden.

3. **Threshold-based auto-awarding with manual fallback** — Define badge thresholds in the database. A function evaluates profile metrics against thresholds and inserts missing badges. Badges that require missing infrastructure are marked as manual-only. Chosen approach.

## Decision

### Badges

- 16 Tier 1 badges are seeded with threshold-based auto-awarding using current schema data (post count, comment count, authority score, upvotes received, upvotes given, profile completion).
- The `check_and_award_badges(profile_id)` function evaluates all non-manual thresholds and inserts any newly eligible badges. It is called on profile page load.
- Future tiers (requiring view tracking, login streaks, comment-level voting, temporal metrics) remain as manual-award badges for Moderator/Admin.

### Leaderboard

- Profiles are ranked by a composite key: authority_score desc, post_count desc, comment_count desc.
- Ranking is computed client-side after bulk-fetching scores, post counts, comment counts, and badge counts.
- Field filtering is supported via a query parameter.
- Top 3 are displayed as podium cards; remaining entries are in a ranked table.

### Analytics

- A `platform_analytics()` database function returns total students, total alumni, total posts, total comments, recently active users (last 15 minutes), and total badges awarded.
- The analytics summary component is gated to Admin and Moderator roles.
- It appears on the leaderboard page and can be embedded in the User Management page (PR-02).

## Consequences

- Positive: Badges auto-award without manual intervention for common milestones.
- Positive: Leaderboard is fully functional with existing data.
- Positive: Analytics provides immediate value for Admin/Moderator users.
- Tradeoff: Tier 2 and Tier 3 badges require additional tracking infrastructure (post views, login streaks, comment voting) which is not part of the MVP.
- Follow-up: PR-02 (Moderation and User Management) can embed the AnalyticsSummary component and add manual badge awarding UI.
