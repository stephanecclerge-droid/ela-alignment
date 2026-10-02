import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { message } = await req.json();

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Feedback can't be empty." }, { status: 400 });
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    message: message.trim(),
  });

  if (error) {
    console.error("Failed to save feedback:", error.message);
    return NextResponse.json({ error: "Couldn't save your feedback — try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
