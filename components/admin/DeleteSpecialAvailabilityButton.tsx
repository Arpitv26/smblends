"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteSpecialAvailabilityButtonProps = {
  specialAvailabilityId: string;
  timeLabel: string;
};

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

export function DeleteSpecialAvailabilityButton({
  specialAvailabilityId,
  timeLabel
}: DeleteSpecialAvailabilityButtonProps): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function deleteWindow(): Promise<void> {
    const confirmed = window.confirm(
      `Remove the special availability window ${timeLabel}?`
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/special-availability/${encodeURIComponent(specialAvailabilityId)}`,
        {
          cache: "no-store",
          method: "DELETE"
        }
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        setErrorMessage(
          readErrorMessage(payload) ??
            "Unable to remove special availability right now."
        );
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Unable to remove special availability right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 text-sm font-medium text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={deleteWindow}
        type="button"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {isSubmitting ? "Removing..." : "Remove"}
      </button>
      {errorMessage ? (
        <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
      ) : null}
    </div>
  );
}
