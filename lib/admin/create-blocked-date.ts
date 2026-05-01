import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type CreateBlockedDateInput = {
  date: string;
  reason: string | null;
};

export type CreateBlockedDateResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      reason: "database_error" | "duplicate_date";
    };

function isDuplicateDateError(errorCode: string | undefined): boolean {
  return errorCode === "23505";
}

export async function createBlockedDate({
  date,
  reason
}: CreateBlockedDateInput): Promise<CreateBlockedDateResult> {
  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase.from("blocked_dates").insert({
    date,
    reason
  });

  if (error) {
    if (isDuplicateDateError(error.code)) {
      return {
        message: "That date is already blocked.",
        ok: false,
        reason: "duplicate_date"
      };
    }

    console.error("Failed to create blocked date.", error);

    return {
      message: "Unable to block this date right now.",
      ok: false,
      reason: "database_error"
    };
  }

  return { ok: true };
}
