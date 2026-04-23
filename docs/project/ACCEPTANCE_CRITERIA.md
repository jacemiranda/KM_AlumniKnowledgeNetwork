# Acceptance Criteria

This file defines what must be true for the revised MVP to be considered runnable and complete.

## Final App Page Map

The deployed app must include and link to:

- Login Page
- Sign-Up / First-Time Setup Page
- Universal Feed Page
- Profile Page
- Search Results Page
- Alumni / Mentors Page
- Leaderboard Page
- Notifications Modal
- User Management Page

## Role-Based Acceptance

### Student

- Can log in with Google OAuth.
- Can complete first-time profile setup.
- Can browse the Universal Feed.
- Can create posts with field, tags, and post type.
- Can comment on posts.
- Can search by name, field, tags, and skills.
- Can view alumni profiles and the leaderboard.
- Can vote and see profile authority score effects.

### Alumni

- Can log in with Google OAuth.
- Can complete first-time profile setup.
- Can create knowledge posts.
- Can answer through comments.
- Can be tagged in posts.
- Can appear in search, alumni discovery, and leaderboard results.
- Can gain authority score and badges from contribution.

### Moderator

- Can access User Management.
- Can block and unblock users.
- Can moderate posts and comments.
- Can manage fields and badges.
- Can view simple analytics.

### Admin

- Has all Moderator permissions.
- Can manage role assignments.
- Can override moderator actions.
- Can exercise highest-level platform control.

## Quality Checks

- No direct merge to `main`.
- All PRs target `dev`.
- All PRs follow the PR template.
- No secrets committed.
- Supabase RLS policies protect role-based data.
- All major pages have loading, empty, and error states.
- App is responsive enough for desktop and mobile browser use.
- README setup works from a clean clone.
- Final live URL is documented.

## Explicitly Out of Scope

- private messaging
- conversations and messages tables
- password-based authentication
- complex community approval workflow
- video-call integration
- recommendation engine
