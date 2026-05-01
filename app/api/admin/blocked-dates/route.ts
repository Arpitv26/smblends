import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { createBlockedDate } from "@/lib/admin/create-blocked-date";

const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  reason: z.string().trim().max(120, "Keep the reason under 120 characters.")
});

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeOptionalReason(reason: string): string | null {
  const trimmedReason = reason.trim();

  return trimmedReason.length > 0 ? trimmedReason : null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to block dates." },
      { status: 401 }
    );
  }

  const payload = await readJson(request);
  const parsedPayload = blockedDateSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: parsedPayload.error.issues[0]?.message ?? "Invalid blocked date." },
      { status: 400 }
    );
  }

  const result = await createBlockedDate({
    date: parsedPayload.data.date,
    reason: normalizeOptionalReason(parsedPayload.data.reason)
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "duplicate_date" ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
