const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VANCOUVER_TIME_ZONE = "America/Vancouver";

export function isIsoCalendarDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearPart, monthPart, dayPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getRequiredDatePart(
  parts: Intl.DateTimeFormatPart[],
  type: "day" | "month" | "year"
): string {
  const value = parts.find((part) => part.type === type)?.value;

  if (!value) {
    throw new Error(`Unable to read Vancouver ${type}.`);
  }

  return value;
}

export function getTodayIsoDateInVancouver(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: VANCOUVER_TIME_ZONE,
    year: "numeric"
  }).formatToParts(now);

  const year = getRequiredDatePart(parts, "year");
  const month = getRequiredDatePart(parts, "month");
  const day = getRequiredDatePart(parts, "day");

  return `${year}-${month}-${day}`;
}

export function getCurrentMinutesInVancouver(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: VANCOUVER_TIME_ZONE
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!hour || !minute) {
    throw new Error("Unable to read current Vancouver time.");
  }

  return Number(hour) * 60 + Number(minute);
}

export function isBeforeTodayInVancouver(value: string): boolean {
  if (!isIsoCalendarDate(value)) {
    return false;
  }

  return value < getTodayIsoDateInVancouver();
}
