const ISO_TIME_SLOT_PATTERN = /^([01]\d|2[0-3]):([0-5]\d):00$/;

export function isIsoTimeSlot(value: string): boolean {
  return ISO_TIME_SLOT_PATTERN.test(value);
}

export function parseIsoTimeSlotToMinutes(value: string): number {
  if (!isIsoTimeSlot(value)) {
    throw new Error("Expected time slot in HH:MM:SS format.");
  }

  const [hoursPart, minutesPart] = value.split(":");

  return Number(hoursPart) * 60 + Number(minutesPart);
}
