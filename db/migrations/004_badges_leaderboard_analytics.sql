-- Sprint 3: Badges, Leaderboard helpers, and Analytics
-- PR-01: Badges Leaderboard and Analytics
begin;

------------------------------------------------------------------------
-- enums
------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'badge_category') then
    create type public.badge_category as enum (
      'onboarding',
      'contribution',
      'knowledge',
      'community',
      'milestone',
      'engagement',
      'fun'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'badge_threshold_type') then
    create type public.badge_threshold_type as enum (
      'post_count',
      'comment_count',
      'authority_score',
      'upvotes_received',
      'upvotes_given',
      'profile_complete',
      'manual'
    );
  end if;
end
$$;

------------------------------------------------------------------------
-- badges: badge definitions
------------------------------------------------------------------------
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  category public.badge_category not null,
  icon_name text not null default 'star',
  threshold_type public.badge_threshold_type not null,
  threshold_value integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint badges_name_check check (char_length(trim(name)) > 0),
  constraint badges_slug_check check (char_length(trim(slug)) > 0)
);

------------------------------------------------------------------------
-- user_badges: awarded badges
------------------------------------------------------------------------
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  awarded_by uuid references public.profiles (id) on delete set null,
  constraint user_badges_unique_pair unique (profile_id, badge_id)
);

create index if not exists user_badges_profile_idx on public.user_badges (profile_id);
create index if not exists user_badges_badge_idx on public.user_badges (badge_id);

------------------------------------------------------------------------
-- triggers
------------------------------------------------------------------------
drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at
before update on public.badges
for each row execute function public.set_updated_at();

------------------------------------------------------------------------
-- RLS: badges
------------------------------------------------------------------------
alter table public.badges enable row level security;

drop policy if exists badges_select on public.badges;
create policy badges_select on public.badges
for select
using (is_active = true or public.is_moderator_or_admin());

drop policy if exists badges_manage on public.badges;
create policy badges_manage on public.badges
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

------------------------------------------------------------------------
-- RLS: user_badges
------------------------------------------------------------------------
alter table public.user_badges enable row level security;

drop policy if exists user_badges_select on public.user_badges;
create policy user_badges_select on public.user_badges
for select
using (true);

drop policy if exists user_badges_insert on public.user_badges;
create policy user_badges_insert on public.user_badges
for insert
with check (
  public.is_moderator_or_admin()
  or profile_id = auth.uid()
);

drop policy if exists user_badges_delete on public.user_badges;
create policy user_badges_delete on public.user_badges
for delete
using (public.is_moderator_or_admin());

------------------------------------------------------------------------
-- helper: count upvotes received (votes with value = 1)
------------------------------------------------------------------------
create or replace function public.count_upvotes_received(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)
  from public.votes
  where target_id = p_profile_id
    and value = 1;
$$;

------------------------------------------------------------------------
-- helper: count upvotes given (votes cast with value = 1)
------------------------------------------------------------------------
create or replace function public.count_upvotes_given(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)
  from public.votes
  where voter_id = p_profile_id
    and value = 1;
$$;

------------------------------------------------------------------------
-- check_and_award_badges: evaluate Tier 1 thresholds
------------------------------------------------------------------------
create or replace function public.check_and_award_badges(p_profile_id uuid)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_post_count bigint;
  v_comment_count bigint;
  v_authority bigint;
  v_upvotes_received bigint;
  v_upvotes_given bigint;
  v_profile_complete boolean;
  v_awarded integer := 0;
  v_badge record;
begin
  -- gather metrics once
  v_post_count := public.count_user_posts(p_profile_id);
  v_comment_count := public.count_user_comments(p_profile_id);
  v_authority := public.compute_authority_score(p_profile_id);
  v_upvotes_received := public.count_upvotes_received(p_profile_id);
  v_upvotes_given := public.count_upvotes_given(p_profile_id);

  select (is_first_time_setup_complete = true and field_id is not null)
  into v_profile_complete
  from public.profiles
  where id = p_profile_id;

  -- loop through active non-manual badges and check thresholds
  for v_badge in
    select id, threshold_type, threshold_value
    from public.badges
    where is_active = true
      and threshold_type <> 'manual'
      and id not in (
        select badge_id from public.user_badges where profile_id = p_profile_id
      )
  loop
    if (
      (v_badge.threshold_type = 'post_count' and v_post_count >= v_badge.threshold_value)
      or (v_badge.threshold_type = 'comment_count' and v_comment_count >= v_badge.threshold_value)
      or (v_badge.threshold_type = 'authority_score' and v_authority >= v_badge.threshold_value)
      or (v_badge.threshold_type = 'upvotes_received' and v_upvotes_received >= v_badge.threshold_value)
      or (v_badge.threshold_type = 'upvotes_given' and v_upvotes_given >= v_badge.threshold_value)
      or (v_badge.threshold_type = 'profile_complete' and v_profile_complete = true)
    ) then
      insert into public.user_badges (profile_id, badge_id)
      values (p_profile_id, v_badge.id)
      on conflict (profile_id, badge_id) do nothing;

      v_awarded := v_awarded + 1;
    end if;
  end loop;

  return v_awarded;
end;
$$;

------------------------------------------------------------------------
-- platform_analytics: basic counts for Admin/Moderator
------------------------------------------------------------------------
create or replace function public.platform_analytics()
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select json_build_object(
    'total_students', (select count(*) from public.profiles where user_type = 'student' and status = 'active'),
    'total_alumni', (select count(*) from public.profiles where user_type = 'alumni' and status = 'active'),
    'total_posts', (select count(*) from public.posts where status = 'published'),
    'total_comments', (select count(*) from public.comments where status = 'published'),
    'recently_active', (select count(*) from public.profiles where last_seen_at > now() - interval '15 minutes' and status = 'active'),
    'total_badges_awarded', (select count(*) from public.user_badges)
  );
$$;

------------------------------------------------------------------------
-- seed: Tier 1 badge definitions (16 badges)
------------------------------------------------------------------------

-- 🟢 Onboarding
insert into public.badges (name, slug, description, category, icon_name, threshold_type, threshold_value)
values
  ('First Post', 'first-post', 'Created your first post on the platform.', 'onboarding', 'pencil', 'post_count', 1),
  ('First Comment', 'first-comment', 'Left your first comment on a post.', 'onboarding', 'message-circle', 'comment_count', 1),
  ('First Upvote Received', 'first-upvote-received', 'Received your first upvote from another user.', 'onboarding', 'thumbs-up', 'upvotes_received', 1),
  ('Profile Complete', 'profile-complete', 'Completed your profile setup with all required fields.', 'onboarding', 'user-check', 'profile_complete', 1)
on conflict (slug) do nothing;

-- 💬 Contribution
insert into public.badges (name, slug, description, category, icon_name, threshold_type, threshold_value)
values
  ('Content Creator', 'content-creator', 'Created 25 or more posts sharing knowledge with the community.', 'contribution', 'file-text', 'post_count', 25)
on conflict (slug) do nothing;

-- 🧠 Knowledge & Expertise
insert into public.badges (name, slug, description, category, icon_name, threshold_type, threshold_value)
values
  ('Knowledge Leader', 'knowledge-leader', 'Reached an authority score of 1000 through community recognition.', 'knowledge', 'brain', 'authority_score', 1000),
  ('Top Authority', 'top-authority', 'Reached an authority score of 3000 — among the most respected contributors.', 'knowledge', 'crown', 'authority_score', 3000)
on conflict (slug) do nothing;

-- ❤️ Community & Social
insert into public.badges (name, slug, description, category, icon_name, threshold_type, threshold_value)
values
  ('Supporter', 'supporter', 'Given 100 or more upvotes to recognize others in the community.', 'community', 'heart', 'upvotes_given', 100),
  ('Friendly Voice', 'friendly-voice', 'Left 20 or more comments contributing positively to discussions.', 'community', 'smile', 'comment_count', 20)
on conflict (slug) do nothing;

-- 🎯 Milestones
insert into public.badges (name, slug, description, category, icon_name, threshold_type, threshold_value)
values
  ('10 Posts', 'milestone-10-posts', 'Created 10 posts on the platform.', 'milestone', 'hash', 'post_count', 10),
  ('50 Posts', 'milestone-50-posts', 'Created 50 posts on the platform.', 'milestone', 'hash', 'post_count', 50),
  ('100 Posts', 'milestone-100-posts', 'Created 100 posts on the platform.', 'milestone', 'hash', 'post_count', 100),
  ('100 Upvotes', 'milestone-100-upvotes', 'Received 100 upvotes from the community.', 'milestone', 'trending-up', 'upvotes_received', 100),
  ('500 Upvotes', 'milestone-500-upvotes', 'Received 500 upvotes from the community.', 'milestone', 'trending-up', 'upvotes_received', 500),
  ('1000 Upvotes', 'milestone-1000-upvotes', 'Received 1000 upvotes from the community.', 'milestone', 'trending-up', 'upvotes_received', 1000),
  ('Comment Master', 'comment-master', 'Left 100 or more comments across the platform.', 'milestone', 'message-square', 'comment_count', 100)
on conflict (slug) do nothing;

commit;
