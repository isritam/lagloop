import { lesson } from "../data/lesson";
import VideoPlayer from "../components/VideoPlayer";
import TranscriptPanel from "../components/TranscriptPanel";
import ProgressIndicator from "../components/ProgressIndicator";

interface LessonPageProps {
  /** Where the player should start when it's created — 0 normally, or
   * the learner's saved confusion timestamp when returning from
   * Loop Closed. Not used for anything after the player is created. */
  startSeconds: number;
  /** The live playback position, updated continuously by VideoPlayer. */
  currentTimeSeconds: number;
  onTimeUpdate: (seconds: number) => void;
  onLostTheLink: () => void;
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function LessonPage({
  startSeconds,
  currentTimeSeconds,
  onTimeUpdate,
  onLostTheLink,
}: LessonPageProps) {
  const videoId = lesson.source.type === "youtube" ? lesson.source.videoId : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-emerald-400">
          LAGLOOP
        </span>
        <ProgressIndicator currentScreen="lesson" />
      </header>

      <div className="space-y-1">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          {lesson.subject}
        </p>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
      </div>

      {videoId ? (
        <VideoPlayer
          videoId={videoId}
          title={lesson.title}
          startSeconds={startSeconds}
          onTimeUpdate={onTimeUpdate}
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/60 text-slate-400">
          Video source not available.
        </div>
      )}

      <p className="text-sm text-slate-400">
        Current position:{" "}
        <span className="font-mono text-slate-200">
          {formatTimestamp(currentTimeSeconds)}
        </span>
      </p>

      <TranscriptPanel
        transcript={lesson.transcript}
        currentTimeSeconds={currentTimeSeconds}
      />

      <button
        type="button"
        onClick={onLostTheLink}
        className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        I lost the link
      </button>
    </div>
  );
}
