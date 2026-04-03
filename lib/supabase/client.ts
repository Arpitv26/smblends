import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createBrowserSupabaseClient(): SupabaseClient {
  const { publishableKey, url } = getSupabasePublicEnv();

  return createClient(url, publishableKey);
}
