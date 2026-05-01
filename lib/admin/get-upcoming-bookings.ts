import "server-only";

import {
  ADD_ON_TYPES,
  SERVICE_TYPES,
  type AddOnType,
  type ServiceType
} from "@/lib/bookings/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type UpcomingBooking = {
  addOns: AddOnType[];
  bookingDate: string;
  clientEmail: string | null;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  id: string;
  isAfterHours: boolean;
  notes: string | null;
  priceCharged: number;
  serviceType: ServiceType;
  status: "confirmed";
  timeSlot: string;
};

export type AdminBooking = UpcomingBooking | NoShowBooking;

export type NoShowBooking = Omit<UpcomingBooking, "status"> & {
  status: "no_show";
};

export type BookingStatus = AdminBooking["status"];

type BookingRow = {
  add_ons: string[] | null;
  booking_date: string;
  client_email: string | null;
  client_name: string;
  client_phone: string;
  created_at: string;
  id: string;
  is_after_hours: boolean;
  notes: string | null;
  price_charged: number;
  service_type: string;
  status: string;
  time_slot: string;
};

const BOOKING_SELECT_COLUMNS =
  "id, booking_date, time_slot, client_name, client_email, client_phone, service_type, add_ons, is_after_hours, price_charged, status, notes, created_at";

function getTodayInVancouver(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Vancouver",
    year: "numeric"
  }).formatToParts(new Date());

  const getPart = (type: "day" | "month" | "year"): string => {
    const value = parts.find((part) => part.type === type)?.value;

    if (!value) {
      throw new Error(`Missing ${type} while formatting Vancouver date.`);
    }

    return value;
  };

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

function isAddOnType(value: string): value is AddOnType {
  return ADD_ON_TYPES.includes(value as AddOnType);
}

function toAddOns(values: string[] | null): AddOnType[] {
  return values?.filter(isAddOnType) ?? [];
}

function toServiceType(value: string): ServiceType {
  if (SERVICE_TYPES.includes(value as ServiceType)) {
    return value as ServiceType;
  }

  throw new Error(`Unexpected service type in booking row: ${value}`);
}

function toBookingStatus(value: string): BookingStatus {
  if (value === "confirmed" || value === "no_show") {
    return value;
  }

  throw new Error(`Unexpected admin booking status: ${value}`);
}

function toAdminBooking(row: BookingRow): AdminBooking {
  return {
    addOns: toAddOns(row.add_ons),
    bookingDate: row.booking_date,
    clientEmail: row.client_email,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    createdAt: row.created_at,
    id: row.id,
    isAfterHours: row.is_after_hours,
    notes: row.notes,
    priceCharged: row.price_charged,
    serviceType: toServiceType(row.service_type),
    status: toBookingStatus(row.status),
    timeSlot: row.time_slot
  };
}

function toUpcomingBooking(row: BookingRow): UpcomingBooking {
  const booking = toAdminBooking(row);

  if (booking.status !== "confirmed") {
    throw new Error(`Unexpected upcoming booking status: ${booking.status}`);
  }

  return booking;
}

export function toNoShowBooking(row: BookingRow): NoShowBooking {
  const booking = toAdminBooking(row);

  if (booking.status !== "no_show") {
    throw new Error(`Unexpected no-show booking status: ${booking.status}`);
  }

  return booking;
}

export async function getUpcomingBookings(): Promise<UpcomingBooking[]> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT_COLUMNS)
    .eq("status", "confirmed")
    .gte("booking_date", getTodayInVancouver())
    .order("booking_date", { ascending: true })
    .order("time_slot", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Failed to load upcoming bookings.", error);
    throw new Error("Unable to load upcoming bookings right now.");
  }

  const rows = (data ?? []) as BookingRow[];

  return rows.map(toUpcomingBooking);
}

export { BOOKING_SELECT_COLUMNS };
