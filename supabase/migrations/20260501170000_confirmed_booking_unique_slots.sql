drop index if exists public.bookings_booking_date_time_slot_key;

create unique index if not exists bookings_confirmed_booking_date_time_slot_key
  on public.bookings (booking_date, time_slot)
  where status = 'confirmed';
