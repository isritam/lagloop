import ProgressIndicator from "../components/ProgressIndicator";

interface LoopClosedPageProps {
  onReturnToLesson: () => void;
}

export default function LoopClosedPage({
  onReturnToLesson,
}: LoopClosedPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <header className="flex w-full items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-emerald-400">
          LAGLOOP
        </span>
        <ProgressIndicator currentScreen="closed" />
      </header>

      <div className="flex flex-col items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-400"
        >
          ✓
        </span>
        <h1 className="text-3xl font-bold text-white">Loop closed</h1>
        <p className="max-w-sm text-base leading-relaxed text-slate-300">
          You recovered the missing connection.
        </p>
      </div>

      <button
        type="button"
        onClick={onReturnToLesson}
        className="rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Return to lesson
      </button>
    </div>
  );
}
