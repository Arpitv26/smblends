import { NextResponse } from "next/server";

import { getWeeklyAvailability } from "@/lib/slots/get-weekly-availability";
import { isIsoCalendarDate } from "@/lib/validators/date";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start")?.trim();

  if (!start || !isIsoCalendarDate(start)) {
    return NextResponse.json(
      { error: "Provide a week date in YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  try {
    const availability = await getWeeklyAvailability(start);

    return NextResponse.json(availability);
  } catch (error: unknown) {
    console.error("Failed to load weekly availability.", error);

    return NextResponse.json(
      { error: "Unable to load weekly availability right now." },
      { status: 500 }
    );
  }
}
