import "server-only";

import {
  calculateBookingPrice,
  type AddOnType,
  type ServiceType
} from "@/lib/bookings/config";
import type { BookingConfirmationSummary } from "@/lib/bookings/types";
import type { BookingNotificationDetails } from "@/lib/notifications/send-booking-notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { getAvailableSlots } from "@/lib/slots/get-available-slots";
import type { AvailableSlot } from "@/lib/slots/types";
import type { BookingDraft } from "@/lib/validators/booking";

type BookingInsertPayload = {
  add_ons: AddOnType[];
  booking_date: string;
  client_email: string | null;
  client_name: string;
  client_phone: string;
  is_after_hours: boolean;
  notes: string | null;
  price_charged: number;
  service_type: ServiceType;
  status: "confirmed";
  time_slot: string;
};

type CreateBookingSuccess = {
  booking: BookingConfirmationSummary;
  notification: BookingNotificationDetails;
  ok: true;
};

type CreateBookingFailure = {
  message: string;
  ok: false;
  reason: "database_error" | "duplicate_slot" | "slot_unavailable";
};

export type CreateBookingResult = CreateBookingFailure | CreateBookingSuccess;

function normalizeOptionalText(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function findRequestedSlot(
  slots: AvailableSlot[],
  timeSlot: string
): AvailableSlot | null {
  return slots.find((slot) => slot.value === timeSlot) ?? null;
}

function isDuplicateSlotError(errorCode: string | undefined): boolean {
  return errorCode === "23505";
}

export async function createBooking(
  bookingDraft: BookingDraft
): Promise<CreateBookingResult> {
  const availableSlots = await getAvailableSlots(bookingDraft.bookingDate);
  const requestedSlot = findRequestedSlot(availableSlots, bookingDraft.timeSlot);

  if (!requestedSlot) {
    return {
      message: "That time slot is no longer available. Please choose another time.",
      ok: false,
      reason: "slot_unavailable"
    };
  }

  const priceCharged = calculateBookingPrice({
    addOns: bookingDraft.addOns,
    isAfterHours: requestedSlot.isAfterHours,
    serviceType: bookingDraft.serviceType
  });

  const insertPayload: BookingInsertPayload = {
    add_ons: bookingDraft.addOns,
    booking_date: bookingDraft.bookingDate,
    client_email: normalizeOptionalText(bookingDraft.clientEmail),
    client_name: bookingDraft.clientName.trim(),
    client_phone: bookingDraft.clientPhone.trim(),
    is_after_hours: requestedSlot.isAfterHours,
    notes: normalizeOptionalText(bookingDraft.notes),
    price_charged: priceCharged,
    service_type: bookingDraft.serviceType,
    status: "confirmed",
    time_slot: bookingDraft.timeSlot
  };

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase.from("bookings").insert(insertPayload);

  if (error) {
    if (isDuplicateSlotError(error.code)) {
      return {
        message: "That time slot was just booked. Please choose another time.",
        ok: false,
        reason: "duplicate_slot"
      };
    }

    console.error("Failed to create booking.", error);

    return {
      message: "Unable to save the booking right now. Please try again.",
      ok: false,
      reason: "database_error"
    };
  }

  return {
    booking: {
      addOns: bookingDraft.addOns,
      bookingDate: bookingDraft.bookingDate,
      clientEmail: insertPayload.client_email ?? bookingDraft.clientEmail,
      clientName: insertPayload.client_name,
      isAfterHours: requestedSlot.isAfterHours,
      priceCharged,
      serviceType: bookingDraft.serviceType,
      timeSlot: bookingDraft.timeSlot
    },
    notification: {
      addOns: bookingDraft.addOns,
      bookingDate: bookingDraft.bookingDate,
      clientEmail: insertPayload.client_email,
      clientName: insertPayload.client_name,
      clientPhone: insertPayload.client_phone,
      isAfterHours: requestedSlot.isAfterHours,
      notes: insertPayload.notes,
      priceCharged,
      serviceType: bookingDraft.serviceType,
      timeSlot: bookingDraft.timeSlot
    },
    ok: true
  };
}
