export type AvailableSlot = {
  isAfterHours: boolean;
  label: string;
  value: string;
};

export type WeeklySlotStatus = "available" | "booked" | "unavailable";

export type WeeklySlot = AvailableSlot & {
  status: WeeklySlotStatus;
};

export type WeeklyAvailabilityDay = {
  date: string;
  dateLabel: string;
  dayLabel: string;
  isBlocked: boolean;
  slots: WeeklySlot[];
};

export type WeeklyAvailability = {
  days: WeeklyAvailabilityDay[];
  timeSlots: AvailableSlot[];
  weekEnd: string;
  weekStart: string;
};
