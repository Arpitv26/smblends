import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type CancelBookingResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "not_found";
    };

export async function cancelBooking(
  bookingId: string
): Promise<CancelBookingResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("status", "confirmed")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to cancel booking.", error);

    return {
      message: "Unable to cancel this booking right now.",
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
