import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { cancelBooking } from "@/lib/admin/cancel-booking";
import { sendClientCancellationNotification } from "@/lib/notifications/send-booking-notifications";

const routeParamsSchema = z.object({
  bookingId: z.string().uuid()
});

type RouteContext = {
  params: {
    bookingId: string;
  };
};

export async function POST(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to cancel bookings." },
      { status: 401 }
    );
  }

  const parsedParams = routeParamsSchema.safeParse(context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid booking selected." },
      { status: 400 }
    );
  }

  const result = await cancelBooking(parsedParams.data.bookingId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "not_found" ? 404 : 500 }
    );
  }

  try {
    await sendClientCancellationNotification(result.booking);
  } catch (emailError: unknown) {
    console.error(
      "Booking cancelled by admin, but client cancellation email failed.",
      emailError
    );
  }

  return NextResponse.json({ ok: true });
}
