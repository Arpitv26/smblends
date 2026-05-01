"use client";

import { type FormEvent, useState } from "react";
import { CalendarX } from "lucide-react";
import { useRouter } from "next/navigation";

type BlockedDateFormProps = {
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

export function BlockedDateForm({
  initialDate
}: BlockedDateFormProps): JSX.Element {
  const router = useRouter();
  const [date, setDate] = useState<string>(initialDate);
  const [reason, setReason] = useState<string>("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    errorMessage: null,
    status: "idle"
  });

  async function submitBlockedDate(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setSubmissionState({
      errorMessage: null,
      status: "submitting"
    });

    try {
      const response = await fetch("/api/admin/blocked-dates", {
        body: JSON.stringify({ date, reason }),
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
            readErrorMessage(payload) ?? "Unable to block this date right now.",
          status: "error"
        });
        return;
      }

      setReason("");
      setSubmissionState({
        errorMessage: null,
        status: "idle"
      });
      router.refresh();
    } catch {
      setSubmissionState({
        errorMessage: "Unable to block this date right now.",
        status: "error"
      });
    }
  }

  const isSubmitting = submissionState.status === "submitting";

  return (
    <form
      className="grid gap-4 rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:items-end"
      onSubmit={submitBlockedDate}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Date
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          value={date}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Reason
        </span>
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-200/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          maxLength={120}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Vacation, exam, personal day"
          type="text"
          value={reason}
        />
      </label>

      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <CalendarX className="size-4" aria-hidden="true" />
        {isSubmitting ? "Blocking..." : "Block date"}
      </button>

      {submissionState.status === "error" ? (
        <p className="text-sm leading-6 text-red-200 sm:col-span-3">
          {submissionState.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
