-- School-year weekly hours, effective Wednesday 2026-09-09 going forward.
-- Monday-Friday standard: 4:00 PM-9:00 PM (summer was 9:00 AM-9:00 PM).
-- Saturday standard: 9:00 AM-9:00 PM (unchanged).
-- Sunday standard: 3:00 PM-9:00 PM (unchanged).
-- After-hours rows (21:00-00:00) and the +$10 surcharge stay unchanged.
-- Existing bookings are not modified.
-- Weekdays before 2026-09-09 keep summer hours via special_availability so
-- already-booked morning slots this week and next Monday/Tuesday stay offered.

update public.availability
set
  start_time = time '16:00:00',
  end_time = time '21:00:00',
  slot_minutes = 60
where day_of_week between 1 and 5
  and start_time < time '21:00:00'
  and end_time = time '21:00:00';

delete from public.special_availability
where label in (
  'Summer hours before school year',
  'Summer after-hours before school year'
);

insert into public.special_availability
  (date, start_time, end_time, slot_minutes, label, is_active)
select
  dates.the_date,
  windows.start_time,
  windows.end_time,
  60,
  windows.label,
  true
from (
  values
    (date '2026-08-31'),
    (date '2026-09-01'),
    (date '2026-09-02'),
    (date '2026-09-03'),
    (date '2026-09-04'),
    (date '2026-09-07'),
    (date '2026-09-08')
) as dates(the_date)
cross join (
  values
    (
      time '09:00:00',
      time '21:00:00',
      'Summer hours before school year'
    ),
    (
      time '21:00:00',
      time '00:00:00',
      'Summer after-hours before school year'
    )
) as windows(start_time, end_time, label)
where not exists (
  select 1
  from public.special_availability existing
  where existing.date = dates.the_date
);
