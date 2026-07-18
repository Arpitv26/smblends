"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ADD_ON_PRICES,
  ADD_ON_TYPES,
  AFTER_HOURS_SURCHARGE,
  calculateBookingPrice,
  formatPrice,
  SERVICE_PRICES,
  SERVICE_TYPES,
  STORED_ADD_ON_TYPES,
  type ActiveAddOnType,
  type ServiceType
} from "@/lib/bookings/config";
import {
  BOOKING_CONFIRMATION_STORAGE_KEY,
  type BookingConfirmationSummary
} from "@/lib/bookings/types";
import type {
  WeeklyAvailability,
  WeeklyAvailabilityDay,
  WeeklySlot
} from "@/lib/slots/types";
import {
  bookingDraftSchema,
  type BookingDraft
} from "@/lib/validators/booking";

type BookingAvailabilityProps = {
  initialDate: string;
};

type BookingFormValues = Omit<BookingDraft, "bookingDate" | "timeSlot">;

type BookingResponse = {
  booking?: unknown;
  error?: string;
};

type AvailabilityState = {
  data: WeeklyAvailability | null;
  errorMessage: string | null;
  isLoading: boolean;
};

type BookingSubmissionState =
  | {
      errorMessage: string | null;
      status: "idle";
    }
  | {
      errorMessage: string | null;
      status: "submitting";
    }
  | {
      booking: BookingConfirmationSummary;
      errorMessage: null;
      status: "success";
    }
  | {
      errorMessage: string;
      status: "error";
    };

type BookingFieldName = keyof BookingFormValues | "timeSlot";

type FieldErrors = Partial<Record<BookingFieldName, string>>;

type TouchedState = Record<BookingFieldName, boolean>;

const EMPTY_TOUCHED_STATE: TouchedState = {
  addOns: false,
  clientEmail: false,
  clientName: false,
  clientPhone: false,
  notes: false,
  serviceType: false,
  timeSlot: false
};

const INITIAL_FORM_VALUES: BookingFormValues = {
  addOns: [],
  clientEmail: "",
  clientName: "",
  clientPhone: "",
  notes: "",
  serviceType: "Haircut"
};

function isWeeklySlot(value: unknown): value is WeeklySlot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.value === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.isAfterHours === "boolean" &&
    (candidate.status === "available" ||
      candidate.status === "booked" ||
      candidate.status === "unavailable")
  );
}

function isWeeklyDay(value: unknown): value is WeeklyAvailabilityDay {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.date === "string" &&
    typeof candidate.dateLabel === "string" &&
    typeof candidate.dayLabel === "string" &&
    typeof candidate.isBlocked === "boolean" &&
    Array.isArray(candidate.slots) &&
    candidate.slots.every(isWeeklySlot)
  );
}

function isWeeklyAvailability(value: unknown): value is WeeklyAvailability {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.weekStart === "string" &&
    typeof candidate.weekEnd === "string" &&
    Array.isArray(candidate.days) &&
    candidate.days.length === 7 &&
    candidate.days.every(isWeeklyDay) &&
    Array.isArray(candidate.timeSlots) &&
    candidate.timeSlots.every((slot) => {
      if (!slot || typeof slot !== "object") {
        return false;
      }

      const timeSlot = slot as Record<string, unknown>;

      return (
        typeof timeSlot.value === "string" &&
        typeof timeSlot.label === "string" &&
        typeof timeSlot.isAfterHours === "boolean"
      );
    })
  );
}

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

function isConfirmedBooking(
  value: unknown
): value is BookingConfirmationSummary {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BookingConfirmationSummary>;

  return (
    Array.isArray(candidate.addOns) &&
    candidate.addOns.every((addOn) =>
      STORED_ADD_ON_TYPES.includes(
        addOn as (typeof STORED_ADD_ON_TYPES)[number]
      )
    ) &&
    typeof candidate.bookingDate === "string" &&
    typeof candidate.cancelToken === "string" &&
    (candidate.clientEmail === null || typeof candidate.clientEmail === "string") &&
    typeof candidate.clientName === "string" &&
    typeof candidate.clientPhone === "string" &&
    typeof candidate.isAfterHours === "boolean" &&
    typeof candidate.priceCharged === "number" &&
    SERVICE_TYPES.includes(candidate.serviceType as ServiceType) &&
    typeof candidate.timeSlot === "string"
  );
}

function readConfirmedBooking(
  payload: unknown
): BookingConfirmationSummary | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as BookingResponse;

  return isConfirmedBooking(candidate.booking) ? candidate.booking : null;
}

function formatSelectedDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric"
  }).format(baseDate);
}

function parseIsoDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const nextDate = parseIsoDate(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return formatIsoDate(nextDate);
}

function getMondayForDate(date: string): string {
  const parsedDate = parseIsoDate(date);
  const daysSinceMonday = (parsedDate.getUTCDay() + 6) % 7;
  parsedDate.setUTCDate(parsedDate.getUTCDate() - daysSinceMonday);
  return formatIsoDate(parsedDate);
}

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = parseIsoDate(weekStart);
  const end = parseIsoDate(weekEnd);
  const startLabel = new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric"
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

function buildFieldErrors(draft: BookingDraft): FieldErrors {
  const validationResult = bookingDraftSchema.safeParse(draft);

  if (validationResult.success) {
    return {};
  }

  const errors: FieldErrors = {};

  for (const issue of validationResult.error.issues) {
    const fieldName = issue.path[0];

    if (
      typeof fieldName === "string" &&
      !(fieldName in errors)
    ) {
      errors[fieldName as BookingFieldName] = issue.message;
    }
  }

  return errors;
}

function getSelectedSlot(
  availability: WeeklyAvailability | null,
  selectedDate: string,
  selectedValue: string | null
): WeeklySlot | null {
  if (!selectedValue) {
    return null;
  }

  return (
    availability?.days
      .find((day) => day.date === selectedDate)
      ?.slots.find(
        (slot) =>
          slot.value === selectedValue && slot.status === "available"
      ) ?? null
  );
}

export function BookingAvailability({
  initialDate
}: BookingAvailabilityProps): JSX.Element {
  const router = useRouter();
  const currentWeekStart = getMondayForDate(initialDate);
  const [weekStart, setWeekStart] = useState<string>(currentWeekStart);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlotValue, setSelectedSlotValue] = useState<string | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [formValues, setFormValues] =
    useState<BookingFormValues>(INITIAL_FORM_VALUES);
  const [touchedFields, setTouchedFields] =
    useState<TouchedState>(EMPTY_TOUCHED_STATE);
  const [availability, setAvailability] = useState<AvailabilityState>({
    data: null,
    errorMessage: null,
    isLoading: true
  });
  const [submission, setSubmission] = useState<BookingSubmissionState>({
    errorMessage: null,
    status: "idle"
  });

  const weeklyAvailability = availability.data;
  const selectedSlot = getSelectedSlot(
    weeklyAvailability,
    selectedDate,
    selectedSlotValue
  );
  const selectedDay =
    weeklyAvailability?.days.find((day) => day.date === selectedDate) ?? null;
  const bookingDraft: BookingDraft = {
    bookingDate: selectedDate,
    timeSlot: selectedSlot?.value ?? "",
    ...formValues
  };
  const fieldErrors = buildFieldErrors(bookingDraft);
  const isDraftReady = Object.keys(fieldErrors).length === 0;
  const estimatedPrice = selectedSlot
    ? calculateBookingPrice({
        addOns: formValues.addOns,
        isAfterHours: selectedSlot.isAfterHours,
        serviceType: formValues.serviceType
      })
    : null;
  const isSubmitting = submission.status === "submitting";
  const isBookingConfirmed = submission.status === "success";
  const isFormDisabled = !selectedSlot || isSubmitting || isBookingConfirmed;

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability(): Promise<void> {
      setAvailability((currentAvailability) => ({
        data: currentAvailability.data,
        errorMessage: null,
        isLoading: true
      }));

      try {
        const response = await fetch(
          `/api/availability/week?start=${encodeURIComponent(weekStart)}`,
          {
            cache: "no-store",
            signal: controller.signal
          }
        );
        const payload: unknown = await response.json();

        if (!response.ok) {
          throw new Error(
            readErrorMessage(payload) ??
              "Unable to load available slots right now."
          );
        }

        if (!isWeeklyAvailability(payload)) {
          throw new Error("Availability response was in an unexpected format.");
        }

        setAvailability({
          data: payload,
          errorMessage: null,
          isLoading: false
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load available slots right now.";

        setAvailability({
          data: null,
          errorMessage,
          isLoading: false
        });
      }
    }

    void loadAvailability();

    return () => {
      controller.abort();
    };
  }, [refreshKey, weekStart]);

  function resetSlotSelection(): void {
    setSelectedSlotValue(null);
    setSubmission({
      errorMessage: null,
      status: "idle"
    });
    setTouchedFields((currentState) => ({
      ...currentState,
      timeSlot: false
    }));
  }

  function selectDay(date: string): void {
    if (date === selectedDate) {
      return;
    }

    setSelectedDate(date);
    resetSlotSelection();
  }

  function changeWeek(nextWeekStart: string): void {
    if (nextWeekStart < currentWeekStart) {
      return;
    }

    setWeekStart(nextWeekStart);
    setSelectedDate(
      nextWeekStart === currentWeekStart ? initialDate : nextWeekStart
    );
    resetSlotSelection();
  }

  function selectSlot(date: string, slot: WeeklySlot): void {
    if (slot.status !== "available") {
      return;
    }

    setSelectedDate(date);
    setSelectedSlotValue(slot.value);
    markFieldTouched("timeSlot");
    setSubmission({
      errorMessage: null,
      status: "idle"
    });
  }

  function updateField<K extends keyof BookingFormValues>(
    fieldName: K,
    value: BookingFormValues[K]
  ): void {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value
    }));
  }

  function markFieldTouched(fieldName: BookingFieldName): void {
    setTouchedFields((currentState) => ({
      ...currentState,
      [fieldName]: true
    }));
  }

  function selectService(serviceType: ServiceType): void {
    updateField("serviceType", serviceType);
    markFieldTouched("serviceType");
  }

  function toggleAddOn(addOn: ActiveAddOnType): void {
    setFormValues((currentValues) => {
      const nextAddOns = currentValues.addOns.includes(addOn)
        ? currentValues.addOns.filter((currentAddOn) => currentAddOn !== addOn)
        : [...currentValues.addOns, addOn];

      return {
        ...currentValues,
        addOns: nextAddOns
      };
    });
    markFieldTouched("addOns");
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationResult = bookingDraftSchema.safeParse(bookingDraft);

    if (!validationResult.success) {
      setTouchedFields({
        addOns: true,
        clientEmail: true,
        clientName: true,
        clientPhone: true,
        notes: true,
        serviceType: true,
        timeSlot: true
      });
      setSubmission({
        errorMessage: "Please fix the highlighted details before booking.",
        status: "error"
      });
      return;
    }

    setSubmission({
      errorMessage: null,
      status: "submitting"
    });

    try {
      const response = await fetch("/api/bookings", {
        body: JSON.stringify(validationResult.data),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          readErrorMessage(payload) ??
          "Unable to save the booking right now. Please try again.";

        if (response.status === 409 && selectedSlotValue) {
          setAvailability((currentAvailability) => ({
            ...currentAvailability,
            data: currentAvailability.data
              ? {
                  ...currentAvailability.data,
                  days: currentAvailability.data.days.map((day) =>
                    day.date === selectedDate
                      ? {
                          ...day,
                          slots: day.slots.map((slot) =>
                            slot.value === selectedSlotValue
                              ? { ...slot, status: "booked" }
                              : slot
                          )
                        }
                      : day
                  )
                }
              : null
          }));
          setSelectedSlotValue(null);
          setRefreshKey((currentKey) => currentKey + 1);
        }

        setSubmission({
          errorMessage,
          status: "error"
        });
        return;
      }

      const confirmedBooking = readConfirmedBooking(payload);

      if (!confirmedBooking) {
        throw new Error("Booking response was in an unexpected format.");
      }

      setSubmission({
        booking: confirmedBooking,
        errorMessage: null,
        status: "success"
      });
      window.sessionStorage.setItem(
        BOOKING_CONFIRMATION_STORAGE_KEY,
        JSON.stringify(confirmedBooking)
      );
      router.push("/book/confirmed");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to save the booking right now. Please try again.";

      setSubmission({
        errorMessage,
        status: "error"
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Weekly Calendar
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Pick an available 1-hour appointment.
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {formatWeekRange(
                weeklyAvailability?.weekStart ?? weekStart,
                weeklyAvailability?.weekEnd ?? addDays(weekStart, 6)
              )}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={weekStart <= currentWeekStart}
              onClick={() => changeWeek(addDays(weekStart, -7))}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={weekStart === currentWeekStart}
              onClick={() => changeWeek(currentWeekStart)}
              type="button"
            >
              This week
            </button>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
              onClick={() => changeWeek(addDays(weekStart, 7))}
              type="button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-zinc-950/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-white" />
                Available
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-zinc-600" />
                Booked
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm border border-white/10 bg-white/[0.03]" />
                Unavailable
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              After-hours start at 9 PM (+$10)
            </p>
          </div>

          {availability.errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              <p>{availability.errorMessage}</p>
              <button
                className="mt-3 rounded-xl border border-red-200/20 px-3 py-2 font-medium transition hover:bg-red-100/10"
                onClick={() => setRefreshKey((currentKey) => currentKey + 1)}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : null}

          {availability.isLoading ? (
            <div
              aria-live="polite"
              className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-300"
            >
              Loading this week&apos;s calendar...
            </div>
          ) : null}

          {!availability.errorMessage &&
          !availability.isLoading &&
          weeklyAvailability ? (
            weeklyAvailability.timeSlots.length > 0 ? (
              <div className="mt-5">
                <div className="hidden overflow-x-auto md:block">
                  <div className="min-w-[52rem]">
                    <div className="grid grid-cols-[7rem_repeat(7,minmax(0,1fr))] border-b border-white/10">
                      <div className="px-2 py-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Time
                      </div>
                      {weeklyAvailability.days.map((day) => (
                        <div
                          className="border-l border-white/10 px-2 py-3 text-center"
                          key={day.date}
                        >
                          <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                            {day.dayLabel}
                          </p>
                          <p className="mt-1 text-sm font-medium text-white">
                            {day.dateLabel}
                          </p>
                          {day.date === initialDate ? (
                            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
                              Today
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {weeklyAvailability.timeSlots.map((timeSlot) => (
                      <div
                        className="grid grid-cols-[7rem_repeat(7,minmax(0,1fr))] border-b border-white/5 last:border-b-0"
                        key={timeSlot.value}
                      >
                        <div className="flex min-h-16 flex-col justify-center px-2 py-2">
                          <span className="text-sm font-medium text-zinc-200">
                            {timeSlot.label}
                          </span>
                          {timeSlot.isAfterHours ? (
                            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500">
                              After-hours
                            </span>
                          ) : null}
                        </div>
                        {weeklyAvailability.days.map((day) => {
                          const slot = day.slots.find(
                            (candidate) =>
                              candidate.value === timeSlot.value
                          );
                          const isSelected =
                            day.date === selectedDate &&
                            slot?.value === selectedSlotValue;

                          return (
                            <button
                              aria-label={`${day.dayLabel} ${day.dateLabel} at ${timeSlot.label}: ${slot?.status ?? "unavailable"}`}
                              aria-pressed={isSelected}
                              className={`m-1 min-h-14 rounded-xl border px-1 py-2 text-xs font-medium transition ${
                                slot?.status === "available"
                                  ? isSelected
                                    ? "border-white bg-white text-black ring-2 ring-white/40 ring-offset-2 ring-offset-zinc-950"
                                    : "border-white/80 bg-white text-black hover:bg-zinc-200"
                                  : slot?.status === "booked"
                                    ? "cursor-not-allowed border-zinc-600 bg-zinc-700 text-zinc-200"
                                    : "cursor-not-allowed border-white/5 bg-white/[0.025] text-zinc-600"
                              }`}
                              disabled={slot?.status !== "available"}
                              key={day.date}
                              onBlur={() => markFieldTouched("timeSlot")}
                              onClick={() => {
                                if (slot) {
                                  selectSlot(day.date, slot);
                                }
                              }}
                              type="button"
                            >
                              {slot?.status === "available"
                                ? isSelected
                                  ? "Selected"
                                  : "Open"
                                : slot?.status === "booked"
                                  ? "Booked"
                                  : "—"}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:hidden">
                  <div className="grid grid-cols-7 gap-1">
                    {weeklyAvailability.days.map((day) => {
                      const isSelected = day.date === selectedDate;
                      const availableCount = day.slots.filter(
                        (slot) => slot.status === "available"
                      ).length;

                      return (
                        <button
                          aria-pressed={isSelected}
                          className={`rounded-xl border px-1 py-2 text-center transition ${
                            isSelected
                              ? "border-white/40 bg-white/10 text-white"
                              : "border-white/10 bg-white/[0.03] text-zinc-400"
                          }`}
                          key={day.date}
                          onClick={() => selectDay(day.date)}
                          type="button"
                        >
                          <span className="block text-[0.65rem] uppercase">
                            {day.dayLabel.slice(0, 1)}
                          </span>
                          <span className="mt-1 block text-xs font-medium">
                            {day.dateLabel.split(" ")[1]}
                          </span>
                          <span className="mt-1 block text-[0.6rem] text-zinc-500">
                            {availableCount > 0 ? availableCount : "—"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedDay ? (
                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">
                            {formatSelectedDate(selectedDay.date)}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {
                              selectedDay.slots.filter(
                                (slot) => slot.status === "available"
                              ).length
                            }{" "}
                            available
                          </p>
                        </div>
                        {selectedDay.isBlocked ? (
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-zinc-400">
                            Blocked
                          </span>
                        ) : null}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {selectedDay.slots.map((slot) => {
                          const isSelected =
                            slot.value === selectedSlotValue;

                          return (
                            <li key={slot.value}>
                              <button
                                aria-pressed={isSelected}
                                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                  slot.status === "available"
                                    ? isSelected
                                      ? "border-white bg-white text-black"
                                      : "border-white/20 bg-white/[0.06] text-white hover:bg-white/10"
                                    : slot.status === "booked"
                                      ? "cursor-not-allowed border-zinc-600 bg-zinc-700/80 text-zinc-200"
                                      : "cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-600"
                                }`}
                                disabled={slot.status !== "available"}
                                onBlur={() => markFieldTouched("timeSlot")}
                                onClick={() =>
                                  selectSlot(selectedDay.date, slot)
                                }
                                type="button"
                              >
                                <span>
                                  <span className="block font-medium">
                                    {slot.label}
                                  </span>
                                  {slot.isAfterHours ? (
                                    <span className="mt-1 block text-xs opacity-70">
                                      After-hours +$10
                                    </span>
                                  ) : null}
                                </span>
                                <span className="text-xs uppercase tracking-[0.14em]">
                                  {slot.status === "available"
                                    ? isSelected
                                      ? "Selected"
                                      : "Available"
                                    : slot.status === "booked"
                                      ? "Booked"
                                      : "Unavailable"}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {touchedFields.timeSlot && fieldErrors.timeSlot ? (
                  <p className="mt-3 text-sm text-red-200">
                    {fieldErrors.timeSlot}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm leading-6 text-zinc-300">
                No appointment times are scheduled for this week. Try the next
                week.
              </div>
            )
          ) : null}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(9,9,11,0.3))] p-4">
          <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
            Booking Details
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {selectedSlot
              ? "Your appointment draft is ready."
              : "Choose a time slot to continue."}
          </h3>
          {selectedSlot ? (
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Fill in the client details below and review the estimated total.
            </p>
          ) : null}
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Selected appointment
          </p>
          {selectedSlot ? (
            <div className="mt-3 space-y-2">
              <p className="text-base font-medium text-white">
                {formatSelectedDate(selectedDate)}
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-100">
                  {selectedSlot.label}
                </span>
                {selectedSlot.isAfterHours ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
                    After-hours
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              No time selected yet.
            </p>
          )}
        </div>

        <form className="mt-4 space-y-4" onSubmit={submitBooking}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Client name
            </span>
            <input
              aria-invalid={touchedFields.clientName && fieldErrors.clientName ? true : undefined}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFormDisabled}
              maxLength={80}
              onBlur={() => markFieldTouched("clientName")}
              onChange={(event) => updateField("clientName", event.target.value)}
              placeholder="Your full name"
              type="text"
              value={formValues.clientName}
            />
            {touchedFields.clientName && fieldErrors.clientName ? (
              <p className="mt-2 text-sm text-red-200">
                {fieldErrors.clientName}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Phone number
            </span>
            <input
              aria-invalid={touchedFields.clientPhone && fieldErrors.clientPhone ? true : undefined}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFormDisabled}
              maxLength={30}
              onBlur={() => markFieldTouched("clientPhone")}
              onChange={(event) => updateField("clientPhone", event.target.value)}
              placeholder="604 555 0123"
              type="tel"
              value={formValues.clientPhone}
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              We&apos;ll text your confirmation and cancel link to this number.
              Reply STOP to opt out.
            </p>
            {touchedFields.clientPhone && fieldErrors.clientPhone ? (
              <p className="mt-2 text-sm text-red-200">
                {fieldErrors.clientPhone}
              </p>
            ) : null}
          </label>

          <div className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Service
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICE_TYPES.map((serviceType) => {
                const isSelected = formValues.serviceType === serviceType;

                return (
                  <button
                    className={`rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-white/40 bg-white/[0.08] text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/20"
                    }`}
                    disabled={isFormDisabled}
                    key={serviceType}
                    onClick={() => selectService(serviceType)}
                    type="button"
                  >
                    <span className="block text-base font-medium">
                      {serviceType}
                    </span>
                    <span className="mt-1 block text-sm text-zinc-400">
                      {formatPrice(SERVICE_PRICES[serviceType])}
                    </span>
                  </button>
                );
              })}
            </div>
            {touchedFields.serviceType && fieldErrors.serviceType ? (
              <p className="mt-2 text-sm text-red-200">
                {fieldErrors.serviceType}
              </p>
            ) : null}
          </div>

          <div className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Add-ons
              <span className="ml-2 text-zinc-500">Optional</span>
            </span>
            <div className="grid gap-3">
              {ADD_ON_TYPES.map((addOn) => {
                const isSelected = formValues.addOns.includes(addOn);

                return (
                  <label
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                      selectedSlot && !isFormDisabled
                        ? "border-white/10 bg-white/5 text-zinc-100"
                        : "border-white/10 bg-white/5 text-zinc-100 opacity-50"
                    }`}
                    key={addOn}
                  >
                    <span>
                      <span className="block text-sm font-medium">{addOn}</span>
                      <span className="mt-1 block text-sm text-zinc-400">
                        +{formatPrice(ADD_ON_PRICES[addOn])}
                      </span>
                    </span>
                    <input
                      checked={isSelected}
                      className="size-5 accent-white"
                      disabled={isFormDisabled}
                      onChange={() => toggleAddOn(addOn)}
                      type="checkbox"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Email
              <span className="ml-2 text-zinc-500">Optional</span>
            </span>
            <input
              aria-invalid={touchedFields.clientEmail && fieldErrors.clientEmail ? true : undefined}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFormDisabled}
              maxLength={120}
              onBlur={() => markFieldTouched("clientEmail")}
              onChange={(event) => updateField("clientEmail", event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={formValues.clientEmail}
            />
            {touchedFields.clientEmail && fieldErrors.clientEmail ? (
              <p className="mt-2 text-sm text-red-200">
                {fieldErrors.clientEmail}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Notes
              <span className="ml-2 text-zinc-500">Optional</span>
            </span>
            <textarea
              aria-invalid={touchedFields.notes && fieldErrors.notes ? true : undefined}
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isFormDisabled}
              maxLength={500}
              onBlur={() => markFieldTouched("notes")}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Anything the barber should know?"
              value={formValues.notes}
            />
            {touchedFields.notes && fieldErrors.notes ? (
              <p className="mt-2 text-sm text-red-200">{fieldErrors.notes}</p>
            ) : null}
          </label>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Estimated total
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  Pay cash or e-transfer. Payment is expected before or after
                  the haircut.
                </p>
              </div>
              <p className="text-2xl font-semibold text-white">
                {estimatedPrice === null ? "--" : formatPrice(estimatedPrice)}
              </p>
            </div>
            {selectedSlot?.isAfterHours ? (
              <p className="mt-3 text-sm text-zinc-300">
                Includes the +{formatPrice(AFTER_HOURS_SURCHARGE)} after-hours
                fee.
              </p>
            ) : null}
          </div>

          {submission.status === "error" ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {submission.errorMessage}
            </div>
          ) : null}

          {submission.status === "success" ? (
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-50">
              <p className="font-medium">
                Booking saved for {submission.booking.clientName}.
              </p>
              <p className="mt-1">
                Total: {formatPrice(submission.booking.priceCharged)}. Bring
                cash or e-transfer to sanchitmehta51@gmail.com.
              </p>
            </div>
          ) : null}

          <button
            className="h-12 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              !selectedSlot || !isDraftReady || isSubmitting || isBookingConfirmed
            }
            type="submit"
          >
            {isSubmitting
              ? "Saving booking..."
              : isBookingConfirmed
                ? "Booking Saved"
                : "Book Appointment"}
          </button>
        </form>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">
            {isBookingConfirmed
              ? "Your booking has been saved."
              : selectedSlot && isDraftReady
                ? "This booking is ready to submit."
              : "Select a slot and fill the required fields to continue."}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {isBookingConfirmed
              ? "Keep this screen for your records. Your confirmation text includes a private cancellation link."
              : selectedSlot
                ? "The site will recheck availability before saving to prevent double-booking."
                : "Select a slot first, then fill the form to preview the complete booking flow."}
          </p>
          <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-zinc-400">
            <p>20 minutes late: $5 fee.</p>
            <p>30 minutes late: marked as no-show.</p>
            <p>Same-day cancellation or no-show: $10 fee on next cut.</p>
            <p>Maximum 2 extra people per client.</p>
            <p>
              Need to cancel? Use the private link in your confirmation text.
              For rescheduling, message @smblends._ or text 778-681-7694.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
