"use client";

import { useEffect, useState, type ChangeEvent } from "react";
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

type HistoryRow = {
  id: string;
  standard_code: string;
  lesson_text: string;
  alignment_level: AnalysisResult["alignmentLevel"];
  summary: string;
  gaps: string[];
  recommendations: string[];
  student_plain_language_note: string;
  created_at: string;
};

const ALIGNMENT_STYLES: Record<AnalysisResult["alignmentLevel"], string> = {
  strong: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  weak: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

function ResultDetails({ result }: { result: AnalysisResult }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${ALIGNMENT_STYLES[result.alignmentLevel]}`}
        >
          {result.alignmentLevel} alignment
        </span>
        <span className="text-xs text-zinc-500">
          AI-generated — review before acting on it
        </span>
      </div>
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
  );
}

const GOAL_OPTIONS = [
  "Confirm I'm already aligned",
  "Find specific gaps",
  "Get ideas to strengthen it",
  "Just exploring the tool",
];

const LESSON_SOURCE_OPTIONS = [
  "I wrote it myself",
  "Given to me by my school/curriculum",
  "Found it online",
];

const CONFIDENCE_OPTIONS = ["Very confident", "Somewhat", "Not sure"];

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setSubmitted(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 rounded-xl bg-white p-4 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-black dark:text-zinc-50">
          Got feedback?
        </h3>
        <button
          onClick={() => {
            setOpen(false);
            setSubmitted(false);
            setError(null);
          }}
          className="text-zinc-400 hover:text-black dark:hover:text-white"
          aria-label="Close feedback form"
        >
          ✕
        </button>
      </div>

      {submitted ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          Thanks — this really helps.
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-zinc-500">
            Anything confusing, broken, or missing? Tell me directly.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="What's on your mind..."
            className="mt-3 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-800 outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-white"
          />
          {error && (
            <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || !message.trim()}
            className="mt-2 w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </>
      )}
    </div>
  );
}

export default function StandardsTool({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [grade, setGrade] = useState("10");
  const [strand, setStrand] = useState<(typeof STRANDS)[number]>("Writing");
  const [selected, setSelected] = useState<Standard | null>(null);
  const [lessonText, setLessonText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [lessonSource, setLessonSource] = useState<string | null>(null);
  const [confidenceBefore, setConfidenceBefore] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const standardsForStrand = STANDARDS.filter((s) => s.strand === strand);

  async function loadHistory() {
    setHistoryLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false });
    setHistory((data as HistoryRow[]) ?? []);
    setHistoryLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleAnalyze() {
    if (!selected || !lessonText.trim()) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          standardCode: selected.code,
          lessonText,
          goal,
          lessonSource,
          confidenceBefore,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setResult(await res.json());
      loadHistory();
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Couldn't read that file.");
      }
      setLessonText(body.text);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setUploading(false);
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
        <div className="flex items-center gap-2">
          <label htmlFor="grade" className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Grade
          </label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm font-medium text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="9" disabled>
              9th grade (coming soon)
            </option>
            <option value="10">10th grade</option>
            <option value="11" disabled>
              11th grade (coming soon)
            </option>
            <option value="12" disabled>
              12th grade (coming soon)
            </option>
          </select>
          <span className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            &middot; NYS Next Generation ELA
          </span>
        </div>
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
              No standards loaded for {strand} yet — try Writing or Reading,
              which have real data so far.
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
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                Please don&apos;t include real student names or identifying
                student information — lesson and curriculum text only.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-300 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700">
                {uploading ? "Reading file..." : "Upload a file instead"}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-zinc-500">PDF, Word (.docx), or .txt</span>
            </div>
            {uploadError && (
              <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                {uploadError}
              </p>
            )}

            <textarea
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              rows={8}
              placeholder="Paste your lesson text here, or upload a file above..."
              className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-800 outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-white"
            />

            <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  What&apos;s your main goal in checking this lesson?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GOAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setGoal(opt)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        goal === opt
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Where did this lesson come from?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LESSON_SOURCE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLessonSource(opt)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        lessonSource === opt
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  How confident were you that this lesson already aligned,
                  before checking?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONFIDENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setConfidenceBefore(opt)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        confidenceBefore === opt
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
              <div className="mt-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <ResultDetails result={result} />
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Your saved checks
          </h2>
          {historyLoading && (
            <p className="mt-2 text-sm text-zinc-500">Loading...</p>
          )}
          {!historyLoading && history.length === 0 && (
            <p className="mt-2 text-sm text-zinc-500">
              Nothing saved yet — run a check above and it'll show up here.
            </p>
          )}
          <div className="mt-3 flex flex-col gap-2">
            {history.map((row) => (
              <div
                key={row.id}
                className="rounded-lg bg-white ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === row.id ? null : row.id)
                  }
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {row.standard_code}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ALIGNMENT_STYLES[row.alignment_level]}`}
                    >
                      {row.alignment_level}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                </button>
                {expandedId === row.id && (
                  <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                    <ResultDetails
                      result={{
                        alignmentLevel: row.alignment_level,
                        summary: row.summary,
                        gaps: row.gaps,
                        recommendations: row.recommendations,
                        studentPlainLanguageNote: row.student_plain_language_note,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <FeedbackWidget />
    </div>
  );
}
