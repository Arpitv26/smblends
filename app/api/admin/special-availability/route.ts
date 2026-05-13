import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { createSpecialAvailability } from "@/lib/admin/create-special-availability";
import { isIsoCalendarDate } from "@/lib/validators/date";

const TIME_INPUT_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(:00)?$/;

const specialAvailabilitySchema = z.object({
  date: z
    .string()
    .trim()
    .refine(isIsoCalendarDate, "Choose a valid date."),
  endTime: z
    .string()
    .trim()
    .refine(isTimeInput, "Choose a valid end time."),
  label: z
    .string()
    .trim()
    .max(120, "Keep the label under 120 characters."),
  slotMinutes: z.number().int().positive().default(60),
  startTime: z
    .string()
    .trim()
    .refine(isTimeInput, "Choose a valid start time.")
});

function isTimeInput(value: string): boolean {
  return TIME_INPUT_PATTERN.test(value);
}

function normalizeTimeInput(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

function parseTimeToMinutes(value: string): number {
  const [hoursPart = "0", minutesPart = "0"] = value.split(":");

  return Number(hoursPart) * 60 + Number(minutesPart);
}

function hasValidTimeWindow(startTime: string, endTime: string): boolean {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  return endMinutes > startMinutes || (endTime === "00:00:00" && startMinutes > 0);
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeOptionalLabel(label: string): string | null {
  const trimmedLabel = label.trim();

  return trimmedLabel.length > 0 ? trimmedLabel : null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to add special availability." },
      { status: 401 }
    );
  }

  const payload = await readJson(request);
  const parsedPayload = specialAvailabilitySchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error:
          parsedPayload.error.issues[0]?.message ??
          "Invalid special availability."
      },
      { status: 400 }
    );
  }

  const startTime = normalizeTimeInput(parsedPayload.data.startTime);
  const endTime = normalizeTimeInput(parsedPayload.data.endTime);

  if (!hasValidTimeWindow(startTime, endTime)) {
    return NextResponse.json(
      { error: "End time must be after start time." },
      { status: 400 }
    );
  }

  const result = await createSpecialAvailability({
    date: parsedPayload.data.date,
    endTime,
    label: normalizeOptionalLabel(parsedPayload.data.label),
    slotMinutes: parsedPayload.data.slotMinutes,
    startTime
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
