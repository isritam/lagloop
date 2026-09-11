import type { TranscriptSegment } from "../types";

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  currentTimeSeconds: number;
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Selects the transcript segment active at currentTimeSeconds (the last
// segment whose startSeconds is at or before the current time), plus the
// next segment for a little forward context. The full transcript is
// never rendered at once.
function getRelevantSegments(
  transcript: TranscriptSegment[],
  currentTimeSeconds: number
): { current: TranscriptSegment | null; next: TranscriptSegment | null } {
  let currentIndex = -1;

  for (let i = 0; i < transcript.length; i++) {
    if (transcript[i].startSeconds <= currentTimeSeconds) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = currentIndex >= 0 ? transcript[currentIndex] : null;
  const next =
    currentIndex >= 0 && currentIndex + 1 < transcript.length
      ? transcript[currentIndex + 1]
      : null;

  return { current, next };
}

export default function TranscriptPanel({
  transcript,
  currentTimeSeconds,
}: TranscriptPanelProps) {
  const { current, next } = getRelevantSegments(transcript, currentTimeSeconds);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Transcript
      </p>

      {current ? (
        <div className="mt-2 space-y-2">
          <p className="text-lg leading-relaxed text-slate-100">
            <span className="mr-2 font-mono text-sm text-emerald-400">
              {formatTimestamp(current.startSeconds)}
            </span>
            "{current.text}"
          </p>
          {next && (
            <p className="text-sm leading-relaxed text-slate-400">
              <span className="mr-2 font-mono text-xs text-slate-500">
                {formatTimestamp(next.startSeconds)}
              </span>
              "{next.text}"
            </p>
          )}
        </div>
      ) : (
        <p className="mt-2 text-slate-400">
          No transcript available for this moment.
        </p>
      )}
    </div>
  );
}
