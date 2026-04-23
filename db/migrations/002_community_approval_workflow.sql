begin;

create or replace view public.v_user_authority_leaderboard as
select
  p.id,
  p.name,
  p.role,
  p.user_type,
  p.field_id,
  f.name as field_name,
  p.authority_score,
  p.posts_created_count,
  p.posts_tagged_in_count,
  p.comments_count,
  p.badges_count,
  rank() over (
    order by p.authority_score desc, p.posts_created_count desc, p.comments_count desc, p.created_at asc
  ) as global_rank,
  rank() over (
    partition by p.field_id
    order by p.authority_score desc, p.posts_created_count desc, p.comments_count desc, p.created_at asc
  ) as field_rank
from public.profiles p
left join public.fields f on f.id = p.field_id
where p.status = 'active';

create or replace view public.v_basic_platform_analytics as
select
  (select count(*) from public.profiles) as total_users,
  (select count(*) from public.profiles where role = 'admin') as total_admins,
  (select count(*) from public.profiles where role = 'moderator') as total_moderators,
  (select count(*) from public.profiles where role = 'end_user' and user_type = 'student') as total_students,
  (select count(*) from public.profiles where role = 'end_user' and user_type = 'alumni') as total_alumni,
  (select count(*) from public.posts where status = 'published') as total_posts,
  (select count(*) from public.comments where status = 'published') as total_comments,
  (select count(*) from public.user_badges) as total_badges_awarded,
  (
    select count(*)
    from public.profiles
    where role = 'end_user'
      and user_type = 'student'
      and last_seen_at > now() - interval '15 minutes'
  ) as current_online_students,
  (
    select count(*)
    from public.profiles
    where role = 'end_user'
      and user_type = 'alumni'
      and last_seen_at > now() - interval '15 minutes'
  ) as current_online_alumni;

create or replace function public.touch_last_seen(p_uid uuid default auth.uid())
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set last_seen_at = now(),
      updated_at = now()
  where id = coalesce(p_uid, auth.uid());
$$;

create or replace function public.award_eligible_badges(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_badges (profile_id, badge_id)
  select
    p.id,
    b.id
  from public.profiles p
  join public.badges b
    on b.is_active = true
   and p.authority_score >= b.min_authority_score
   and p.posts_created_count >= b.min_posts_count
  where p.id = p_profile_id
  on conflict (profile_id, badge_id) do nothing;

  perform public.refresh_profile_counts(p_profile_id);
end;
$$;

create or replace function public.sync_badges_after_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
begin
  if tg_table_name = 'votes' then
    v_profile_id := coalesce(new.target_profile_id, old.target_profile_id);
  elsif tg_table_name = 'posts' then
    v_profile_id := coalesce(new.author_id, old.author_id);
  else
    return coalesce(new, old);
  end if;

  perform public.award_eligible_badges(v_profile_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists votes_award_badges on public.votes;
create trigger votes_award_badges
after insert or update or delete on public.votes
for each row execute function public.sync_badges_after_activity();

drop trigger if exists posts_award_badges on public.posts;
create trigger posts_award_badges
after insert or update or delete on public.posts
for each row execute function public.sync_badges_after_activity();

grant select on public.v_user_authority_leaderboard to authenticated;
grant select on public.v_basic_platform_analytics to authenticated;
grant execute on function public.touch_last_seen(uuid) to authenticated;
grant execute on function public.award_eligible_badges(uuid) to authenticated;

commit;
