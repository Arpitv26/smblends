import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type BlockedDate = {
  confirmedBookingCount: number;
  createdAt: string;
  date: string;
  id: string;
  reason: string | null;
};

type BlockedDateRow = {
  created_at: string;
  date: string;
  id: string;
  reason: string | null;
};

async function getConfirmedBookingCountForDate(date: string): Promise<number> {
  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("booking_date", date)
    .eq("status", "confirmed");

  if (error) {
    console.error("Failed to count bookings for blocked date.", error);
    throw new Error("Unable to load blocked-date booking counts right now.");
  }

  return count ?? 0;
}

async function toBlockedDate(row: BlockedDateRow): Promise<BlockedDate> {
  return {
    confirmedBookingCount: await getConfirmedBookingCountForDate(row.date),
    createdAt: row.created_at,
    date: row.date,
    id: row.id,
    reason: row.reason
  };
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, date, reason, created_at")
    .order("date", { ascending: true })
    .returns<BlockedDateRow[]>();

  if (error) {
    console.error("Failed to load blocked dates.", error);
    throw new Error("Unable to load blocked dates right now.");
  }

  return Promise.all((data ?? []).map(toBlockedDate));
}
