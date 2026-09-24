-- EssayFlow — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Mirrors src/types/domain.ts and src/types/auth.ts. Adjust before production use —
-- RLS policies here are a reasonable starting point, not a full security audit.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------
-- Profiles (1:1 with auth.users; auth.users only holds email/password)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('pengajar','mahasiswa')),
  identity_number text not null default '',
  avatar_url text,
  provider text not null default 'password' check (provider in ('password','google')),
  profile_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up (password or Google).
-- New Google accounts default to 'mahasiswa' + profileComplete=false, matching
-- the onboarding flow in src/lib/auth/auth-service.ts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, provider, profile_complete)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mahasiswa'),
    case when new.raw_app_meta_data->>'provider' = 'google' then 'google' else 'password' end,
    coalesce((new.raw_user_meta_data->>'profile_complete')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------
-- Classes
-- ------------------------------------------------------------------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  program text not null,
  semester text not null,
  code text not null unique,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.class_students (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'menunggu' check (status in ('menunggu','disetujui','ditolak')),
  requested_at timestamptz not null default now(),
  reason text
);

-- ------------------------------------------------------------------
-- Tasks (rubric + settings kept as jsonb — always read/written together)
-- ------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instructions text not null,
  class_id uuid not null references public.classes(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','active','closed','archived')),
  deadline timestamptz not null,
  created_at timestamptz not null default now(),
  rubric jsonb not null default '[]',
  settings jsonb not null default '{}'
);

-- ------------------------------------------------------------------
-- Submissions + versions (assessment kept as jsonb on the version row —
-- matches SubmissionVersion.assessment in src/types/domain.ts)
-- ------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'belum-mengumpulkan',
  final_version int,
  unique (task_id, student_id)
);

create table if not exists public.submission_versions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  version int not null,
  submitted_at timestamptz not null default now(),
  type text not null check (type in ('teks','kode','pdf','word')),
  content text,
  file_name text,
  file_size_kb int,
  late boolean not null default false,
  status text not null,
  assessment jsonb,
  unique (submission_id, version)
);

-- ------------------------------------------------------------------
-- Activities
-- ------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  description text not null,
  at timestamptz not null default now(),
  read boolean not null default false
);

-- ------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.join_requests enable row level security;
alter table public.tasks enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_versions enable row level security;
alter table public.activities enable row level security;

-- Profiles: any signed-in user can look up name/role (needed for class rosters,
-- teacher names on tasks, etc). Only the owner can update their own row.
create policy "profiles: read for authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Classes: teacher owns their classes; enrolled students can read theirs.
create policy "classes: teacher manages own" on public.classes
  for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);
create policy "classes: students read enrolled" on public.classes
  for select using (
    exists (select 1 from public.class_students cs where cs.class_id = id and cs.student_id = auth.uid())
  );

create policy "class_students: teacher manages roster" on public.class_students
  for all using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  );
create policy "class_students: student reads own membership" on public.class_students
  for select using (auth.uid() = student_id);

create policy "join_requests: teacher manages own class" on public.join_requests
  for all using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  );
create policy "join_requests: student manages own" on public.join_requests
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- Tasks: teacher owns tasks in their classes; students read tasks of classes they joined.
create policy "tasks: teacher manages own class tasks" on public.tasks
  for all using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
  );
create policy "tasks: students read tasks of enrolled classes" on public.tasks
  for select using (
    exists (
      select 1 from public.class_students cs
      where cs.class_id = tasks.class_id and cs.student_id = auth.uid()
    )
  );

-- Submissions: student manages their own; teacher reads/grades submissions in their classes.
create policy "submissions: student manages own" on public.submissions
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "submissions: teacher reads/grades class submissions" on public.submissions
  for all using (
    exists (
      select 1 from public.tasks t join public.classes c on c.id = t.class_id
      where t.id = task_id and c.teacher_id = auth.uid()
    )
  );

create policy "submission_versions: student manages own" on public.submission_versions
  for all using (
    exists (select 1 from public.submissions s where s.id = submission_id and s.student_id = auth.uid())
  );
create policy "submission_versions: teacher reads/grades" on public.submission_versions
  for all using (
    exists (
      select 1 from public.submissions s
      join public.tasks t on t.id = s.task_id
      join public.classes c on c.id = t.class_id
      where s.id = submission_id and c.teacher_id = auth.uid()
    )
  );

-- Activities: strictly private to the owning user.
create policy "activities: owner only" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
