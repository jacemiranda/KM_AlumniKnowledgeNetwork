begin;

------------------------------------------------------------------------
-- notifications enum
------------------------------------------------------------------------
create type public.notification_type as enum (
  'tagged_in_post',
  'new_comment',
  'badge_earned',
  'moderation_notice'
);

------------------------------------------------------------------------
-- notifications table
------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  actor_id uuid references public.profiles (id) on delete set null,
  related_post_id uuid references public.posts (id) on delete cascade,
  related_comment_id uuid references public.comments (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- Indexes for common queries
create index if not exists notifications_user_id_is_read_idx on public.notifications (user_id, is_read);
create index if not exists notifications_user_id_created_at_idx on public.notifications (user_id, created_at desc);
create index if not exists notifications_type_idx on public.notifications (type);

------------------------------------------------------------------------
-- RLS: notifications
------------------------------------------------------------------------
alter table public.notifications enable row level security;

create policy notifications_select on public.notifications
for select
using (user_id = auth.uid());

create policy notifications_update on public.notifications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Note: INSERT is restricted to service role only (no client-side inserts)
-- This ensures notifications can only be created by the backend/system

------------------------------------------------------------------------
-- Helper Functions
------------------------------------------------------------------------

create or replace function public.mark_notification_read(notification_id uuid)
returns void
language sql
security invoker
set search_path = public
as $$
  update public.notifications
  set is_read = true, read_at = now()
  where id = notification_id and user_id = auth.uid();
$$;

create or replace function public.mark_all_notifications_read(user_id uuid)
returns void
language sql
security invoker
set search_path = public
as $$
  update public.notifications
  set is_read = true, read_at = now()
  where user_id = $1 and is_read = false;
$$;

create or replace function public.count_unread_notifications(user_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::bigint
  from public.notifications
  where user_id = $1 and is_read = false;
$$;

commit;
