"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ADD_ON_TYPES, formatPrice, SERVICE_TYPES } from "@/lib/bookings/config";
import {
  BOOKING_CONFIRMATION_STORAGE_KEY,
  type BookingConfirmationSummary
} from "@/lib/bookings/types";

function isBookingConfirmationSummary(
  value: unknown
): value is BookingConfirmationSummary {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BookingConfirmationSummary>;

  return (
    Array.isArray(candidate.addOns) &&
    candidate.addOns.every((addOn) =>
      ADD_ON_TYPES.includes(addOn as (typeof ADD_ON_TYPES)[number])
    ) &&
    typeof candidate.bookingDate === "string" &&
    typeof candidate.cancelToken === "string" &&
    typeof candidate.clientEmail === "string" &&
    typeof candidate.clientName === "string" &&
    typeof candidate.isAfterHours === "boolean" &&
    typeof candidate.priceCharged === "number" &&
    SERVICE_TYPES.includes(candidate.serviceType as (typeof SERVICE_TYPES)[number]) &&
    typeof candidate.timeSlot === "string"
  );
}

function readStoredConfirmation(): BookingConfirmationSummary | null {
  const storedValue = window.sessionStorage.getItem(
    BOOKING_CONFIRMATION_STORAGE_KEY
  );

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return isBookingConfirmationSummary(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
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

export default function BookingConfirmedPage(): JSX.Element {
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationSummary | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setConfirmation(readStoredConfirmation());
    setHasLoaded(true);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
          href="/book"
        >
          Back to booking
        </Link>

        <div className="confirmation-rise rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="confirmation-check flex size-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/15 text-2xl text-emerald-100">
                ✓
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.36em] text-emerald-200/80">
                Booking Confirmed
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                You&apos;re locked in.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
                Your appointment has been saved, and a confirmation email was
                sent to your inbox.
              </p>
            </div>

            {confirmation ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Total
                </p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {formatPrice(confirmation.priceCharged)}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {!hasLoaded ? (
          <div className="confirmation-rise rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 text-sm text-zinc-300">
            Loading confirmation...
          </div>
        ) : confirmation ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="confirmation-rise rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Appointment Details
              </p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-zinc-400">Client</p>
                  <p className="mt-1 text-lg font-medium text-white">
                    {confirmation.clientName}
                  </p>
                  <p className="mt-2 break-all text-sm text-zinc-400">
                    Confirmation sent to {confirmation.clientEmail}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-zinc-400">Date</p>
                    <p className="mt-1 text-base font-medium text-white">
                      {formatBookingDate(confirmation.bookingDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-zinc-400">Time</p>
                    <p className="mt-1 text-base font-medium text-white">
                      {formatTimeSlot(confirmation.timeSlot)}
                    </p>
                    {confirmation.isAfterHours ? (
                      <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
                        After-hours
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-zinc-400">Service</p>
                  <p className="mt-1 text-base font-medium text-white">
                    {confirmation.serviceType}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {confirmation.addOns.length > 0
                      ? `Add-ons: ${confirmation.addOns.join(", ")}`
                      : "No add-ons selected"}
                  </p>
                </div>
              </div>
            </section>

            <aside className="confirmation-rise space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur sm:p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Payment
                </p>
                <p className="mt-3 text-base leading-7 text-zinc-200">
                  Pay cash or e-transfer. Payment is expected before or after
                  the haircut.
                </p>
                <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                  E-transfer: sanchitmehta51@gmail.com
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur sm:p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Need To Cancel?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Use your private cancellation link below or in your
                  confirmation email.
                </p>
                <Link
                  className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                  href={`/booking/cancel/${confirmation.cancelToken}`}
                >
                  Cancel Appointment
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur sm:p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Location
                </p>
                <p className="mt-3 text-base leading-7 text-zinc-200">
                  6686 Imperial St, Burnaby, BC V5E 1M8
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Do not knock on the front door. Go down the driveway and go up
                  the stairs. Street parking is available.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="confirmation-rise rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-xl shadow-black/20">
            <h2 className="text-2xl font-semibold text-white">
              No confirmation found.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              This page only shows the booking you just completed in this
              browser tab. Start a new booking if you need another appointment.
            </p>
          </div>
        )}

        <section className="confirmation-rise rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <p className="text-sm font-medium text-white">Policy Reminder</p>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-zinc-400 sm:grid-cols-2">
            <p>20 minutes late: $5 fee.</p>
            <p>30 minutes late: marked as no-show.</p>
            <p>Same-day cancellation or no-show: $10 fee on next cut.</p>
            <p>Maximum 2 extra people per client.</p>
            <p className="sm:col-span-2">
              Need to cancel? Use your private cancellation link. For
              rescheduling, message @smblends._ or text 778-681-7694.
            </p>
          </div>
        </section>

        <div className="confirmation-rise flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            href="/book"
          >
            Book Another Cut
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
            href="/"
          >
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
