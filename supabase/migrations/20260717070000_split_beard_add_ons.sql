alter table public.bookings
  drop constraint if exists bookings_add_ons_check;

alter table public.bookings
  add constraint bookings_add_ons_check
  check (
    add_ons <@ array[
      'Beard Fade',
      'Beard Line-up',
      'Beard Fade / Line-up',
      'Design'
    ]::text[]
  );
