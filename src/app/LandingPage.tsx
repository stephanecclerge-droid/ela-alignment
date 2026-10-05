import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Grade 10 &middot; NYS Next Generation ELA &middot; Writing &amp; Reading
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-black dark:text-zinc-50">
          Know what the standard actually demands — before you teach the lesson.
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          A standards-first tool for NYS Common Core ELA teachers. Pick a
          standard, see what it really asks for in plain language, then check
          whether a lesson you have actually lines up with it.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          <div className="rounded-xl bg-white p-5 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="text-sm font-semibold text-black dark:text-zinc-50">
              1. Pick a standard
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              See the official text, a plain-language breakdown of what it
              demands, and a version you can share with students.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="text-sm font-semibold text-black dark:text-zinc-50">
              2. Paste or upload a lesson
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Drop in lesson or curriculum text, or upload a PDF, Word doc,
              or plain text file.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="text-sm font-semibold text-black dark:text-zinc-50">
              3. See where it lines up — and where it doesn't
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Get a specific read on the alignment, concrete gaps, and ideas
              to strengthen it — grounded in your actual lesson, not generic
              advice.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-zinc-100 p-5 dark:bg-zinc-900">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            A supplement, not a replacement
          </h2>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            This tool doesn&apos;t grade your teaching or write your lessons
            for you. It&apos;s built to deepen your own read of the standard
            so you can make the call — you stay the expert in the room.
          </p>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            The bigger picture
          </p>
          <h2 className="mt-2 text-xl font-semibold text-black dark:text-zinc-50">
            Starting narrow on purpose. Built to grow far beyond it.
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This tool begins with 10th grade NYS Common Core ELA, proven
            with real teachers before expanding further — more grades,
            including elementary reading and writing, are next. The longer
            goal: connect this same plain-language clarity to the full
            instructional loop — standards, curriculum, lessons, student
            work, and mastery — not just one lesson at a time.
          </p>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Log in or sign up
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-zinc-600 underline hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}
