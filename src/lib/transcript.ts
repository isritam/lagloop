import type { TranscriptSegment } from "../types";

export interface TranscriptContext {
  before: TranscriptSegment[];
  current: TranscriptSegment | null;
  after: TranscriptSegment[];
}

/**
 * getTranscriptContext
 *
 * Pure helper — no React, no side effects. Given the full transcript
 * (assumed sorted ascending by startSeconds) and a timestamp, returns
 * the segment active at that timestamp plus a window of segments
 * before and after it. Used to build the context sent to the AI layer;
 * kept separate from any component so it stays independently testable.
 */
export function getTranscriptContext(
  transcript: TranscriptSegment[],
  currentTimeSeconds: number,
  windowBeforeSeconds = 45,
  windowAfterSeconds = 45
): TranscriptContext {
  let currentIndex = -1;

  for (let i = 0; i < transcript.length; i++) {
    if (transcript[i].startSeconds <= currentTimeSeconds) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = currentIndex >= 0 ? transcript[currentIndex] : null;

  const before = transcript.filter(
    (segment) =>
      segment.startSeconds < currentTimeSeconds &&
      segment.startSeconds >= currentTimeSeconds - windowBeforeSeconds &&
      segment !== current
  );

  const after = transcript.filter(
    (segment) =>
      segment.startSeconds > currentTimeSeconds &&
      segment.startSeconds <= currentTimeSeconds + windowAfterSeconds
  );

  return { before, current, after };
}

/**
 * Flattens a TranscriptContext into a single block of plain text,
 * in chronological order, suitable for dropping into an AI prompt.
 */
export function formatTranscriptContextAsText(
  context: TranscriptContext
): string {
  const segments = [
    ...context.before,
    ...(context.current ? [context.current] : []),
    ...context.after,
  ];

  return segments.map((segment) => segment.text).join(" ");
}
