import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type SpecialAvailabilityWindow = {
  createdAt: string;
  date: string;
  endTime: string;
  id: string;
  isActive: boolean;
  label: string | null;
  slotMinutes: number;
  startTime: string;
};

type SpecialAvailabilityRow = {
  created_at: string;
  date: string;
  end_time: string;
  id: string;
  is_active: boolean;
  label: string | null;
  slot_minutes: number;
  start_time: string;
};

function toSpecialAvailabilityWindow(
  row: SpecialAvailabilityRow
): SpecialAvailabilityWindow {
  return {
    createdAt: row.created_at,
    date: row.date,
    endTime: row.end_time,
    id: row.id,
    isActive: row.is_active,
    label: row.label,
    slotMinutes: row.slot_minutes,
    startTime: row.start_time
  };
}

export async function getSpecialAvailability(): Promise<
  SpecialAvailabilityWindow[]
> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("special_availability")
    .select("id, date, start_time, end_time, slot_minutes, label, is_active, created_at")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(100)
    .returns<SpecialAvailabilityRow[]>();

  if (error) {
    console.error("Failed to load special availability.", error);
    throw new Error("Unable to load special availability right now.");
  }

  return (data ?? []).map(toSpecialAvailabilityWindow);
}
