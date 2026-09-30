export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: September 2026</p>

        <div className="mt-8 flex flex-col gap-6 text-zinc-800 dark:text-zinc-200">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              What we collect
            </h2>
            <p className="mt-2">
              When you create an account, we collect your email address. When
              you use the tool, we collect the lesson or curriculum text you
              submit, along with the analysis generated for it, and save it to
              your account so you can find it again later.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Please don&apos;t submit student-identifying information
            </h2>
            <p className="mt-2">
              This tool is meant for lesson and curriculum text only. Please
              do not paste real student names, student work samples, or other
              information that could identify a specific student. This
              product is not directed at children, does not knowingly collect
              information from students, and does not have student accounts —
              only teachers create accounts here.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              How your lesson text is processed
            </h2>
            <p className="mt-2">
              To generate an alignment analysis, the lesson text you submit is
              sent to Anthropic (the company behind Claude, the AI model this
              tool uses) for processing. Your account data and saved analyses
              are stored with Supabase, our database provider. We don&apos;t
              sell your data, and we don&apos;t share it with anyone beyond
              these two service providers, who process it only to help
              deliver this tool to you.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              How your data is protected
            </h2>
            <p className="mt-2">
              Your saved lessons and analyses are only ever visible to your
              own account — enforced at the database level, not just by the
              app&apos;s design, so it isn&apos;t possible for one teacher to
              see another teacher&apos;s saved work.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              How long we keep it
            </h2>
            <p className="mt-2">
              We keep your saved analyses until you delete your account or
              ask us to remove them. If you&apos;d like your data deleted,
              contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Your rights
            </h2>
            <p className="mt-2">
              You can request a copy of your data, ask us to delete your
              account and everything tied to it, or ask questions about how
              your information is handled, at any time.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Changes to this policy
            </h2>
            <p className="mt-2">
              If this policy changes in a way that matters, we&apos;ll update
              this page and change the date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Contact
            </h2>
            <p className="mt-2">
              Questions about this policy or your data can be sent to the
              email address associated with this project.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
