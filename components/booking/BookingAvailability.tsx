"use client";

import { useEffect, useState } from "react";

import {
  ADD_ON_PRICES,
  ADD_ON_TYPES,
  AFTER_HOURS_SURCHARGE,
  calculateBookingPrice,
  formatPrice,
  SERVICE_PRICES,
  SERVICE_TYPES,
  type AddOnType,
  type ServiceType
} from "@/lib/bookings/config";
import type { AvailableSlot } from "@/lib/slots/types";
import {
  bookingDraftSchema,
  type BookingDraft
} from "@/lib/validators/booking";

type BookingAvailabilityProps = {
  initialDate: string;
};

type BookingFormValues = Omit<BookingDraft, "bookingDate" | "timeSlot">;

type AvailabilityResponse = {
  error?: string;
  slots?: unknown;
};

type AvailabilityState = {
  errorMessage: string | null;
  isLoading: boolean;
  slots: AvailableSlot[];
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

function isAvailableSlot(value: unknown): value is AvailableSlot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.value === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.isAfterHours === "boolean"
  );
}

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

function readSlots(payload: unknown): AvailableSlot[] | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as AvailabilityResponse;

  if (!Array.isArray(candidate.slots)) {
    return null;
  }

  return candidate.slots.filter(isAvailableSlot);
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
  slots: AvailableSlot[],
  selectedValue: string | null
): AvailableSlot | null {
  if (!selectedValue) {
    return null;
  }

  return slots.find((slot) => slot.value === selectedValue) ?? null;
}

export function BookingAvailability({
  initialDate
}: BookingAvailabilityProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlotValue, setSelectedSlotValue] = useState<string | null>(
    null
  );
  const [formValues, setFormValues] =
    useState<BookingFormValues>(INITIAL_FORM_VALUES);
  const [touchedFields, setTouchedFields] =
    useState<TouchedState>(EMPTY_TOUCHED_STATE);
  const [availability, setAvailability] = useState<AvailabilityState>({
    errorMessage: null,
    isLoading: true,
    slots: []
  });

  const selectedSlot = getSelectedSlot(availability.slots, selectedSlotValue);
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability(): Promise<void> {
      setSelectedSlotValue(null);
      setTouchedFields((currentState) => ({
        ...currentState,
        timeSlot: false
      }));
      setAvailability({
        errorMessage: null,
        isLoading: true,
        slots: []
      });

      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate)}`,
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

        const slots = readSlots(payload);

        if (!slots) {
          throw new Error("Availability response was in an unexpected format.");
        }

        setAvailability({
          errorMessage: null,
          isLoading: false,
          slots
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
          errorMessage,
          isLoading: false,
          slots: []
        });
      }
    }

    void loadAvailability();

    return () => {
      controller.abort();
    };
  }, [selectedDate]);

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

  function toggleAddOn(addOn: AddOnType): void {
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

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)]">
      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-amber-300/70">
              Booking Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Pick a date and choose a 1-hour slot.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-300">
              Times are shown in Vancouver time. Select one slot to unlock the
              booking details section.
            </p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Appointment date
            </span>
            <input
              className="h-12 w-full min-w-[15rem] rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20"
              min={initialDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              type="date"
              value={selectedDate}
            />
          </label>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-zinc-950/70 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-100">
                {formatSelectedDate(selectedDate)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {availability.isLoading
                  ? "Loading slots..."
                  : `${availability.slots.length} slot${availability.slots.length === 1 ? "" : "s"} available`}
              </p>
            </div>
            <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
              After-hours start at 9 PM
            </div>
          </div>

          {availability.errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {availability.errorMessage}
            </div>
          ) : null}

          {!availability.errorMessage && !availability.isLoading ? (
            availability.slots.length > 0 ? (
              <div className="mt-5">
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availability.slots.map((slot) => {
                    const isSelected = slot.value === selectedSlotValue;

                    return (
                      <li key={slot.value}>
                        <button
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? "border-amber-300/70 bg-amber-300/12 shadow-[0_0_0_1px_rgba(252,211,77,0.12)]"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                          }`}
                          onBlur={() => markFieldTouched("timeSlot")}
                          onClick={() => {
                            setSelectedSlotValue(slot.value);
                            markFieldTouched("timeSlot");
                          }}
                          type="button"
                        >
                          <p className="text-base font-medium text-white">
                            {slot.label}
                          </p>
                          <div className="mt-2 flex flex-col items-start gap-1">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                              {slot.isAfterHours ? "After-hours" : "Standard"}
                            </p>
                            {isSelected ? (
                              <span className="text-xs font-medium uppercase tracking-[0.18em] text-amber-200">
                                Selected
                              </span>
                            ) : null}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {touchedFields.timeSlot && fieldErrors.timeSlot ? (
                  <p className="mt-3 text-sm text-red-200">
                    {fieldErrors.timeSlot}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm leading-6 text-zinc-300">
                No time slots are available for this date yet. Try another day.
              </div>
            )
          ) : null}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(245,158,11,0.10),rgba(9,9,11,0.3))] p-4">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-300/80">
            Booking Details
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {selectedSlot
              ? "Your appointment draft is ready."
              : "Choose a time slot to continue."}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {selectedSlot
              ? "Fill in the client details below and review the estimated total."
              : "The form unlocks after you pick a time on the left. This keeps the booking flow clear on mobile."}
          </p>
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
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
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

        <form className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Client name
            </span>
            <input
              aria-invalid={touchedFields.clientName && fieldErrors.clientName ? true : undefined}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedSlot}
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
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedSlot}
              onBlur={() => markFieldTouched("clientPhone")}
              onChange={(event) => updateField("clientPhone", event.target.value)}
              placeholder="604 555 0123"
              type="tel"
              value={formValues.clientPhone}
            />
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
                        ? "border-amber-300/70 bg-amber-300/12 text-white"
                        : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/20"
                    }`}
                    disabled={!selectedSlot}
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
                      selectedSlot
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
                      className="size-5 accent-amber-300"
                      disabled={!selectedSlot}
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
              Email for confirmation
              <span className="ml-2 text-zinc-500">Optional</span>
            </span>
            <input
              aria-invalid={touchedFields.clientEmail && fieldErrors.clientEmail ? true : undefined}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedSlot}
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
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedSlot}
              onBlur={() => markFieldTouched("notes")}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Anything the barber should know?"
              value={formValues.notes}
            />
            {touchedFields.notes && fieldErrors.notes ? (
              <p className="mt-2 text-sm text-red-200">{fieldErrors.notes}</p>
            ) : null}
          </label>

          <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-amber-100">
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
              <p className="mt-3 text-sm text-amber-100">
                Includes the +{formatPrice(AFTER_HOURS_SURCHARGE)} after-hours
                fee.
              </p>
            ) : null}
          </div>
        </form>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">
            {selectedSlot && isDraftReady
              ? "This booking draft is valid and ready for submission wiring."
              : "Select a slot and fill the required fields to continue."}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {selectedSlot
              ? "The next change will save this booking and handle double-booking safely."
              : "Select a slot first, then fill the form to preview the complete booking flow."}
          </p>
          <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-zinc-400">
            <p>20 minutes late: $5 fee.</p>
            <p>30 minutes late: marked as no-show.</p>
            <p>Same-day cancellation or no-show: $10 fee on next cut.</p>
            <p>Maximum 2 extra people per client.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
