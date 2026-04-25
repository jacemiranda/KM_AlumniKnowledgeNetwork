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
end
$$;

create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fields_name_check check (char_length(trim(name)) > 0),
  constraint fields_slug_check check (char_length(trim(slug)) > 0)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint skills_name_check check (char_length(trim(name)) > 0),
  constraint skills_slug_check check (char_length(trim(slug)) > 0)
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
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_check check (position('@' in email) > 1)
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
  created_at timestamptz not null default now(),
  constraint tags_name_check check (char_length(trim(name)) > 0),
  constraint tags_slug_check check (char_length(trim(slug)) > 0)
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, tag_id)
);

create index if not exists profiles_role_idx on public.profiles (role, user_type, status);
create index if not exists profiles_field_idx on public.profiles (field_id, status);
create index if not exists profiles_last_seen_idx on public.profiles (last_seen_at desc);
create index if not exists profile_skills_skill_idx on public.profile_skills (skill_id);
create index if not exists posts_author_idx on public.posts (author_id, created_at desc);
create index if not exists posts_field_idx on public.posts (field_id, created_at desc);
create index if not exists posts_type_idx on public.posts (post_type, created_at desc);
create index if not exists posts_tagged_alumni_idx on public.posts (tagged_alumni_id, created_at desc);
create index if not exists post_tags_tag_idx on public.post_tags (tag_id);

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.fields enable row level security;
alter table public.skills enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_skills enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;

drop policy if exists fields_select on public.fields;
create policy fields_select on public.fields
for select
using (is_active = true or public.is_moderator_or_admin());

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
using (
  id = auth.uid()
  and status = 'active'
)
with check (
  id = auth.uid()
  and role = 'end_user'
  and status = 'active'
);

drop policy if exists profiles_moderator_admin_manage on public.profiles;
create policy profiles_moderator_admin_manage on public.profiles
for update
using (
  public.is_moderator_or_admin()
  and (
    public.is_admin()
    or role = 'end_user'
  )
)
with check (
  public.is_moderator_or_admin()
  and (
    public.is_admin()
    or role = 'end_user'
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
for update
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

insert into public.fields (name, slug, description)
values
  ('Software Development', 'software-development', 'Programming, software engineering, and application development'),
  ('Design', 'design', 'UI, UX, visual design, and creative problem solving'),
  ('Data and Analytics', 'data-and-analytics', 'Data analysis, business intelligence, and data-driven decision making'),
  ('Business and Entrepreneurship', 'business-and-entrepreneurship', 'Business strategy, startups, and professional growth'),
  ('Education and Research', 'education-and-research', 'Academic guidance, learning, and research practice')
on conflict (slug) do nothing;

insert into public.skills (name, slug)
values
  ('Frontend Development', 'frontend-development'),
  ('Backend Development', 'backend-development'),
  ('UI/UX Design', 'ui-ux-design'),
  ('Data Analysis', 'data-analysis'),
  ('Career Coaching', 'career-coaching'),
  ('Research Writing', 'research-writing')
on conflict (slug) do nothing;

commit;
