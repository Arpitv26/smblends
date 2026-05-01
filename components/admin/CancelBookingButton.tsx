"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";

type CancelBookingButtonProps = {
  bookingId: string;
  clientName: string;
};

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

export function CancelBookingButton({
  bookingId,
  clientName
}: CancelBookingButtonProps): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function cancelClientBooking(): Promise<void> {
    const confirmed = window.confirm(
      `Cancel ${clientName}'s booking? This keeps the record but reopens the time slot.`
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(bookingId)}/cancel`,
        {
          cache: "no-store",
          method: "POST"
        }
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        setErrorMessage(
          readErrorMessage(payload) ??
            "Unable to cancel this booking right now."
        );
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Unable to cancel this booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={cancelClientBooking}
        type="button"
      >
        <Ban className="size-4" aria-hidden="true" />
        {isSubmitting ? "Cancelling..." : "Cancel booking"}
      </button>
      {errorMessage ? (
        <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
      ) : null}
    </div>
  );
}
