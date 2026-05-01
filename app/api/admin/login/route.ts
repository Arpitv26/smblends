import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  isAdminEmail
} from "@/lib/admin/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const adminLoginSchema = z.object({
  email: z.string().email("Enter the admin email address."),
  password: z.string().min(1, "Enter the admin password.")
});

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await readJson(request);
  const parsedLogin = adminLoginSchema.safeParse(payload);

  if (!parsedLogin.success) {
    return NextResponse.json(
      { error: parsedLogin.error.issues[0]?.message ?? "Invalid login details." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(
    parsedLogin.data
  );
  const userEmail = data.user?.email;

  if (error || !data.session || !userEmail) {
    return NextResponse.json(
      { error: "Login failed. Check your email and password." },
      { status: 401 }
    );
  }

  if (!isAdminEmail(userEmail)) {
    return NextResponse.json(
      { error: "This account is not allowed to access the admin dashboard." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, data.session.access_token, {
    httpOnly: true,
    maxAge: data.session.expires_in,
    path: "/",
    sameSite: "lax",
    secure
  });
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure
  });

  return response;
}
