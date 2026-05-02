# ADR-0007: Moderation and User Management

## Status

Accepted

## Context

Sprint 3 requires Admin and Moderator roles to block users, moderate posts/comments, assign roles, manage fields/badges, and view analytics. The existing schema already has `profile_status` (active/blocked), `content_status` (published/hidden/removed), and `is_moderator_or_admin()` RLS helper. What's missing is the application-level service, audit trail, and admin UI.

## Decision

### Audit Log
A `moderation_log` table records every moderation action with actor, action type, target, reason, and metadata. This provides accountability and a reviewable history for all admin operations.

### Role Assignment
Only Admin users can change other users' roles. This is enforced at the application layer — the `updateUserRole` service function is called only when `session.user.role === 'admin'`. The existing profiles RLS policy allows admin/moderator to update profiles; the role dropdown is hidden from non-admin UI.

### Default Admin Seeding
Two email addresses (`sanchezjm76@gmail.com`, `jcesperanza@neu.edu.ph`) are automatically promoted to `admin` role via a `BEFORE INSERT` trigger on the `profiles` table, ensuring they have admin access from their first OAuth login.

### Content Moderation Lifecycle
Posts and comments follow the status lifecycle: `published` → `hidden` (reversible) → `removed` (soft delete). Moderators can restore hidden/removed content. This uses the existing `content_status` enum without schema changes.

### User Management Page
A single tabbed page at `/admin` with 5 sections: Users, Content, Fields, Analytics, and Log. The nav link only appears for admin/moderator roles. End users who navigate directly to `/admin` see an access-denied message.

## Consequences

- Positive: Complete moderation workflow without schema changes to core tables.
- Positive: Audit trail provides accountability for all admin actions.
- Positive: Admin seeding ensures project leads have access from first login.
- Tradeoff: Role assignment is enforced at application layer, not RLS column-level. Acceptable for MVP.
