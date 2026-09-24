-- EssayFlow — additive migration (run AFTER schema.sql, once, in SQL Editor).
-- Adds: identity_number from signup metadata, a contact_messages table for the
-- public contact form, and a private Storage bucket for submitted files.

-- ------------------------------------------------------------------
-- 1. handle_new_user: also read identity_number (NIM/NIP) from signup metadata.
--    Password sign-up (src/app/api/auth/register) sends it; Google sign-up
--    still won't have one, so it stays '' until lengkapi-profil sets it.
-- ------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, identity_number, provider, profile_complete)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mahasiswa'),
    coalesce(new.raw_user_meta_data->>'identity_number', ''),
    case when new.raw_app_meta_data->>'provider' = 'google' then 'google' else 'password' end,
    coalesce((new.raw_user_meta_data->>'profile_complete')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ------------------------------------------------------------------
-- 2. Contact form (src/app/(marketing)/kontak) — no email provider wired
--    yet, so messages land here for someone to read from the dashboard.
-- ------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) may submit a message; nobody can
-- read them back through the anon key — read them from the Supabase
-- dashboard's Table Editor, or add an admin policy later.
create policy "contact_messages: anyone can submit" on public.contact_messages
  for insert with check (true);

-- ------------------------------------------------------------------
-- 3. Storage bucket for submitted files (PDF/Word). Private bucket;
--    access goes through signed URLs (src/app/api/uploads).
--    Path convention: submissions/<student_id>/<task_id>/<filename>
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "submissions bucket: student uploads own folder" on storage.objects
  for insert with check (
    bucket_id = 'submissions' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "submissions bucket: student reads own files" on storage.objects
  for select using (
    bucket_id = 'submissions' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Simplification: any authenticated teacher can read any submitted file.
-- File paths aren't guessable (contain the student's uuid), but this is a
-- starting point, not a full security audit — tighten to "teacher of the
-- class this task belongs to" if that matters for your deployment.
create policy "submissions bucket: teacher reads all" on storage.objects
  for select using (
    bucket_id = 'submissions'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'pengajar')
  );
