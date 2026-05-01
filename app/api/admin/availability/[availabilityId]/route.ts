import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { updateAvailabilityWindow } from "@/lib/admin/update-availability-window";

const routeParamsSchema = z.object({
  availabilityId: z.string().uuid()
});

const updateAvailabilitySchema = z.object({
  isActive: z.boolean()
});

type RouteContext = {
  params: {
    availabilityId: string;
  };
};

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to update availability." },
      { status: 401 }
    );
  }

  const parsedParams = routeParamsSchema.safeParse(context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid availability row selected." },
      { status: 400 }
    );
  }

  const payload = await readJson(request);
  const parsedPayload = updateAvailabilitySchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Choose whether this availability row is active." },
      { status: 400 }
    );
  }

  const result = await updateAvailabilityWindow(
    parsedParams.data.availabilityId,
    parsedPayload.data.isActive
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "not_found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
