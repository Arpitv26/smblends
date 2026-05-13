import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import { deleteSpecialAvailability } from "@/lib/admin/delete-special-availability";
import { updateSpecialAvailability } from "@/lib/admin/update-special-availability";

const routeParamsSchema = z.object({
  specialAvailabilityId: z.string().uuid()
});

const updateSpecialAvailabilitySchema = z.object({
  isActive: z.boolean()
});

type RouteContext = {
  params: {
    specialAvailabilityId: string;
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
      { error: "You must be signed in to update special availability." },
      { status: 401 }
    );
  }

  const parsedParams = routeParamsSchema.safeParse(context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid special availability row selected." },
      { status: 400 }
    );
  }

  const payload = await readJson(request);
  const parsedPayload = updateSpecialAvailabilitySchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Choose whether this special availability row is active." },
      { status: 400 }
    );
  }

  const result = await updateSpecialAvailability(
    parsedParams.data.specialAvailabilityId,
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

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "You must be signed in to remove special availability." },
      { status: 401 }
    );
  }

  const parsedParams = routeParamsSchema.safeParse(context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid special availability row selected." },
      { status: 400 }
    );
  }

  const result = await deleteSpecialAvailability(
    parsedParams.data.specialAvailabilityId
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.reason === "not_found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
