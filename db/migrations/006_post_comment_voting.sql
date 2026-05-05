begin;

drop function if exists public.compute_authority_score;
drop table if exists public.votes cascade;

------------------------------------------------------------------------
-- post_votes
------------------------------------------------------------------------
create table if not exists public.post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  voter_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null,
  created_at timestamptz not null default now(),
  constraint post_votes_value_check check (value in (-1, 1)),
  constraint post_votes_unique_pair unique (post_id, voter_id)
);

create index if not exists post_votes_post_idx on public.post_votes (post_id);
create index if not exists post_votes_voter_idx on public.post_votes (voter_id);

------------------------------------------------------------------------
-- comment_votes
------------------------------------------------------------------------
create table if not exists public.comment_votes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  voter_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null,
  created_at timestamptz not null default now(),
  constraint comment_votes_value_check check (value in (-1, 1)),
  constraint comment_votes_unique_pair unique (comment_id, voter_id)
);

create index if not exists comment_votes_comment_idx on public.comment_votes (comment_id);
create index if not exists comment_votes_voter_idx on public.comment_votes (voter_id);

------------------------------------------------------------------------
-- RLS: post_votes
------------------------------------------------------------------------
alter table public.post_votes enable row level security;

create policy post_votes_select on public.post_votes
for select
using (true);

create policy post_votes_insert on public.post_votes
for insert
with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

create policy post_votes_update on public.post_votes
for update
using (voter_id = auth.uid())
with check (voter_id = auth.uid());

create policy post_votes_delete on public.post_votes
for delete
using (voter_id = auth.uid());

------------------------------------------------------------------------
-- RLS: comment_votes
------------------------------------------------------------------------
alter table public.comment_votes enable row level security;

create policy comment_votes_select on public.comment_votes
for select
using (true);

create policy comment_votes_insert on public.comment_votes
for insert
with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
  )
);

create policy comment_votes_update on public.comment_votes
for update
using (voter_id = auth.uid())
with check (voter_id = auth.uid());

create policy comment_votes_delete on public.comment_votes
for delete
using (voter_id = auth.uid());

------------------------------------------------------------------------
-- compute_authority_score
------------------------------------------------------------------------
create or replace function public.compute_authority_score(p_profile_id uuid)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select (
    (select coalesce(sum(v.value), 0)
     from public.post_votes v
     join public.posts p on p.id = v.post_id
     where p.author_id = p_profile_id)
    +
    (select coalesce(sum(v.value), 0)
     from public.comment_votes v
     join public.comments c on c.id = v.comment_id
     where c.author_id = p_profile_id)
  );
$$;

commit;
