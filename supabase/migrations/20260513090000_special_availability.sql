create table if not exists public.special_availability (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  slot_minutes int not null default 60 check (slot_minutes > 0),
  label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint special_availability_valid_time_window
    check (end_time > start_time or end_time = time '00:00:00')
);

create index if not exists special_availability_date_idx
  on public.special_availability (date);

alter table public.special_availability enable row level security;

drop policy if exists "Public can read special availability" on public.special_availability;
create policy "Public can read special availability"
  on public.special_availability
  for select
  to anon
  using (true);

drop policy if exists "Admin can manage special availability" on public.special_availability;
create policy "Admin can manage special availability"
  on public.special_availability
  for all
  to authenticated
  using (true)
  with check (true);
