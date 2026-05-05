# Authority and Voting Rules

## Purpose
Voting is the primary mechanism for recognizing knowledge quality.
Authority score is the aggregate measure of a user's contribution value.

## How Voting Works
- Any authenticated user can vote on another user's profile
- Vote types: Upvote or Downvote
- A user cannot vote on their own profile
- One vote per voter per target profile (can be changed)

## Authority Score Formula (MVP)
authority_score = total_upvotes_received - total_downvotes_received. <br>
This is computed from the `votes` table using `target_profile_id`.

## What Voting Signals
- Upvote: The community found this user's contributions helpful and valuable
- Downvote: The community found this user's contributions unhelpful, low quality, or inappropriate

## Voting Standards (User Guidelines)
Users should upvote contributors who:
- Share clear, accurate, and useful knowledge
- Answer questions with practical, applicable advice
- Engage constructively in comment discussions

Users should not:
- Vote based on personal relationships or bias
- Vote to retaliate or harm a user's score unfairly
- Use voting to manipulate the leaderboard

## Authority Score and Badges
- Authority score feeds directly into badge award criteria
- Higher authority score = higher leaderboard ranking
- Authority score is visible on user profiles and the leaderboard

## Moderator and Admin Role
- Moderators and Admins can review voting abuse patterns via analytics
- Moderation action can be taken against users engaging in vote manipulation
