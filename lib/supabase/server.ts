import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv, getSupabaseServerEnv } from "@/lib/supabase/env";

export function createServerSupabaseClient(): SupabaseClient {
  const { publishableKey, url } = getSupabasePublicEnv();

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function createServiceRoleSupabaseClient(): SupabaseClient {
  const { serviceRoleKey, url } = getSupabaseServerEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
