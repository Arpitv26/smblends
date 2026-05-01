import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { deleteBlockedDate } from "@/lib/admin/delete-blocked-date";

const routeParamsSchema = z.object({
  blockedDateId: z.string().uuid()
});

type RouteContext = {
  params: {
    blockedDateId: string;
  };
};

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to remove blocked dates." },
      { status: 401 }
    );
  }

  const parsedParams = routeParamsSchema.safeParse(context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid blocked date selected." },
      { status: 400 }
    );
  }

  const result = await deleteBlockedDate(parsedParams.data.blockedDateId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "not_found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
