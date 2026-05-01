-- Sprint 2: Search indexes and authority score helper
-- PR-02: Search and Alumni Discovery
begin;

------------------------------------------------------------------------
-- full-text search: profiles
------------------------------------------------------------------------
alter table public.profiles
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(bio, '') || ' ' ||
      coalesce(email, '')
    )
  ) stored;

create index if not exists profiles_search_idx
  on public.profiles using gin (search_vector);

------------------------------------------------------------------------
-- full-text search: posts
------------------------------------------------------------------------
alter table public.posts
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(content, '')
    )
  ) stored;

create index if not exists posts_search_idx
  on public.posts using gin (search_vector);

------------------------------------------------------------------------
-- helper: compute authority score for a profile
------------------------------------------------------------------------
create or replace function public.compute_authority_score(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(value), 0)
  from public.votes
  where target_id = p_profile_id;
$$;

------------------------------------------------------------------------
-- helper: count posts authored by a profile
------------------------------------------------------------------------
create or replace function public.count_user_posts(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)
  from public.posts
  where author_id = p_profile_id
    and status = 'published';
$$;

------------------------------------------------------------------------
-- helper: count comments authored by a profile
------------------------------------------------------------------------
create or replace function public.count_user_comments(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)
  from public.comments
  where author_id = p_profile_id
    and status = 'published';
$$;

------------------------------------------------------------------------
-- helper: count posts where profile is tagged as alumni
------------------------------------------------------------------------
create or replace function public.count_tagged_in_posts(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)
  from public.posts
  where tagged_alumni_id = p_profile_id
    and status = 'published';
$$;

commit;
