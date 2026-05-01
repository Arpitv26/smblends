import type { AddOnType, ServiceType } from "@/lib/bookings/config";

export const BOOKING_CONFIRMATION_STORAGE_KEY =
  "smblends:last-booking-confirmation";

export type BookingConfirmationSummary = {
  addOns: AddOnType[];
  bookingDate: string;
  clientName: string;
  isAfterHours: boolean;
  priceCharged: number;
  serviceType: ServiceType;
  timeSlot: string;
};
