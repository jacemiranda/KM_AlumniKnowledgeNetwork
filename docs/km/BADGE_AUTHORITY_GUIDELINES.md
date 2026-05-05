# Badge and Authority Guidelines

## Badge Purpose
Badges recognize knowledge contribution milestones.
They support the Internalization phase of SECI by making visible the growth
of a user's contribution and recognition.

## MVP Badge Criteria (Suggested)

| Badge | Criteria | Notes |
|---|---|---|
| First Contribution | User creates their first post | Awarded automatically |
| Knowledge Sharer | User reaches 5 upvotes total | First authority milestone |
| Community Voice | User reaches 25 upvotes total | Mid-tier recognition |
| Knowledge Leader | User reaches 100 upvotes total | Top-tier recognition |
| Active Commenter | User posts 10 or more comments | Participation badge |
| Tagged Expert | User is tagged in 5 or more posts | Community recognition |

## Badge Award Logic
- Badges are awarded automatically based on vote totals and activity counts
- Badge criteria are evaluated on each relevant event (vote cast, comment posted, post tagged)
- Each badge is awarded once per user (not repeated)
- Badge history is stored in `user_badges` with `awarded_at` timestamp

## Authority Score and Recognition Rationale
- Authority score = upvotes received minus downvotes received
- It is a simple, transparent measure that users can understand and trust
- It directly reflects community recognition of knowledge quality
- The score is visible on profiles, search results, alumni cards, and the leaderboard

## Moderator and Admin Control
- Admins and Moderators can manage available badge types via the User Management page
- Badges cannot be manually awarded to users in the MVP (automatic only)
- Admins can deactivate a badge type, preventing it from being awarded going forward
