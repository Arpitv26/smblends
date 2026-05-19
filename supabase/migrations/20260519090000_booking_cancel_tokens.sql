alter table public.bookings
  add column if not exists cancel_token text;

update public.bookings
set cancel_token = encode(gen_random_bytes(32), 'hex')
where cancel_token is null;

alter table public.bookings
  alter column cancel_token set not null;

create unique index if not exists bookings_cancel_token_key
  on public.bookings (cancel_token);
