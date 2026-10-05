import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Password-reset (and any future magic-link) emails point here with a
// one-time `code` — this exchanges it for a real session before sending
// the teacher on to wherever they actually need to land.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
