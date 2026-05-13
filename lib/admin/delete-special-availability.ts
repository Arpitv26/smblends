import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type DeleteSpecialAvailabilityResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function deleteSpecialAvailability(
  specialAvailabilityId: string
): Promise<DeleteSpecialAvailabilityResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("special_availability")
    .delete()
    .eq("id", specialAvailabilityId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete special availability.", error);

    return {
      message: "Unable to remove special availability right now.",
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
