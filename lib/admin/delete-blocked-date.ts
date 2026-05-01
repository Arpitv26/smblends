import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type DeleteBlockedDateResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function deleteBlockedDate(
  blockedDateId: string
): Promise<DeleteBlockedDateResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", blockedDateId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete blocked date.", error);

    return {
      message: "Unable to remove this blocked date right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "That blocked date was not found.",
      ok: false,
      reason: "not_found"
    };
  }

  return { ok: true };
}
