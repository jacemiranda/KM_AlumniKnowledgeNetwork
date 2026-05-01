-- Sprint 2: Comments and Votes schema
-- PR-01: Posts Comments and Tags
begin;

------------------------------------------------------------------------
-- comments
------------------------------------------------------------------------
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

create index if not exists comments_post_idx on public.comments (post_id, created_at asc);
create index if not exists comments_author_idx on public.comments (author_id);

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

------------------------------------------------------------------------
-- votes  (user-to-user voting for authority score)
------------------------------------------------------------------------
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid not null references public.profiles (id) on delete cascade,
  target_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null,
  created_at timestamptz not null default now(),
  constraint votes_value_check check (value in (-1, 1)),
  constraint votes_no_self check (voter_id <> target_id),
  constraint votes_unique_pair unique (voter_id, target_id)
);

create index if not exists votes_target_idx on public.votes (target_id);
create index if not exists votes_voter_target_idx on public.votes (voter_id, target_id);

------------------------------------------------------------------------
-- RLS: comments
------------------------------------------------------------------------
alter table public.comments enable row level security;

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

drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments
for update
using (author_id = auth.uid() or public.is_moderator_or_admin())
with check (author_id = auth.uid() or public.is_moderator_or_admin());

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
for delete
using (author_id = auth.uid() or public.is_moderator_or_admin());

------------------------------------------------------------------------
-- RLS: votes
------------------------------------------------------------------------
alter table public.votes enable row level security;

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

drop policy if exists votes_update on public.votes;
create policy votes_update on public.votes
for update
using (voter_id = auth.uid())
with check (voter_id = auth.uid());

drop policy if exists votes_delete on public.votes;
create policy votes_delete on public.votes
for delete
using (voter_id = auth.uid());

commit;
