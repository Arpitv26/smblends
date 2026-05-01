import type { ReactNode } from "react";

import { formatPrice } from "@/lib/bookings/config";
import type { AdminBooking } from "@/lib/admin/get-upcoming-bookings";

type AdminBookingCardProps = {
  action?: ReactNode;
  booking: AdminBooking;
  statusLabel?: string;
};

function formatBookingDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    timeZone: "America/Vancouver",
    weekday: "short"
  }).format(baseDate);
}

function formatBookingTime(timeSlot: string): string {
  const [hourValue = "0", minuteValue = "0"] = timeSlot.split(":");
  const baseDate = new Date();

  baseDate.setHours(Number(hourValue), Number(minuteValue), 0, 0);

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver"
  }).format(baseDate);
}

export function AdminBookingCard({
  action,
  booking,
  statusLabel
}: AdminBookingCardProps): JSX.Element {
  const addOnText =
    booking.addOns.length > 0 ? booking.addOns.join(", ") : "No add-ons";

  return (
    <li className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {booking.clientName}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{booking.clientPhone}</p>
          {booking.clientEmail ? (
            <p className="mt-1 break-all text-sm text-zinc-400">
              {booking.clientEmail}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-100">
            {formatBookingDate(booking.bookingDate)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-100">
            {formatBookingTime(booking.timeSlot)}
          </span>
          {booking.isAfterHours ? (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
              After-hours
            </span>
          ) : null}
          {statusLabel ? (
            <span className="rounded-full border border-red-300/25 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-red-100">
              {statusLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Service
          </p>
          <p className="mt-1 text-sm text-zinc-100">{booking.serviceType}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Add-ons
          </p>
          <p className="mt-1 text-sm text-zinc-100">{addOnText}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Total
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">
            {formatPrice(booking.priceCharged)}
          </p>
        </div>
      </div>

      {booking.notes ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
          {booking.notes}
        </div>
      ) : null}

      {action ? (
        <div className="mt-4 border-t border-white/10 pt-4">{action}</div>
      ) : null}
    </li>
  );
}
