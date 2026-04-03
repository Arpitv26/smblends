create extension if not exists pgcrypto;

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes int not null default 30 check (slot_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  time_slot time not null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  service_type text not null default 'Haircut',
  is_after_hours boolean not null default false,
  price_charged int not null default 0 check (price_charged >= 0),
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled', 'no_show', 'completed')),
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists bookings_booking_date_time_slot_key
  on public.bookings (booking_date, time_slot);

alter table public.availability enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Public can read availability" on public.availability;
create policy "Public can read availability"
  on public.availability
  for select
  to anon
  using (true);

drop policy if exists "Admin can manage availability" on public.availability;
create policy "Admin can manage availability"
  on public.availability
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public can read blocked dates" on public.blocked_dates;
create policy "Public can read blocked dates"
  on public.blocked_dates
  for select
  to anon
  using (true);

drop policy if exists "Admin can manage blocked dates" on public.blocked_dates;
create policy "Admin can manage blocked dates"
  on public.blocked_dates
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
  on public.bookings
  for insert
  to anon
  with check (true);

drop policy if exists "Admin can manage bookings" on public.bookings;
create policy "Admin can manage bookings"
  on public.bookings
  for all
  to authenticated
  using (true)
  with check (true);
