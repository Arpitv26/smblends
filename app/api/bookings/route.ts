import { NextResponse } from "next/server";

import { createBooking } from "@/lib/bookings/create-booking";
import { sendBookingNotifications } from "@/lib/notifications/send-booking-notifications";
import { bookingDraftSchema } from "@/lib/validators/booking";

const GENERIC_INVALID_BOOKING_MESSAGE =
  "Please fill in your name, phone number, date, time, and service.";

function getInvalidBookingMessage(
  issues: Array<{ message: string }>
): string {
  const firstMessage = issues[0]?.message;

  if (!firstMessage || firstMessage.startsWith("Invalid input:")) {
    return GENERIC_INVALID_BOOKING_MESSAGE;
  }

  return firstMessage;
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await readJson(request);
  const parsedBooking = bookingDraftSchema.safeParse(payload);
  const siteOrigin = new URL(request.url).origin;

  if (!parsedBooking.success) {
    return NextResponse.json(
      { error: getInvalidBookingMessage(parsedBooking.error.issues) },
      { status: 400 }
    );
  }

  try {
    const result = await createBooking(parsedBooking.data);

    if (!result.ok) {
      const status = result.reason === "database_error" ? 500 : 409;

      return NextResponse.json({ error: result.message }, { status });
    }

    try {
      await sendBookingNotifications(result.notification, siteOrigin);
    } catch (notificationError: unknown) {
      console.error(
        "Booking saved, but notification delivery failed.",
        notificationError
      );
    }

    return NextResponse.json({ booking: result.booking }, { status: 201 });
  } catch (error: unknown) {
    console.error("Unexpected booking submission failure.", error);

    return NextResponse.json(
      { error: "Unable to save the booking right now. Please try again." },
      { status: 500 }
    );
  }
}
