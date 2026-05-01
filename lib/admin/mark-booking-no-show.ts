import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type MarkBookingNoShowResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function markBookingNoShow(
  bookingId: string
): Promise<MarkBookingNoShowResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "no_show" })
    .eq("id", bookingId)
    .eq("status", "confirmed")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to mark booking as no-show.", error);

    return {
      message: "Unable to mark this booking as no-show right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "This booking was not found or is no longer confirmed.",
      ok: false,
      reason: "not_found"
    };
  }

  return { ok: true };
}
