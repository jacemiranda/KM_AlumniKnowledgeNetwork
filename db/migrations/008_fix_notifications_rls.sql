begin;

------------------------------------------------------------------------
-- Fix notifications RLS: Allow authenticated users to insert notifications
------------------------------------------------------------------------

-- Drop the old comment that implied INSERT was restricted
-- Allow any authenticated user to create notifications
-- (user_id is controlled by application logic)
drop policy if exists notifications_insert on public.notifications;

create policy notifications_insert on public.notifications
for insert
to authenticated
with check (true);

commit;
