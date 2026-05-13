"use client";

import { type FormEvent, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";

type SpecialAvailabilityFormProps = {
  initialDate: string;
};

type SubmissionState =
  | {
      errorMessage: string | null;
      status: "idle";
    }
  | {
      errorMessage: null;
      status: "submitting";
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

export function SpecialAvailabilityForm({
  initialDate
}: SpecialAvailabilityFormProps): JSX.Element {
  const router = useRouter();
  const [date, setDate] = useState<string>(initialDate);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [label, setLabel] = useState<string>("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    errorMessage: null,
    status: "idle"
  });

  async function submitSpecialAvailability(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setSubmissionState({
      errorMessage: null,
      status: "submitting"
    });

    try {
      const response = await fetch("/api/admin/special-availability", {
        body: JSON.stringify({
          date,
          endTime,
          label,
          slotMinutes: 60,
          startTime
        }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setSubmissionState({
          errorMessage:
            readErrorMessage(payload) ??
            "Unable to add special availability right now.",
          status: "error"
        });
        return;
      }

      setLabel("");
      setSubmissionState({
        errorMessage: null,
        status: "idle"
      });
      router.refresh();
    } catch {
      setSubmissionState({
        errorMessage: "Unable to add special availability right now.",
        status: "error"
      });
    }
  }

  const isSubmitting = submissionState.status === "submitting";

  return (
    <form
      className="grid gap-4 rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4 lg:grid-cols-[minmax(0,11rem)_minmax(0,9rem)_minmax(0,9rem)_minmax(0,1fr)_auto] lg:items-end"
      onSubmit={submitSpecialAvailability}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Date
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          value={date}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Start
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setStartTime(event.target.value)}
          type="time"
          value={startTime}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          End
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setEndTime(event.target.value)}
          type="time"
          value={endTime}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Label
          <span className="ml-2 text-zinc-500">Optional</span>
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Long weekend, no school"
          type="text"
          value={label}
        />
      </label>

      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <CalendarPlus className="size-4" aria-hidden="true" />
        {isSubmitting ? "Adding..." : "Add"}
      </button>

      {submissionState.status === "error" ? (
        <p className="text-sm leading-6 text-red-200 lg:col-span-5">
          {submissionState.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
