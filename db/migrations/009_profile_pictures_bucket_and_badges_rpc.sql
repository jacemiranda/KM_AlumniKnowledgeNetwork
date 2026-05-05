-- Sprint 3: Badges RPC hardening
-- PR-01: Badges Leaderboard and Analytics
begin;

------------------------------------------------------------------------
-- RPC: check_and_award_badges
-- Ensures the function exists for the client call
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
  v_post_count := public.count_user_posts(p_profile_id);
  v_comment_count := public.count_user_comments(p_profile_id);
  v_authority := public.compute_authority_score(p_profile_id);
  v_upvotes_received := public.count_upvotes_received(p_profile_id);
  v_upvotes_given := public.count_upvotes_given(p_profile_id);

  select (is_first_time_setup_complete = true and field_id is not null)
  into v_profile_complete
  from public.profiles
  where id = p_profile_id;

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

commit;
