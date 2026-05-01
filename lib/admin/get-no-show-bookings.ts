import "server-only";

import {
  BOOKING_SELECT_COLUMNS,
  toNoShowBooking,
  type NoShowBooking
} from "@/lib/admin/get-upcoming-bookings";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export async function getNoShowBookings(): Promise<NoShowBooking[]> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT_COLUMNS)
    .eq("status", "no_show")
    .order("booking_date", { ascending: false })
    .order("time_slot", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to load no-show bookings.", error);
    throw new Error("Unable to load no-show bookings right now.");
  }

  return ((data ?? []) as Parameters<typeof toNoShowBooking>[0][]).map(
    toNoShowBooking
  );
}
