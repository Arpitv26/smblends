"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function logOut(): Promise<void> {
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/logout", {
        cache: "no-store",
        method: "POST"
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isSubmitting}
      onClick={logOut}
      type="button"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
