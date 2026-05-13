"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SpecialAvailabilityToggleProps = {
  initialIsActive: boolean;
  specialAvailabilityId: string;
};

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

export function SpecialAvailabilityToggle({
  initialIsActive,
  specialAvailabilityId
}: SpecialAvailabilityToggleProps): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(initialIsActive);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function updateActiveState(nextIsActive: boolean): Promise<void> {
    setErrorMessage(null);
    setIsActive(nextIsActive);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/special-availability/${encodeURIComponent(specialAvailabilityId)}`,
        {
          body: JSON.stringify({ isActive: nextIsActive }),
          cache: "no-store",
          headers: {
            "Content-Type": "application/json"
          },
          method: "PATCH"
        }
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        setIsActive(!nextIsActive);
        setErrorMessage(
          readErrorMessage(payload) ??
            "Unable to update special availability right now."
        );
        return;
      }

      router.refresh();
    } catch {
      setIsActive(!nextIsActive);
      setErrorMessage("Unable to update special availability right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        aria-pressed={isActive}
        className={`inline-flex h-10 min-w-28 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isActive
            ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
            : "border-white/10 bg-white/[0.04] text-zinc-300"
        }`}
        disabled={isSubmitting}
        onClick={() => void updateActiveState(!isActive)}
        type="button"
      >
        {isSubmitting ? "Saving..." : isActive ? "Active" : "Off"}
      </button>
      {errorMessage ? (
        <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
      ) : null}
    </div>
  );
}
