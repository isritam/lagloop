import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  /** Used only when the player is first created (or recreated because
   * videoId changed) — never used to seek an already-running player. */
  startSeconds: number;
  onTimeUpdate: (currentTimeSeconds: number) => void;
}

// Minimal shape of the YouTube IFrame Player API surface we actually use.
interface YTPlayer {
  getCurrentTime: () => number;
  destroy: () => void;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";
const POLL_INTERVAL_MS = 500;

let iframeApiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (iframeApiLoadPromise) {
    return iframeApiLoadPromise;
  }

  iframeApiLoadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const alreadyInjected = document.querySelector(
      `script[src="${YT_IFRAME_API_SRC}"]`
    );
    if (!alreadyInjected) {
      const script = document.createElement("script");
      script.src = YT_IFRAME_API_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return iframeApiLoadPromise;
}

export default function VideoPlayer({
  videoId,
  title,
  startSeconds,
  onTimeUpdate,
}: VideoPlayerProps) {
  const containerIdRef = useRef(
    `youtube-player-${Math.random().toString(36).slice(2)}`
  );
  const playerRef = useRef<YTPlayer | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const startSecondsRef = useRef(startSeconds);

  // Keep the latest callback available to the poll loop without ever
  // re-running (and therefore never re-triggering) player creation.
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  // Create the player exactly once per videoId. Deliberately does NOT
  // depend on startSeconds (read once via ref) or on currentTimeSeconds,
  // so the player instance stays stable for the whole time this
  // component is mounted, no matter how often playback time updates.
  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player(containerIdRef.current, {
        videoId,
        playerVars: {
          start: Math.max(0, Math.floor(startSecondsRef.current)),
          rel: 0,
        },
        events: {
          onReady: () => {
            if (pollIntervalRef.current !== null) return;
            pollIntervalRef.current = window.setInterval(() => {
              const player = playerRef.current;
              if (!player) return;
              const seconds = player.getCurrentTime();
              if (typeof seconds === "number" && !Number.isNaN(seconds)) {
                onTimeUpdateRef.current(Math.floor(seconds));
              }
            }, POLL_INTERVAL_MS);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (pollIntervalRef.current !== null) {
        window.clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Intentionally only depends on videoId — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-black">
      <div id={containerIdRef.current} className="h-full w-full" title={title} />
    </div>
  );
}
