import type { Lesson } from "../types";

interface LearnPageProps {
  lessons: Lesson[];
  progress: Record<string, number>;
  onOpenLesson: (lessonId: string) => void;
  onHome: () => void;
  onProgress: () => void;
}

export default function LearnPage({
  lessons,
  progress,
  onOpenLesson,
  onHome,
  onProgress,
}: LearnPageProps) {
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

            <button className="cursor-pointer rounded-lg bg-slate-800 px-3 py-2 font-medium text-white">
              Learn
            </button>

            <button
              onClick={onProgress}
              className="cursor-pointer rounded-lg px-3 py-2 font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Progress
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Learn
          </p>

          <h1 className="text-4xl font-black tracking-tight">
            Keep building your understanding.
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Choose a lesson and LagLoop will help you recover when the
            connection gets lost.
          </p>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold">Your lessons</h2>

          <div className="grid gap-5 md:grid-cols-2">
            {lessons.map((lesson) => {
              const percent = progress[lesson.id] ?? 0;

              return (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-emerald-400">
                        {lesson.subject}
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        {lesson.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
  {lesson.subject}
</p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
  YouTube
</span>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenLesson(lesson.id)}
                    className="mt-6 w-full cursor-pointer rounded-lg bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                  >
                    {percent > 0 ? "Continue lesson →" : "Start lesson →"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}