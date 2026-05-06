-- Allow any authenticated user to insert new skills.
-- Updates and deletes remain restricted to moderators/admins via skills_manage.
drop policy if exists skills_insert_authenticated on public.skills;
create policy skills_insert_authenticated on public.skills
for insert
with check (auth.role() = 'authenticated');
