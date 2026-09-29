import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StandardsTool from "./StandardsTool";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <StandardsTool userEmail={user.email ?? ""} />;
}
