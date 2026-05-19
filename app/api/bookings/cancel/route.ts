import { NextResponse } from "next/server";
import { z } from "zod";

import { CANCEL_TOKEN_PATTERN } from "@/lib/bookings/cancel-token";
import { cancelBookingByToken } from "@/lib/bookings/cancel-booking";
import { sendCancellationNotifications } from "@/lib/notifications/send-booking-notifications";

const cancelBookingSchema = z.object({
  cancelToken: z.string().regex(CANCEL_TOKEN_PATTERN, "Invalid cancellation link.")
});

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function getStatusCode(reason: string): number {
  if (reason === "invalid_token") {
    return 400;
  }

  if (reason === "not_found") {
    return 404;
  }

  if (reason === "database_error") {
    return 500;
  }

  return 409;
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await readJson(request);
  const parsedPayload = cancelBookingSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Invalid cancellation link." },
      { status: 400 }
    );
  }

  const result = await cancelBookingByToken(parsedPayload.data.cancelToken);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: getStatusCode(result.reason) }
    );
  }

  try {
    await sendCancellationNotifications(result.booking);
  } catch (emailError: unknown) {
    console.error("Booking cancelled, but cancellation email failed.", emailError);
  }

  return NextResponse.json({ booking: result.booking, ok: true });
}
