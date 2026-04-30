alter table public.bookings
  alter column client_email drop not null;

alter table public.bookings
  add column if not exists add_ons text[] not null default '{}';

alter table public.availability
  drop constraint if exists availability_check;

alter table public.availability
  drop constraint if exists availability_end_time_check;

alter table public.availability
  drop constraint if exists availability_valid_time_window;

alter table public.availability
  add constraint availability_valid_time_window
  check (end_time > start_time or end_time = time '00:00:00');

alter table public.bookings
  drop constraint if exists bookings_service_type_check;

alter table public.bookings
  add constraint bookings_service_type_check
  check (service_type in ('Haircut', 'Haircut & Beard'));

alter table public.bookings
  drop constraint if exists bookings_add_ons_check;

alter table public.bookings
  add constraint bookings_add_ons_check
  check (add_ons <@ array['Beard Fade / Line-up', 'Design']::text[]);

delete from public.availability;

insert into public.availability
  (day_of_week, start_time, end_time, slot_minutes, is_active)
values
  (0, '15:00:00', '21:00:00', 60, true),
  (0, '21:00:00', '00:00:00', 60, true),
  (1, '16:00:00', '21:00:00', 60, true),
  (1, '21:00:00', '00:00:00', 60, true),
  (2, '16:00:00', '21:00:00', 60, true),
  (2, '21:00:00', '00:00:00', 60, true),
  (3, '16:00:00', '21:00:00', 60, true),
  (3, '21:00:00', '00:00:00', 60, true),
  (4, '16:00:00', '21:00:00', 60, true),
  (4, '21:00:00', '00:00:00', 60, true),
  (5, '16:00:00', '21:00:00', 60, true),
  (5, '21:00:00', '00:00:00', 60, true),
  (6, '09:00:00', '21:00:00', 60, true),
  (6, '21:00:00', '00:00:00', 60, true);
