import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { markBookingNoShow } from "@/lib/admin/mark-booking-no-show";

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
      { error: "You must be signed in to update bookings." },
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

  const result = await markBookingNoShow(parsedParams.data.bookingId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "not_found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
