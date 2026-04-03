type SupabasePublicEnv = {
  publishableKey: string;
  url: string;
};

type SupabaseServerEnv = SupabasePublicEnv & {
  serviceRoleKey: string;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    publishableKey: requireEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
      publishableKey
    ),
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)
  };
}

export function getSupabaseServerEnv(): SupabaseServerEnv {
  const publicEnv = getSupabasePublicEnv();

  return {
    ...publicEnv,
    serviceRoleKey: requireEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  };
}
