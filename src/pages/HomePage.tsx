import type { Lesson } from "../types";

interface HomePageProps {
  username: string;
  progress: number;
  streak: number;
  linksRecovered: number;
  loopBalance: number;

  lessons: Lesson[];
  lessonProgress: Record<string, number>;
  onOpenLesson: (lessonId: string) => void;

  onStartLesson: () => void;
  onLearn: () => void;
  onProgress: () => void;
  onLogout: () => Promise<void>;
}

function getThumbnailUrl(
  lesson: Lesson
): string | null {
  if (lesson.source.type !== "youtube") {
    return null;
  }

  return `https://img.youtube.com/vi/${lesson.source.videoId}/hqdefault.jpg`;
}

export default function HomePage({
  username,
  progress,
  streak,
  linksRecovered,
  loopBalance,
  lessons,
  lessonProgress,
  onOpenLesson,
  onStartLesson,
  onLearn,
  onProgress,
  onLogout,
}: HomePageProps) {
  const featuredLesson =
    lessons.find(
      (item) =>
        item.id === "matrix-multiplication"
    ) ?? lessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Navbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <button
            type="button"
            onClick={onStartLesson}
            className="cursor-pointer text-xl font-black tracking-wide text-emerald-400 transition hover:text-emerald-300"
          >
            LAGLOOP
          </button>

          <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white"
            >
              Home
            </button>

            <button
              type="button"
              onClick={onLearn}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              Learn
            </button>

            <button
              type="button"
              onClick={onProgress}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              Progress
            </button>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-400">
              ◉ {loopBalance} LOOP
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:text-white"
            >
              Log out
            </button>
          </nav>
        </header>

        {/* Main */}
        <main className="py-10">

          {/* Welcome */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Hey, {username}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Keep learning, recover the connections you miss,
              and close more loops.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStartLesson}
                className="cursor-pointer rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Continue learning →
              </button>

              <button
                type="button"
                onClick={onLearn}
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-white transition hover:border-slate-500"
              >
                Browse lessons
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Current lesson
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {progress}%
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Links recovered
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {linksRecovered}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Conceptual connections restored
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Learning streak
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {streak}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Days in a row
              </p>
            </div>
          </section>

          {/* Featured lesson */}
          {featuredLesson && (
            <section className="mt-12">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                  Continue
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {featuredLesson.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenLesson(
                    featuredLesson.id
                  )
                }
                className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-slate-600"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-800">
                  {getThumbnailUrl(
                    featuredLesson
                  ) ? (
                    <img
                      src={getThumbnailUrl(
                        featuredLesson
                      ) ?? ""}
                      alt={featuredLesson.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-slate-500">
                        Thumbnail unavailable
                      </span>
                    </div>
                  )}

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-slate-900 shadow-xl transition group-hover:scale-110">
                      ▶
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                    {featuredLesson.subject}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {featuredLesson.title}
                  </h3>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{
                        width: `${
                          lessonProgress[
                            featuredLesson.id
                          ] ?? 0
                        }%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {(lessonProgress[
                      featuredLesson.id
                    ] ?? 0) > 0
                      ? `${
                          lessonProgress[
                            featuredLesson.id
                          ]
                        }% watched`
                      : "Start watching →"}
                  </p>
                </div>
              </button>
            </section>
          )}

          {/* More lessons */}
          <section className="mt-12">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Learn
              </p>

              <h2 className="mt-1 text-2xl font-black">
                More lessons
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep building your understanding.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {lessons.map((item) => {
                const percent =
                  lessonProgress[item.id] ?? 0;

                const thumbnail =
                  getThumbnailUrl(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onOpenLesson(item.id)
                    }
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-slate-600"
                  >
                    {/* YouTube thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-800">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-slate-500">
                            Thumbnail unavailable
                          </span>
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/5 transition group-hover:bg-black/20" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-slate-900 shadow-xl transition group-hover:scale-110">
                          ▶
                        </div>
                      </div>
                    </div>

                    {/* Card information */}
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        {item.subject}
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-white">
                        {item.title}
                      </h3>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-400 transition-all"
                          style={{
                            width: `${percent}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        {percent > 0
                          ? `${percent}% watched`
                          : "Start watching →"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}