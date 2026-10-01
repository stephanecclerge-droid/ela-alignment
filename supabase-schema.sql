-- Run this once in the Supabase SQL Editor (left sidebar) for the
-- ela-alignment project. Creates the table that stores each lesson
-- alignment check, tied to the teacher who ran it.

create table analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  standard_code text not null,
  lesson_text text not null,
  alignment_level text not null,
  summary text not null,
  gaps jsonb not null,
  recommendations jsonb not null,
  student_plain_language_note text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: locked down by default until the policies below
-- explicitly allow access.
alter table analyses enable row level security;

-- A teacher can see only their own saved analyses.
create policy "Users can view their own analyses"
  on analyses for select
  using (auth.uid() = user_id);

-- A teacher can only ever save a new analysis under their own account,
-- never on someone else's behalf.
create policy "Users can insert their own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);

-- Required because this project has "Automatically expose new tables"
-- turned off (a deliberate security choice made at project creation) —
-- without this, logged-in users get "permission denied" even though the
-- RLS policies above are correct, because access is blocked one level
-- earlier, before RLS is ever checked.
grant select, insert on analyses to authenticated;

-- Added for the Phase 7 pilot: a few quick answers captured alongside each
-- check, so real usage patterns can be seen across pilot teachers later.
alter table analyses
  add column goal text,
  add column lesson_source text,
  add column confidence_before text;
