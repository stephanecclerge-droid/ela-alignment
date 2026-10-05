"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupMessage(null);
    setForgotMessage(null);
    const supabase = createClient();

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setForgotMessage("If that email has an account, a reset link is on its way.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSignupMessage("Account created — log in below with the password you just set.");
      setMode("login");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Grade 10 &middot; NYS Next Generation ELA
        </p>
        <h1 className="mt-2 text-xl font-semibold text-black dark:text-zinc-50">
          {mode === "login" ? "Log in" : mode === "signup" ? "Create an account" : "Reset your password"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-800 outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-white"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-800 outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-white"
            />
          )}

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
              {error}
            </p>
          )}
          {signupMessage && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              {signupMessage}
            </p>
          )}
          {forgotMessage && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              {forgotMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        {mode === "login" && (
          <button
            onClick={() => {
              setMode("forgot");
              setError(null);
              setSignupMessage(null);
              setForgotMessage(null);
            }}
            className="mt-4 block text-sm text-zinc-600 underline hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={() => {
            setMode(mode === "signup" ? "login" : mode === "forgot" ? "login" : "signup");
            setError(null);
            setSignupMessage(null);
            setForgotMessage(null);
          }}
          className="mt-2 block text-sm text-zinc-600 underline hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          {mode === "signup"
            ? "Already have an account? Log in"
            : mode === "forgot"
              ? "Back to log in"
              : "Need an account? Sign up"}
        </button>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          <a href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-400">
            Privacy Policy
          </a>{" "}
          &middot;{" "}
          <a href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-400">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
