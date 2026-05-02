begin;

-- ════════════════════════════════════════════════════════════════════════
-- Migration 005: Moderation Helpers & Default Admin Seeding
-- Sprint 3 PR-02: Moderation and User Management
-- ════════════════════════════════════════════════════════════════════════

-- ── Admin-only helper ─────────────────────────────────────────────────

create or replace function public.is_admin(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = p_uid and role = 'admin'
  );
$$;

-- ── Moderation action enum ────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_type where typname = 'moderation_action') then
    create type public.moderation_action as enum (
      'block_user',
      'unblock_user',
      'hide_post',
      'remove_post',
      'restore_post',
      'hide_comment',
      'remove_comment',
      'restore_comment',
      'change_role',
      'award_badge',
      'revoke_badge',
      'toggle_field'
    );
  end if;
end
$$;

-- ── Moderation log table ──────────────────────────────────────────────

create table if not exists public.moderation_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles (id) on delete cascade,
  action public.moderation_action not null,
  target_type text not null,       -- 'user' | 'post' | 'comment' | 'field' | 'badge'
  target_id uuid not null,
  reason text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_moderation_log_actor on public.moderation_log (actor_id);
create index if not exists idx_moderation_log_target on public.moderation_log (target_type, target_id);
create index if not exists idx_moderation_log_created on public.moderation_log (created_at desc);

-- ── RLS for moderation_log ────────────────────────────────────────────

alter table public.moderation_log enable row level security;

-- Moderator/Admin can read all logs
create policy "moderation_log_select" on public.moderation_log
for select
using (public.is_moderator_or_admin());

-- Moderator/Admin can insert logs
create policy "moderation_log_insert" on public.moderation_log
for insert
with check (public.is_moderator_or_admin());

-- ── Admin-only: role update on profiles ───────────────────────────────
-- Note: The existing profiles UPDATE policy already allows moderator/admin
-- to update profiles. This adds a specific check: only admin can change role.
-- We handle this at the application layer since RLS column-level checks
-- are complex. The service will verify is_admin() before role changes.

-- ── Seed default admin accounts ───────────────────────────────────────
-- These emails will be promoted to admin role when they sign up via OAuth.
-- If the profile already exists, update its role; otherwise this is a no-op
-- until the user signs in for the first time.

do $$
begin
  -- sanchezjm76@gmail.com
  update public.profiles
  set role = 'admin'
  where email = 'sanchezjm76@gmail.com'
    and role != 'admin';

  -- jcesperanza@neu.edu.ph
  update public.profiles
  set role = 'admin'
  where email = 'jcesperanza@neu.edu.ph'
    and role != 'admin';
end
$$;

-- Also create a trigger that auto-promotes these emails on profile creation
create or replace function public.auto_promote_admin()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.email in ('sanchezjm76@gmail.com', 'jcesperanza@neu.edu.ph') then
    new.role := 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_auto_promote_admin on public.profiles;
create trigger trg_auto_promote_admin
  before insert on public.profiles
  for each row
  execute function public.auto_promote_admin();

commit;
