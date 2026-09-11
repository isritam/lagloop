import type { Lesson } from "../types";
import VideoPlayer from "../components/VideoPlayer";
import TranscriptPanel from "../components/TranscriptPanel";
import ProgressIndicator from "../components/ProgressIndicator";

interface LessonPageProps {
  lesson: Lesson;
  startSeconds: number;
  currentTimeSeconds: number;
  onTimeUpdate: (seconds: number) => void;
  onLostTheLink: () => void;
  onHome: () => void;
}

function formatTimestamp(
  seconds: number
): string {
  const minutes = Math.floor(
    seconds / 60
  );

  const remainingSeconds =
    Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function LessonPage({
  lesson,
  startSeconds,
  currentTimeSeconds,
  onTimeUpdate,
  onLostTheLink,
  onHome,
}: LessonPageProps) {
  const videoId =
    lesson.source.type === "youtube"
      ? lesson.source.videoId
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onHome}
            className="cursor-pointer text-lg font-bold tracking-wide text-emerald-400 transition hover:text-emerald-300"
          >
            LAGLOOP
          </button>

          <ProgressIndicator
            currentScreen="lesson"
          />
        </header>

        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            {lesson.subject}
          </p>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {lesson.title}
          </h1>
        </div>

        {videoId ? (
          <VideoPlayer
            videoId={videoId}
            title={lesson.title}
            startSeconds={startSeconds}
            onTimeUpdate={
              onTimeUpdate
            }
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/60 text-slate-400">
            Video source not available.
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Current position
          </span>

          <span className="font-mono text-slate-200">
            {formatTimestamp(
              currentTimeSeconds
            )}
          </span>
        </div>

        <TranscriptPanel
          transcript={
            lesson.transcript
          }
          currentTimeSeconds={
            currentTimeSeconds
          }
        />

        <button
          type="button"
          onClick={
            onLostTheLink
          }
          className="w-full cursor-pointer rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          I lost the link
        </button>
      </div>
    </div>
  );
}