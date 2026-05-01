# Moderation and Field Governance

## Moderation Roles

### Moderator
- Block and unblock users
- Moderate (remove or hide) posts and comments
- Manage badge types
- Manage field list
- Review basic analytics

### Admin
- All Moderator permissions
- Assign and change user roles
- Override Moderator decisions
- Highest-level governance authority

## User Blocking Rules
- A blocked user cannot post, comment, or vote
- Blocking is reversible by a Moderator or Admin
- Blocked status is stored in `profiles.is_blocked`
- Reason for block should be noted in moderation logs (if implemented)

## Post Moderation Rules
- Moderators can change post status to hidden or removed
- Status is stored in `posts.status`
- Moderated posts are removed from the feed but not permanently deleted in the MVP
- The author receives a moderation notice notification

## Comment Moderation Rules
- Same status mechanism as posts (`comments.status`)
- Moderated comments are hidden from the thread
- The author receives a notification

## Field Governance Rules
- Fields are predefined and admin-managed (`fields` table)
- Fields can be activated or deactivated via User Management
- Inactive fields do not appear in post creation or filters
- Field changes should be logged in the decision log for traceability

## Escalation Path
1. User flags or reports content (outside MVP scope, manual for now)
2. Moderator reviews and takes action (block, moderate, or dismiss)
3. If disputed, Admin reviews and may override
4. Decision is noted in moderation log
