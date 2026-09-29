"use client";

import { useState } from "react";
import { STANDARDS, STRANDS, type Standard } from "@/lib/standards";

export default function Home() {
  const [strand, setStrand] = useState<(typeof STRANDS)[number]>("Writing");
  const [selected, setSelected] = useState<Standard | null>(null);

  const standardsForStrand = STANDARDS.filter((s) => s.strand === strand);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
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
      </main>
    </div>
  );
}
