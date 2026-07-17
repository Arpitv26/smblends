import "server-only";

import {
  SERVICE_TYPES,
  STORED_ADD_ON_TYPES,
  type AddOnType,
  type ServiceType
} from "@/lib/bookings/config";
import { isCancelToken } from "@/lib/bookings/cancel-token";
import type { BookingCancellationDetails } from "@/lib/bookings/types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import {
  getCurrentMinutesInVancouver,
  getTodayIsoDateInVancouver
} from "@/lib/validators/date";
import { parseIsoTimeSlotToMinutes } from "@/lib/validators/time";

type BookingStatus = "cancelled" | "completed" | "confirmed" | "no_show";

type BookingCancellationRow = {
  add_ons: string[];
  booking_date: string;
  client_email: string | null;
  client_name: string;
  client_phone: string;
  is_after_hours: boolean;
  price_charged: number;
  service_type: string;
  status: BookingStatus;
  time_slot: string;
};

export type BookingCancellationPreviewResult =
  | {
      booking: BookingCancellationDetails;
      canCancel: boolean;
      message: string | null;
      ok: true;
      status: BookingStatus;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "invalid_token" | "not_found";
    };

export type CancelBookingResult =
  | {
      booking: BookingCancellationDetails;
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason:
        | "already_cancelled"
        | "database_error"
        | "invalid_token"
        | "not_confirmed"
        | "not_found"
        | "past_appointment";
    };

function toAddOns(value: string[]): AddOnType[] {
  return value.filter((addOn): addOn is AddOnType =>
    STORED_ADD_ON_TYPES.includes(addOn as AddOnType)
  );
}

function toServiceType(value: string): ServiceType {
  return SERVICE_TYPES.includes(value as ServiceType)
    ? (value as ServiceType)
    : "Haircut";
}

function toCancellationDetails(
  row: BookingCancellationRow
): BookingCancellationDetails {
  return {
    addOns: toAddOns(row.add_ons),
    bookingDate: row.booking_date,
    clientEmail: row.client_email,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    isAfterHours: row.is_after_hours,
    priceCharged: row.price_charged,
    serviceType: toServiceType(row.service_type),
    timeSlot: row.time_slot
  };
}

function hasAppointmentStarted(booking: BookingCancellationDetails): boolean {
  const today = getTodayIsoDateInVancouver();

  if (booking.bookingDate < today) {
    return true;
  }

  if (booking.bookingDate > today) {
    return false;
  }

  return parseIsoTimeSlotToMinutes(booking.timeSlot) <= getCurrentMinutesInVancouver();
}

function getUnavailableMessage(
  status: BookingStatus,
  booking: BookingCancellationDetails
): string | null {
  if (status === "cancelled") {
    return "This appointment has already been cancelled.";
  }

  if (status !== "confirmed") {
    return "This appointment can no longer be cancelled online.";
  }

  if (hasAppointmentStarted(booking)) {
    return "This appointment has already started or passed, so it can no longer be cancelled online.";
  }

  return null;
}

async function findBookingByCancelToken(
  cancelToken: string
): Promise<
  | { ok: true; row: BookingCancellationRow }
  | { message: string; ok: false; reason: "database_error" | "invalid_token" | "not_found" }
> {
  if (!isCancelToken(cancelToken)) {
    return {
      message: "This cancellation link is invalid.",
      ok: false,
      reason: "invalid_token"
    };
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "add_ons, booking_date, client_email, client_name, client_phone, is_after_hours, price_charged, service_type, status, time_slot"
    )
    .eq("cancel_token", cancelToken)
    .maybeSingle<BookingCancellationRow>();

  if (error) {
    console.error("Failed to read booking cancellation link.", error);

    return {
      message: "Unable to read this appointment right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "This cancellation link was not found.",
      ok: false,
      reason: "not_found"
    };
  }

  return { ok: true, row: data };
}

export async function getBookingCancellationPreview(
  cancelToken: string
): Promise<BookingCancellationPreviewResult> {
  const lookup = await findBookingByCancelToken(cancelToken);

  if (!lookup.ok) {
    return lookup;
  }

  const booking = toCancellationDetails(lookup.row);
  const message = getUnavailableMessage(lookup.row.status, booking);

  return {
    booking,
    canCancel: message === null,
    message,
    ok: true,
    status: lookup.row.status
  };
}

export async function cancelBookingById(
  bookingId: string
): Promise<CancelBookingResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("status", "confirmed")
    .select(
      "add_ons, booking_date, client_email, client_name, client_phone, is_after_hours, price_charged, service_type, status, time_slot"
    )
    .maybeSingle<BookingCancellationRow>();

  if (error) {
    console.error("Failed to cancel booking.", error);

    return {
      message: "Unable to cancel this booking right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "This booking was not found or is no longer confirmed.",
      ok: false,
      reason: "not_found"
    };
  }

  return {
    booking: toCancellationDetails(data),
    ok: true
  };
}

export async function cancelBookingByToken(
  cancelToken: string
): Promise<CancelBookingResult> {
  const lookup = await findBookingByCancelToken(cancelToken);

  if (!lookup.ok) {
    return lookup;
  }

  const booking = toCancellationDetails(lookup.row);

  if (lookup.row.status === "cancelled") {
    return {
      message: "This appointment has already been cancelled.",
      ok: false,
      reason: "already_cancelled"
    };
  }

  if (lookup.row.status !== "confirmed") {
    return {
      message: "This appointment can no longer be cancelled online.",
      ok: false,
      reason: "not_confirmed"
    };
  }

  if (hasAppointmentStarted(booking)) {
    return {
      message: "This appointment has already started or passed, so it can no longer be cancelled online.",
      ok: false,
      reason: "past_appointment"
    };
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("cancel_token", cancelToken)
    .eq("status", "confirmed")
    .select(
      "add_ons, booking_date, client_email, client_name, client_phone, is_after_hours, price_charged, service_type, status, time_slot"
    )
    .maybeSingle<BookingCancellationRow>();

  if (error) {
    console.error("Failed to cancel booking from client link.", error);

    return {
      message: "Unable to cancel this appointment right now.",
      ok: false,
      reason: "database_error"
    };
  }

  if (!data) {
    return {
      message: "This appointment can no longer be cancelled online.",
      ok: false,
      reason: "not_confirmed"
    };
  }

  return { booking: toCancellationDetails(data), ok: true };
}
