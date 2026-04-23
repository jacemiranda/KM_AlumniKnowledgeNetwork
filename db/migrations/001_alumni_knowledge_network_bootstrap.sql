begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'moderator', 'end_user');
  end if;

  if not exists (select 1 from pg_type where typname = 'user_type') then
    create type public.user_type as enum ('student', 'alumni');
  end if;

  if not exists (select 1 from pg_type where typname = 'profile_status') then
    create type public.profile_status as enum ('active', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'post_type') then
    create type public.post_type as enum ('information', 'question');
  end if;

  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('published', 'hidden', 'removed');
  end if;

  if not exists (select 1 from pg_type where typname = 'vote_type') then
    create type public.vote_type as enum ('upvote', 'downvote');
  end if;

  if not exists (select 1 from pg_type where typname = 'badge_category') then
    create type public.badge_category as enum ('contribution', 'recognition', 'engagement', 'milestone');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type public.notification_type as enum ('tagged_in_post', 'new_comment', 'badge_awarded', 'moderation_notice', 'general');
  end if;
end
$$;

create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.app_role not null default 'end_user',
  user_type public.user_type,
  status public.profile_status not null default 'active',
  is_first_time_setup_complete boolean not null default false,
  name text not null default '',
  bio text,
  profile_picture_url text,
  field_id uuid references public.fields (id) on delete set null,
  posts_created_count integer not null default 0,
  posts_tagged_in_count integer not null default 0,
  comments_count integer not null default 0,
  authority_score integer not null default 0,
  badges_count integer not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_skills (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, skill_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  field_id uuid not null references public.fields (id) on delete restrict,
  post_type public.post_type not null,
  tagged_alumni_id uuid references public.profiles (id) on delete set null,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_check check (char_length(trim(title)) > 0),
  constraint posts_content_check check (char_length(trim(content)) > 0)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, tag_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_content_check check (char_length(trim(content)) > 0)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid not null references public.profiles (id) on delete cascade,
  target_profile_id uuid not null references public.profiles (id) on delete cascade,
  vote_type public.vote_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint votes_self_vote_check check (voter_id <> target_profile_id),
  unique (voter_id, target_profile_id)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  description text,
  category public.badge_category not null,
  min_authority_score integer not null default 0,
  min_posts_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique (profile_id, badge_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  related_post_id uuid references public.posts (id) on delete set null,
  related_comment_id uuid references public.comments (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role, user_type, status);
create index if not exists profiles_field_idx on public.profiles (field_id, authority_score desc);
create index if not exists profiles_last_seen_idx on public.profiles (last_seen_at desc);
create index if not exists posts_author_idx on public.posts (author_id, created_at desc);
create index if not exists posts_field_idx on public.posts (field_id, created_at desc);
create index if not exists posts_type_idx on public.posts (post_type, created_at desc);
create index if not exists posts_tagged_alumni_idx on public.posts (tagged_alumni_id, created_at desc);
create index if not exists comments_post_idx on public.comments (post_id, created_at asc);
create index if not exists votes_target_idx on public.votes (target_profile_id, updated_at desc);
create index if not exists notifications_profile_idx on public.notifications (profile_id, is_read, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(p_uid, auth.uid())
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.is_moderator_or_admin(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(p_uid, auth.uid())
      and role in ('admin', 'moderator')
      and status = 'active'
  );
$$;

create or replace function public.refresh_profile_authority_score(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_score integer;
begin
  select
    coalesce(sum(case when vote_type = 'upvote' then 1 else -1 end), 0)
  into v_score
  from public.votes
  where target_profile_id = p_profile_id;

  update public.profiles
  set authority_score = coalesce(v_score, 0),
      updated_at = now()
  where id = p_profile_id;
end;
$$;

create or replace function public.sync_vote_authority_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_profile_authority_score(old.target_profile_id);
    return old;
  end if;

  perform public.refresh_profile_authority_score(new.target_profile_id);
  return new;
end;
$$;

create or replace function public.refresh_profile_counts(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_posts integer;
  v_tagged integer;
  v_comments integer;
  v_badges integer;
begin
  select count(*) into v_posts
  from public.posts
  where author_id = p_profile_id
    and status = 'published';

  select count(*) into v_tagged
  from public.posts
  where tagged_alumni_id = p_profile_id
    and status = 'published';

  select count(*) into v_comments
  from public.comments
  where author_id = p_profile_id
    and status = 'published';

  select count(*) into v_badges
  from public.user_badges
  where profile_id = p_profile_id;

  update public.profiles
  set posts_created_count = coalesce(v_posts, 0),
      posts_tagged_in_count = coalesce(v_tagged, 0),
      comments_count = coalesce(v_comments, 0),
      badges_count = coalesce(v_badges, 0),
      updated_at = now()
  where id = p_profile_id;
end;
$$;

create or replace function public.sync_profile_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_table_name = 'posts' then
    if tg_op = 'DELETE' then
      perform public.refresh_profile_counts(old.author_id);
      if old.tagged_alumni_id is not null then
        perform public.refresh_profile_counts(old.tagged_alumni_id);
      end if;
      return old;
    end if;

    perform public.refresh_profile_counts(new.author_id);
    if new.tagged_alumni_id is not null then
      perform public.refresh_profile_counts(new.tagged_alumni_id);
    end if;
    if tg_op = 'UPDATE' and old.tagged_alumni_id is not null and old.tagged_alumni_id <> new.tagged_alumni_id then
      perform public.refresh_profile_counts(old.tagged_alumni_id);
    end if;
    return new;
  end if;

  if tg_table_name = 'comments' then
    if tg_op = 'DELETE' then
      perform public.refresh_profile_counts(old.author_id);
      return old;
    end if;

    perform public.refresh_profile_counts(new.author_id);
    return new;
  end if;

  if tg_table_name = 'user_badges' then
    if tg_op = 'DELETE' then
      perform public.refresh_profile_counts(old.profile_id);
      return old;
    end if;

    perform public.refresh_profile_counts(new.profile_id);
    return new;
  end if;

  return null;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := coalesce(new.raw_user_meta_data ->> 'full_name', new.email);

  insert into public.profiles (
    id,
    email,
    name,
    role,
    status,
    last_seen_at
  )
  values (
    new.id,
    new.email,
    v_name,
    'end_user',
    'active',
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists set_fields_updated_at on public.fields;
create trigger set_fields_updated_at
before update on public.fields
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

drop trigger if exists set_votes_updated_at on public.votes;
create trigger set_votes_updated_at
before update on public.votes
for each row execute function public.set_updated_at();

drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at
before update on public.badges
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

drop trigger if exists votes_refresh_authority_score on public.votes;
create trigger votes_refresh_authority_score
after insert or update or delete on public.votes
for each row execute function public.sync_vote_authority_score();

drop trigger if exists posts_refresh_profile_counts on public.posts;
create trigger posts_refresh_profile_counts
after insert or update or delete on public.posts
for each row execute function public.sync_profile_counts();

drop trigger if exists comments_refresh_profile_counts on public.comments;
create trigger comments_refresh_profile_counts
after insert or update or delete on public.comments
for each row execute function public.sync_profile_counts();

drop trigger if exists user_badges_refresh_profile_counts on public.user_badges;
create trigger user_badges_refresh_profile_counts
after insert or delete on public.user_badges
for each row execute function public.sync_profile_counts();

alter table public.fields enable row level security;
alter table public.skills enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_skills enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.notifications enable row level security;

drop policy if exists fields_select on public.fields;
create policy fields_select on public.fields
for select
using (true);

drop policy if exists fields_manage on public.fields;
create policy fields_manage on public.fields
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists skills_select on public.skills;
create policy skills_select on public.skills
for select
using (true);

drop policy if exists skills_manage on public.skills;
create policy skills_manage on public.skills
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select
using (
  public.is_moderator_or_admin()
  or status = 'active'
);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = old.role
  and status = old.status
);

drop policy if exists profiles_moderator_admin_manage on public.profiles;
create policy profiles_moderator_admin_manage on public.profiles
for update
using (public.is_moderator_or_admin())
with check (
  public.is_moderator_or_admin()
  and (
    public.is_admin()
    or (
      role <> 'admin'
      and role <> 'moderator'
    )
  )
);

drop policy if exists profile_skills_select on public.profile_skills;
create policy profile_skills_select on public.profile_skills
for select
using (true);

drop policy if exists profile_skills_manage_self on public.profile_skills;
create policy profile_skills_manage_self on public.profile_skills
for all
using (profile_id = auth.uid() or public.is_moderator_or_admin())
with check (profile_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
for select
using (
  public.is_moderator_or_admin()
  or status = 'published'
);

drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts
for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

drop policy if exists posts_update_self_or_moderator on public.posts;
create policy posts_update_self_or_moderator on public.posts
for update
using (author_id = auth.uid() or public.is_moderator_or_admin())
with check (author_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists tags_select on public.tags;
create policy tags_select on public.tags
for select
using (true);

drop policy if exists tags_insert on public.tags;
create policy tags_insert on public.tags
for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

drop policy if exists tags_update_moderator_admin on public.tags;
create policy tags_update_moderator_admin on public.tags
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists post_tags_select on public.post_tags;
create policy post_tags_select on public.post_tags
for select
using (true);

drop policy if exists post_tags_manage on public.post_tags;
create policy post_tags_manage on public.post_tags
for all
using (
  exists (
    select 1 from public.posts p
    where p.id = post_id
      and (p.author_id = auth.uid() or public.is_moderator_or_admin())
  )
)
with check (
  exists (
    select 1 from public.posts p
    where p.id = post_id
      and (p.author_id = auth.uid() or public.is_moderator_or_admin())
  )
);

drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
for select
using (
  public.is_moderator_or_admin()
  or status = 'published'
);

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

drop policy if exists comments_update_self_or_moderator on public.comments;
create policy comments_update_self_or_moderator on public.comments
for update
using (author_id = auth.uid() or public.is_moderator_or_admin())
with check (author_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists votes_select on public.votes;
create policy votes_select on public.votes
for select
using (true);

drop policy if exists votes_insert on public.votes;
create policy votes_insert on public.votes
for insert
with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

drop policy if exists votes_update_self on public.votes;
create policy votes_update_self on public.votes
for update
using (voter_id = auth.uid())
with check (voter_id = auth.uid());

drop policy if exists votes_delete_self on public.votes;
create policy votes_delete_self on public.votes
for delete
using (voter_id = auth.uid());

drop policy if exists badges_select on public.badges;
create policy badges_select on public.badges
for select
using (is_active = true or public.is_moderator_or_admin());

drop policy if exists badges_manage on public.badges;
create policy badges_manage on public.badges
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists user_badges_select on public.user_badges;
create policy user_badges_select on public.user_badges
for select
using (true);

drop policy if exists user_badges_manage on public.user_badges;
create policy user_badges_manage on public.user_badges
for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

drop policy if exists notifications_select_self on public.notifications;
create policy notifications_select_self on public.notifications
for select
using (profile_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists notifications_update_self on public.notifications;
create policy notifications_update_self on public.notifications
for update
using (profile_id = auth.uid() or public.is_moderator_or_admin())
with check (profile_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists notifications_insert_moderator_admin on public.notifications;
create policy notifications_insert_moderator_admin on public.notifications
for insert
with check (public.is_moderator_or_admin());

insert into public.fields (name, slug, description)
values
  ('Software Development', 'software-development', 'Programming, software engineering, and application development'),
  ('Design', 'design', 'UI, UX, visual design, and creative problem solving'),
  ('Data and Analytics', 'data-and-analytics', 'Data analysis, business intelligence, and data-driven decision making'),
  ('Business and Entrepreneurship', 'business-and-entrepreneurship', 'Business strategy, startups, and professional growth'),
  ('Education and Research', 'education-and-research', 'Academic guidance, learning, and research practice')
on conflict (slug) do nothing;

insert into public.badges (code, name, description, category, min_authority_score, min_posts_count)
values
  ('FIRST_POST', 'First Contribution', 'Awarded for publishing the first post.', 'milestone', 0, 1),
  ('HELPFUL_MEMBER', 'Helpful Member', 'Awarded for receiving positive recognition from the community.', 'recognition', 5, 1),
  ('KNOWLEDGE_SHARER', 'Knowledge Sharer', 'Awarded for consistent contribution to the feed.', 'contribution', 10, 3),
  ('RISING_AUTHORITY', 'Rising Authority', 'Awarded for building a strong authority score.', 'engagement', 15, 2)
on conflict (code) do nothing;

commit;
