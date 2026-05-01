import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type UpdateAvailabilityWindowResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function updateAvailabilityWindow(
  availabilityId: string,
  isActive: boolean
): Promise<UpdateAvailabilityWindowResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("availability")
    .update({ is_active: isActive })
    .eq("id", availabilityId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update availability window.", error);

    return {
      message: "Unable to update availability right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "That availability row was not found.",
      ok: false,
      reason: "not_found"
    };
  }

  return { ok: true };
}
