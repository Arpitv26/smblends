import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const ADMIN_ACCESS_TOKEN_COOKIE = "smblends-admin-access-token";
export const ADMIN_REFRESH_TOKEN_COOKIE = "smblends-admin-refresh-token";

const FALLBACK_ADMIN_EMAIL = "sanchitmehta51@gmail.com";

export type AdminSession = {
  email: string;
  userId: string;
};

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? FALLBACK_ADMIN_EMAIL).trim().toLowerCase();
}

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === getAdminEmail();
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const accessToken = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  const userEmail = data.user?.email;

  if (error || !data.user || !userEmail || !isAdminEmail(userEmail)) {
    return null;
  }

  return {
    email: userEmail,
    userId: data.user.id
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
