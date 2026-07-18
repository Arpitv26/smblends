import "server-only";

import { AFTER_HOURS_START_MINUTES } from "@/lib/bookings/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import type {
  AvailableSlot,
  WeeklyAvailability,
  WeeklyAvailabilityDay,
  WeeklySlot
} from "@/lib/slots/types";
import {
  getCurrentMinutesInVancouver,
  getTodayIsoDateInVancouver,
  isIsoCalendarDate
} from "@/lib/validators/date";
import { parseIsoTimeSlotToMinutes } from "@/lib/validators/time";

type BlockedDateRow = {
  date: string;
};

type BookingRow = {
  booking_date: string;
  time_slot: string;
};

type AvailabilityRow = {
  day_of_week: number;
  end_time: string;
  slot_minutes: number;
  start_time: string;
};

type SpecialAvailabilityRow = {
  date: string;
  end_time: string;
  is_active: boolean;
  slot_minutes: number;
  start_time: string;
};

type ScheduleWindow = {
  end_time: string;
  slot_minutes: number;
  start_time: string;
};

const WEEK_LENGTH = 7;

function parseIsoDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const nextDate = parseIsoDate(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return formatIsoDate(nextDate);
}

export function getMondayForIsoDate(date: string): string {
  if (!isIsoCalendarDate(date)) {
    throw new Error("Expected date in YYYY-MM-DD format.");
  }

  const parsedDate = parseIsoDate(date);
  const daysSinceMonday = (parsedDate.getUTCDay() + 6) % WEEK_LENGTH;
  parsedDate.setUTCDate(parsedDate.getUTCDate() - daysSinceMonday);
  return formatIsoDate(parsedDate);
}

function parseTimeToMinutes(value: string): number {
  return parseIsoTimeSlotToMinutes(value);
}

function formatMinutesAsTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const minuteValue = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")}:00`;
}

function formatSlotLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60) % 24;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minuteValue = minutes % 60;

  return `${hours12}:${String(minuteValue).padStart(2, "0")} ${meridiem}`;
}

function toAvailableSlot(value: string): AvailableSlot {
  const minutes = parseTimeToMinutes(value);

  return {
    isAfterHours: minutes >= AFTER_HOURS_START_MINUTES,
    label: formatSlotLabel(minutes),
    value
  };
}

function buildSlotsForWindow(window: ScheduleWindow): AvailableSlot[] {
  const startMinutes = parseTimeToMinutes(window.start_time);
  const rawEndMinutes = parseTimeToMinutes(window.end_time);
  const endMinutes =
    rawEndMinutes <= startMinutes ? rawEndMinutes + 24 * 60 : rawEndMinutes;
  const slots: AvailableSlot[] = [];

  for (
    let currentMinutes = startMinutes;
    currentMinutes + window.slot_minutes <= endMinutes;
    currentMinutes += window.slot_minutes
  ) {
    slots.push({
      isAfterHours: currentMinutes >= AFTER_HOURS_START_MINUTES,
      label: formatSlotLabel(currentMinutes),
      value: formatMinutesAsTime(currentMinutes)
    });
  }

  return slots;
}

function groupRows<T>(
  rows: T[],
  getKey: (row: T) => string
): Map<string, T[]> {
  const groupedRows = new Map<string, T[]>();

  for (const row of rows) {
    const key = getKey(row);
    groupedRows.set(key, [...(groupedRows.get(key) ?? []), row]);
  }

  return groupedRows;
}

function getDateLabels(date: string): {
  dateLabel: string;
  dayLabel: string;
} {
  const parsedDate = parseIsoDate(date);

  return {
    dateLabel: new Intl.DateTimeFormat("en-CA", {
      day: "numeric",
      month: "short",
      timeZone: "UTC"
    }).format(parsedDate),
    dayLabel: new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      weekday: "short"
    }).format(parsedDate)
  };
}

function getDayOfWeek(date: string): number {
  return parseIsoDate(date).getUTCDay();
}

function getSlotStatus(params: {
  bookedTimes: Set<string>;
  date: string;
  isBlocked: boolean;
  offeredTimes: Set<string>;
  timeSlot: string;
  today: string;
  currentMinutes: number;
}): WeeklySlot["status"] {
  if (params.bookedTimes.has(params.timeSlot)) {
    return "booked";
  }

  if (
    params.isBlocked ||
    params.date < params.today ||
    !params.offeredTimes.has(params.timeSlot)
  ) {
    return "unavailable";
  }

  if (
    params.date === params.today &&
    parseTimeToMinutes(params.timeSlot) <= params.currentMinutes
  ) {
    return "unavailable";
  }

  return "available";
}

export async function getWeeklyAvailability(
  requestedDate: string
): Promise<WeeklyAvailability> {
  const weekStart = getMondayForIsoDate(requestedDate);
  const weekEnd = addDays(weekStart, WEEK_LENGTH - 1);
  const dates = Array.from({ length: WEEK_LENGTH }, (_, index) =>
    addDays(weekStart, index)
  );
  const supabase = createServiceRoleSupabaseClient();

  const [
    { data: blockedDates, error: blockedDatesError },
    { data: specialAvailability, error: specialAvailabilityError },
    { data: availability, error: availabilityError },
    { data: bookings, error: bookingsError }
  ] = await Promise.all([
    supabase
      .from("blocked_dates")
      .select("date")
      .gte("date", weekStart)
      .lte("date", weekEnd)
      .returns<BlockedDateRow[]>(),
    supabase
      .from("special_availability")
      .select("date, start_time, end_time, slot_minutes, is_active")
      .gte("date", weekStart)
      .lte("date", weekEnd)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })
      .returns<SpecialAvailabilityRow[]>(),
    supabase
      .from("availability")
      .select("day_of_week, start_time, end_time, slot_minutes")
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true })
      .returns<AvailabilityRow[]>(),
    supabase
      .from("bookings")
      .select("booking_date, time_slot")
      .gte("booking_date", weekStart)
      .lte("booking_date", weekEnd)
      .eq("status", "confirmed")
      .returns<BookingRow[]>()
  ]);

  if (blockedDatesError) {
    throw new Error(`Failed to read blocked dates: ${blockedDatesError.message}`);
  }

  if (specialAvailabilityError) {
    throw new Error(
      `Failed to read special availability: ${specialAvailabilityError.message}`
    );
  }

  if (availabilityError) {
    throw new Error(`Failed to read availability: ${availabilityError.message}`);
  }

  if (bookingsError) {
    throw new Error(`Failed to read bookings: ${bookingsError.message}`);
  }

  const blockedDateSet = new Set((blockedDates ?? []).map((row) => row.date));
  const specialByDate = groupRows(
    specialAvailability ?? [],
    (row) => row.date
  );
  const availabilityByDay = groupRows(
    availability ?? [],
    (row) => String(row.day_of_week)
  );
  const bookingsByDate = groupRows(bookings ?? [], (row) => row.booking_date);
  const offeredSlotsByDate = new Map<string, Map<string, AvailableSlot>>();
  const globalTimeSlots = new Map<string, AvailableSlot>();

  for (const date of dates) {
    const specialRows = specialByDate.get(date);
    const scheduleWindows: ScheduleWindow[] = specialRows
      ? specialRows.filter((window) => window.is_active)
      : (availabilityByDay.get(String(getDayOfWeek(date))) ?? []);
    const offeredSlots = new Map<string, AvailableSlot>();

    for (const window of scheduleWindows) {
      for (const slot of buildSlotsForWindow(window)) {
        offeredSlots.set(slot.value, slot);
        globalTimeSlots.set(slot.value, slot);
      }
    }

    for (const booking of bookingsByDate.get(date) ?? []) {
      globalTimeSlots.set(
        booking.time_slot,
        toAvailableSlot(booking.time_slot)
      );
    }

    offeredSlotsByDate.set(date, offeredSlots);
  }

  const timeSlots = [...globalTimeSlots.values()].sort(
    (firstSlot, secondSlot) =>
      parseTimeToMinutes(firstSlot.value) -
      parseTimeToMinutes(secondSlot.value)
  );
  const today = getTodayIsoDateInVancouver();
  const currentMinutes = getCurrentMinutesInVancouver();
  const days: WeeklyAvailabilityDay[] = dates.map((date) => {
    const offeredTimes = new Set(offeredSlotsByDate.get(date)?.keys() ?? []);
    const bookedTimes = new Set(
      (bookingsByDate.get(date) ?? []).map((booking) => booking.time_slot)
    );
    const isBlocked = blockedDateSet.has(date);
    const labels = getDateLabels(date);
    const slots: WeeklySlot[] = timeSlots.map((slot) => ({
      ...slot,
      status: getSlotStatus({
        bookedTimes,
        currentMinutes,
        date,
        isBlocked,
        offeredTimes,
        timeSlot: slot.value,
        today
      })
    }));

    return {
      date,
      dateLabel: labels.dateLabel,
      dayLabel: labels.dayLabel,
      isBlocked,
      slots
    };
  });

  return {
    days,
    timeSlots,
    weekEnd,
    weekStart
  };
}
