import { NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/slots/get-available-slots";
import { isIsoCalendarDate } from "@/lib/validators/date";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim();

  if (!date || !isIsoCalendarDate(date)) {
    return NextResponse.json(
      { error: "Provide a date in YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);

    return NextResponse.json({ date, slots });
  } catch (error: unknown) {
    console.error("Failed to load availability.", error);

    return NextResponse.json(
      { error: "Unable to load available slots right now." },
      { status: 500 }
    );
  }
}
