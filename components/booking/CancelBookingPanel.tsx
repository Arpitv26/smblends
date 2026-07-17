"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice } from "@/lib/bookings/config";
import type { BookingCancellationDetails } from "@/lib/bookings/types";

type CancelBookingPanelProps = {
  booking: BookingCancellationDetails;
  canCancel: boolean;
  cancelToken: string;
  unavailableMessage: string | null;
};

type CancellationState =
  | {
      errorMessage: null;
      status: "idle" | "submitting" | "success";
    }
  | {
      errorMessage: string;
      status: "error";
    };

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

function formatBookingDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric"
  }).format(baseDate);
}

function formatTimeSlot(timeSlot: string): string {
  const [hoursPart, minutesPart] = timeSlot.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeSlot;
  }

  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

export function CancelBookingPanel({
  booking,
  canCancel,
  cancelToken,
  unavailableMessage
}: CancelBookingPanelProps): JSX.Element {
  const [cancellation, setCancellation] = useState<CancellationState>({
    errorMessage: null,
    status: "idle"
  });
  const isSubmitting = cancellation.status === "submitting";
  const isCancelled = cancellation.status === "success";

  async function cancelAppointment(): Promise<void> {
    const confirmed = window.confirm(
      "Cancel this appointment? This will reopen the time slot for other clients."
    );

    if (!confirmed) {
      return;
    }

    setCancellation({ errorMessage: null, status: "submitting" });

    try {
      const response = await fetch("/api/bookings/cancel", {
        body: JSON.stringify({ cancelToken }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setCancellation({
          errorMessage:
            readErrorMessage(payload) ??
            "Unable to cancel this appointment right now.",
          status: "error"
        });
        return;
      }

      setCancellation({ errorMessage: null, status: "success" });
    } catch {
      setCancellation({
        errorMessage: "Unable to cancel this appointment right now.",
        status: "error"
      });
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Appointment Details
        </p>
        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-zinc-400">Client</p>
            <p className="mt-1 text-lg font-medium text-white">
              {booking.clientName}
            </p>
            <p className="mt-2 break-all text-sm text-zinc-400">
              {booking.clientPhone}
            </p>
            {booking.clientEmail ? (
              <p className="mt-1 break-all text-sm text-zinc-500">
                {booking.clientEmail}
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-400">Date</p>
              <p className="mt-1 text-base font-medium text-white">
                {formatBookingDate(booking.bookingDate)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-400">Time</p>
              <p className="mt-1 text-base font-medium text-white">
                {formatTimeSlot(booking.timeSlot)}
              </p>
              {booking.isAfterHours ? (
                <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
                  After-hours
                </span>
              ) : null}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-zinc-400">Service</p>
            <p className="mt-1 text-base font-medium text-white">
              {booking.serviceType}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              {booking.addOns.length > 0
                ? `Add-ons: ${booking.addOns.join(", ")}`
                : "No add-ons selected"}
            </p>
          </div>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Cancel Appointment
        </p>
        <p className="mt-3 text-3xl font-semibold text-white">
          {formatPrice(booking.priceCharged)}
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Same-day cancellations or no-shows may add a $10 fee to the next cut.
        </p>

        {isCancelled ? (
          <div className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4">
            <p className="font-medium text-emerald-100">
              Your appointment has been cancelled.
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-100/80">
              The time slot is now open again. A cancellation text was sent to
              you, and Sanchit was emailed.
            </p>
          </div>
        ) : unavailableMessage ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm leading-6 text-zinc-300">
              {unavailableMessage}
            </p>
          </div>
        ) : null}

        {cancellation.status === "error" ? (
          <p className="mt-4 text-sm leading-6 text-red-200">
            {cancellation.errorMessage}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3">
          <button
            className="h-12 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canCancel || isSubmitting || isCancelled}
            onClick={cancelAppointment}
            type="button"
          >
            {isSubmitting
              ? "Cancelling..."
              : isCancelled
                ? "Appointment Cancelled"
                : "Cancel Appointment"}
          </button>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
            href="/book"
          >
            Book Another Time
          </Link>
        </div>
      </aside>
    </section>
  );
}
