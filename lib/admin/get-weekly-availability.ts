import "server-only";

import { AFTER_HOURS_START_MINUTES } from "@/lib/bookings/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type WeeklyAvailabilityWindow = {
  dayOfWeek: number;
  endTime: string;
  id: string;
  isActive: boolean;
  isAfterHours: boolean;
  slotMinutes: number;
  startTime: string;
};

type AvailabilityRow = {
  day_of_week: number;
  end_time: string;
  id: string;
  is_active: boolean;
  slot_minutes: number;
  start_time: string;
};

function parseTimeToMinutes(value: string): number {
  const [hoursPart = "0", minutesPart = "0"] = value.split(":");

  return Number(hoursPart) * 60 + Number(minutesPart);
}

function toWeeklyAvailabilityWindow(
  row: AvailabilityRow
): WeeklyAvailabilityWindow {
  const startMinutes = parseTimeToMinutes(row.start_time);

  return {
    dayOfWeek: row.day_of_week,
    endTime: row.end_time,
    id: row.id,
    isActive: row.is_active,
    isAfterHours: startMinutes >= AFTER_HOURS_START_MINUTES,
    slotMinutes: row.slot_minutes,
    startTime: row.start_time
  };
}

export async function getWeeklyAvailability(): Promise<
  WeeklyAvailabilityWindow[]
> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("availability")
    .select("id, day_of_week, start_time, end_time, slot_minutes, is_active")
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true })
    .returns<AvailabilityRow[]>();

  if (error) {
    console.error("Failed to load weekly availability.", error);
    throw new Error("Unable to load weekly availability right now.");
  }

  return (data ?? []).map(toWeeklyAvailabilityWindow);
}
