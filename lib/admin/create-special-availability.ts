import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type CreateSpecialAvailabilityInput = {
  date: string;
  endTime: string;
  label: string | null;
  slotMinutes: number;
  startTime: string;
};

export type CreateSpecialAvailabilityResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error";
    };

export async function createSpecialAvailability({
  date,
  endTime,
  label,
  slotMinutes,
  startTime
}: CreateSpecialAvailabilityInput): Promise<CreateSpecialAvailabilityResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase.from("special_availability").insert({
    date,
    end_time: endTime,
    label,
    slot_minutes: slotMinutes,
    start_time: startTime
  });

  if (error) {
    console.error("Failed to create special availability.", error);

    return {
      message: "Unable to add special availability right now.",
      ok: false,
      reason: "database_error"
    };
  }

  return { ok: true };
}
