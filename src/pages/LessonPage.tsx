import { parallelCircuitsLesson } from '../data/lesson'

type LessonPageProps = {
  onLostLink: () => void
}

export default function LessonPage({ onLostLink }: LessonPageProps) {
  const lesson = parallelCircuitsLesson

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium tracking-widest text-cyan-400">
            LAGLOOP
          </p>

          <h1 className="text-3xl font-bold">
            {lesson.title}
          </h1>

          <p className="mt-2 text-slate-400">
            {lesson.subtitle}
          </p>
        </header>

        {/* Timeline */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex justify-between text-xs text-slate-500">
            <span>00:00</span>
            <span>{lesson.duration}</span>
          </div>

          <div className="relative h-2 rounded-full bg-slate-700">
            <div className="h-2 w-[39%] rounded-full bg-cyan-500" />

            <div className="absolute left-[39%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-900 bg-cyan-400" />
          </div>

          <p className="mt-4 text-sm text-cyan-400">
            {lesson.timestamp}
          </p>
        </section>

        {/* Transcript */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transcript
          </p>

          <p className="text-lg leading-relaxed text-slate-200">
            {lesson.transcript}
          </p>
        </section>

        {/* Circuit Diagram */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Circuit
          </p>

          <div className="flex items-center justify-center">
            <div className="flex w-full max-w-md items-center gap-4">

              <div className="h-12 w-12 rounded-full border-2 border-cyan-400 flex items-center justify-center text-xs">
                +
              </div>

              <div className="h-px flex-1 bg-slate-600" />

              <div className="flex flex-col gap-6">
                <div className="h-10 w-24 rounded-lg border-2 border-slate-500 flex items-center justify-center">
                  2Ω
                </div>

                <div className="h-10 w-24 rounded-lg border-2 border-slate-500 flex items-center justify-center">
                  6Ω
                </div>
              </div>

              <div className="h-px flex-1 bg-slate-600" />

              <div className="h-12 w-12 rounded-full border-2 border-cyan-400 flex items-center justify-center text-xs">
                −
              </div>

            </div>
          </div>
        </section>

        {/* Lost Link */}
        <button
          onClick={onLostLink}
          className="w-full rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          I lost the link
        </button>

      </div>
    </main>
  )
}