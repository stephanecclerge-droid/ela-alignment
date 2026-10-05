import { createClient } from "@/lib/supabase/server";
import StandardsTool from "./StandardsTool";
import LandingPage from "./LandingPage";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <StandardsTool userEmail={user.email ?? ""} />;
}
