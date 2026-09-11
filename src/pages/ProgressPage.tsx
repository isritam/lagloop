interface ProgressPageProps {
  lessonProgress: Record<string, number>;
  lessonsCompleted: number;
  linksRecovered: number;
  retrievals: number;
  loopBalance: number;
  streak: number;
  lessonTitles: Record<string, string>;
  onHome: () => void;
  onLearn: () => void;
}

export default function ProgressPage({
  lessonProgress,
  lessonsCompleted,
  linksRecovered,
  retrievals,
  loopBalance,
  streak,
  lessonTitles,
  onHome,
  onLearn,
}: ProgressPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={onHome}
            className="cursor-pointer text-xl font-black tracking-tight text-emerald-400"
          >
            LAGLOOP
          </button>

          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onHome}
              className="cursor-pointer rounded-lg px-3 py-2 font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Home
            </button>

            <button
              onClick={onLearn}
              className="cursor-pointer rounded-lg px-3 py-2 font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Learn
            </button>

            <button className="cursor-pointer rounded-lg bg-slate-800 px-3 py-2 font-medium text-white">
              Progress
            </button>

            <div className="ml-2 rounded-lg px-3 py-2 font-semibold text-white">
              ◉ {loopBalance} LOOP
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Progress
          </p>

          <h1 className="text-4xl font-black tracking-tight">
            Your learning loop.
          </h1>

          <p className="mt-3 text-slate-400">
            See how much understanding you've recovered.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Current streak" value={`🔥 ${streak}`} />
          <Stat label="Lessons completed" value={lessonsCompleted} />
          <Stat label="Links recovered" value={linksRecovered} />
          <Stat label="Retrievals" value={retrievals} />
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Lesson progress</h2>

            <span className="font-semibold text-emerald-400">
              ◉ {loopBalance} LOOP
            </span>
          </div>

          <div className="space-y-6">
            {Object.entries(lessonProgress).map(([lessonId, percent]) => (
              <div key={lessonId}>
                <div className="mb-2 flex justify-between gap-4">
                  <span className="truncate text-sm font-medium">
                    {lessonTitles[lessonId] ?? "Lesson"}
                  </span>

                  <span className="text-sm text-slate-500">
                    {percent}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}