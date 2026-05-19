import "server-only";

import {
  cancelBookingById,
  type CancelBookingResult
} from "@/lib/bookings/cancel-booking";

export async function cancelBooking(
  bookingId: string
): Promise<CancelBookingResult> {
  return cancelBookingById(bookingId);
}
