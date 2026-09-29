import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used inside Server Components, Server Actions, and API routes — runs only
// on the server. Must be created fresh per-request (never reused/cached)
// because it's tied to that request's cookies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — safe to ignore since
            // the proxy (below) refreshes the session on every request anyway.
          }
        },
      },
    },
  );
}
