-- Expand regular booking hours while preserving each row's current active state.
-- After-hours rows (21:00-00:00) are intentionally unchanged.
update public.availability
set
  start_time = case
    when day_of_week = 0 then time '15:00:00'
    else time '09:00:00'
  end,
  end_time = time '21:00:00',
  slot_minutes = 60
where day_of_week between 0 and 6
  and start_time < time '21:00:00'
  and end_time = time '21:00:00';
