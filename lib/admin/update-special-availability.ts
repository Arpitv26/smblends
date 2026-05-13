import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type UpdateSpecialAvailabilityResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function updateSpecialAvailability(
  specialAvailabilityId: string,
  isActive: boolean
): Promise<UpdateSpecialAvailabilityResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("special_availability")
    .update({ is_active: isActive })
    .eq("id", specialAvailabilityId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update special availability.", error);

    return {
      message: "Unable to update special availability right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "That special availability row was not found.",
      ok: false,
      reason: "not_found"
    };
  }

  return { ok: true };
}
