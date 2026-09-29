"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STANDARDS, STRANDS, type Standard } from "@/lib/standards";
import { createClient } from "@/lib/supabase/client";

type AnalysisResult = {
  alignmentLevel: "strong" | "partial" | "weak";
  summary: string;
  gaps: string[];
  recommendations: string[];
  studentPlainLanguageNote: string;
};

const ALIGNMENT_STYLES: Record<AnalysisResult["alignmentLevel"], string> = {
  strong: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  weak: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function StandardsTool({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [strand, setStrand] = useState<(typeof STRANDS)[number]>("Writing");
  const [selected, setSelected] = useState<Standard | null>(null);
  const [lessonText, setLessonText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const standardsForStrand = STANDARDS.filter((s) => s.strand === strand);

  async function handleAnalyze() {
    if (!selected || !lessonText.trim()) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standardCode: selected.code, lessonText }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setResult(await res.json());
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-6 flex items-center justify-between text-sm text-zinc-500">
          <span>{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="font-medium text-zinc-600 underline hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Sign out
          </button>
        </div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Grade 10 &middot; NYS Next Generation ELA
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-black dark:text-zinc-50">
          Standards Lookup
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Pick a strand, then a standard, to see what it actually demands.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {STRANDS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStrand(s);
                setSelected(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                strand === s
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {standardsForStrand.length === 0 && (
            <p className="rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-500 dark:bg-zinc-900">
              No standards loaded for {strand} yet — Writing is the only strand
              with real data so far.
            </p>
          )}
          {standardsForStrand.map((s) => (
            <button
              key={s.code}
              onClick={() => setSelected(s)}
              className={`rounded-lg px-4 py-3 text-left text-sm ring-1 transition-colors ${
                selected?.code === s.code
                  ? "bg-black text-white ring-black dark:bg-white dark:text-black"
                  : "bg-white text-zinc-800 ring-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700"
              }`}
            >
              <span className="font-mono font-semibold">{s.code}</span>
              {!s.verified && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  needs review
                </span>
              )}
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-8 flex flex-col gap-6 rounded-xl bg-white p-6 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            {!selected.verified && (
              <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                This wording was only cross-checked via search, not confirmed
                on the official page directly — worth a teacher gut-check
                before relying on it.
              </p>
            )}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Official standard text
              </h2>
              <p className="mt-1 text-zinc-800 dark:text-zinc-200">
                {selected.officialText}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                What this actually demands (for you)
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-800 dark:text-zinc-200">
                {selected.teacherBreakdown.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Plain language for students
              </h2>
              <p className="mt-1 text-zinc-800 dark:text-zinc-200">
                {selected.studentPlainLanguage}
              </p>
            </div>
          </div>
        )}

        {selected && (
          <div className="mt-8 flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Check a lesson against {selected.code}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Paste the lesson or curriculum text below.
              </p>
            </div>
            <textarea
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              rows={8}
              placeholder="Paste your lesson text here..."
              className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-800 outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-white"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !lessonText.trim()}
              className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {analyzing ? "Analyzing..." : "Analyze alignment"}
            </button>

            {analyzeError && (
              <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                {analyzeError}
              </p>
            )}

            {result && (
              <div className="mt-2 flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${ALIGNMENT_STYLES[result.alignmentLevel]}`}
                >
                  {result.alignmentLevel} alignment
                </span>
                <p className="text-zinc-800 dark:text-zinc-200">{result.summary}</p>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Gaps
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-800 dark:text-zinc-200">
                    {result.gaps.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Recommendations
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-800 dark:text-zinc-200">
                    {result.recommendations.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    For students, about this lesson
                  </h3>
                  <p className="mt-1 text-zinc-800 dark:text-zinc-200">
                    {result.studentPlainLanguageNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
