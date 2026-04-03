import { NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/slots/get-available-slots";

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !isIsoDate(date)) {
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
