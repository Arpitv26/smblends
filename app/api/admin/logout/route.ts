import { NextResponse } from "next/server";

import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE
} from "@/lib/admin/auth";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, "", {
    maxAge: 0,
    path: "/"
  });
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, "", {
    maxAge: 0,
    path: "/"
  });

  return response;
}
