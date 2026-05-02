import "server-only";

import { AFTER_HOURS_START_MINUTES } from "@/lib/bookings/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import type { AvailableSlot } from "@/lib/slots/types";
import { isIsoCalendarDate } from "@/lib/validators/date";

type BlockedDateRow = {
  date: string;
};

type BookingRow = {
  time_slot: string;
};

type AvailabilityRow = {
  day_of_week: number;
  end_time: string;
  is_active: boolean;
  slot_minutes: number;
  start_time: string;
};

function assertIsoDate(date: string): void {
  if (!isIsoCalendarDate(date)) {
    throw new Error("Expected date in YYYY-MM-DD format.");
  }
}

function getDayOfWeekInVancouver(date: string): number {
  const baseDate = new Date(`${date}T12:00:00.000Z`);
  const weekday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "short"
  }).format(baseDate);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  const dayOfWeek = weekdayMap[weekday];

  if (dayOfWeek === undefined) {
    throw new Error(`Unsupported weekday value: ${weekday}`);
  }

  return dayOfWeek;
}

function parseTimeToMinutes(value: string): number {
  const [hoursPart, minutesPart] = value.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid time value: ${value}`);
  }

  return hours * 60 + minutes;
}

function formatMinutesAsTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const minuteValue = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")}:00`;
}

function formatSlotLabel(minutes: number): string {
  const meridiem = minutes >= 12 * 60 ? "PM" : "AM";
  const hours24 = Math.floor(minutes / 60) % 24;
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minuteValue = minutes % 60;

  return `${hours12}:${String(minuteValue).padStart(2, "0")} ${meridiem}`;
}

function buildSlotsForWindow(
  startTime: string,
  endTime: string,
  slotMinutes: number,
  bookedTimes: Set<string>
): AvailableSlot[] {
  const startMinutes = parseTimeToMinutes(startTime);
  const rawEndMinutes = parseTimeToMinutes(endTime);
  const endMinutes =
    rawEndMinutes <= startMinutes ? rawEndMinutes + 24 * 60 : rawEndMinutes;
  const slots: AvailableSlot[] = [];

  for (
    let currentMinutes = startMinutes;
    currentMinutes + slotMinutes <= endMinutes;
    currentMinutes += slotMinutes
  ) {
    const value = formatMinutesAsTime(currentMinutes);

    if (bookedTimes.has(value)) {
      continue;
    }

    slots.push({
      isAfterHours: currentMinutes >= AFTER_HOURS_START_MINUTES,
      label: formatSlotLabel(currentMinutes),
      value
    });
  }

  return slots;
}

export async function getAvailableSlots(date: string): Promise<AvailableSlot[]> {
  assertIsoDate(date);

  const supabase = createServiceRoleSupabaseClient();
  const dayOfWeek = getDayOfWeekInVancouver(date);

  const [{ data: blockedDates, error: blockedDatesError }, { data: availability, error: availabilityError }, { data: bookings, error: bookingsError }] =
    await Promise.all([
      supabase
        .from("blocked_dates")
        .select("date")
        .eq("date", date)
        .returns<BlockedDateRow[]>(),
      supabase
        .from("availability")
        .select("day_of_week, start_time, end_time, slot_minutes, is_active")
        .eq("day_of_week", dayOfWeek)
        .eq("is_active", true)
        .order("start_time", { ascending: true })
        .returns<AvailabilityRow[]>(),
      supabase
        .from("bookings")
        .select("time_slot")
        .eq("booking_date", date)
        .eq("status", "confirmed")
        .returns<BookingRow[]>()
    ]);

  if (blockedDatesError) {
    throw new Error(`Failed to read blocked dates: ${blockedDatesError.message}`);
  }

  if (availabilityError) {
    throw new Error(`Failed to read availability: ${availabilityError.message}`);
  }

  if (bookingsError) {
    throw new Error(`Failed to read bookings: ${bookingsError.message}`);
  }

  if ((blockedDates ?? []).length > 0) {
    return [];
  }

  const bookedTimes = new Set((bookings ?? []).map((booking) => booking.time_slot));

  return (availability ?? []).flatMap((window) =>
    buildSlotsForWindow(
      window.start_time,
      window.end_time,
      window.slot_minutes,
      bookedTimes
    )
  );
}
