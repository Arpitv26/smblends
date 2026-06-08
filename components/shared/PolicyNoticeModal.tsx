"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";

const POLICY_NOTICE_STORAGE_KEY = "smblends-policy-notice-dismissed";

const POLICY_ITEMS = [
  "Text Sanchit at 778-681-7694 for the appointment address.",
  "Pay by cash or e-transfer before or after the haircut.",
  "20 minutes late: $5 fee.",
  "30 minutes late: appointment is marked as no-show.",
  "No-shows and same-day cancellations: $10 fee on the next cut."
] as const;

export function PolicyNoticeModal(): JSX.Element | null {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const dismissNotice = useCallback((): void => {
    window.localStorage.setItem(POLICY_NOTICE_STORAGE_KEY, "true");
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      setIsVisible(false);
      return;
    }

    const hasDismissed =
      window.localStorage.getItem(POLICY_NOTICE_STORAGE_KEY) === "true";

    setIsVisible(!hasDismissed);
  }, [isAdminRoute]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        dismissNotice();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismissNotice, isVisible]);

  if (!isVisible || isAdminRoute) {
    return null;
  }

  return (
    <div
      aria-labelledby="policy-notice-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 py-5 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
    >
      <section className="max-h-[calc(100svh-2.5rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/50 sm:w-full sm:max-w-md sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white">
            <ClipboardList className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Before Booking
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-tight text-white"
              id="policy-notice-title"
            >
              Quick Policy Check
            </h2>
          </div>
        </div>

        <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
          {POLICY_ITEMS.map((item) => (
            <li
              className="grid grid-cols-[0.375rem_1fr] items-start gap-3"
              key={item}
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-500" />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="text-center text-sm font-medium text-zinc-400 transition hover:text-white"
            href="/policy"
            onClick={dismissNotice}
          >
            Full Policy
          </Link>
          <button
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:w-auto"
            onClick={dismissNotice}
            type="button"
          >
            I Understand
          </button>
        </div>
      </section>
    </div>
  );
}
