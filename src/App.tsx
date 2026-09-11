import { useRef, useState } from "react";
import type { AIRecoveryContent, Language, Screen } from "./types";
import { lesson } from "./data/lesson";
import { askLearningAssistant, AIRecoveryError } from "./lib/ai";
import LessonPage from "./pages/LessonPage";
import SignalPage from "./pages/SignalPage";
import RecoveryPage from "./pages/RecoveryPage";
import LoopClosedPage from "./pages/LoopClosedPage";

export default function App() {
  const [screen, setScreen] = useState<Screen>("lesson");

  // Where the video player should start when it's (re)created.
  const [lessonStartSeconds, setLessonStartSeconds] = useState(0);
  // Live playback position, updated continuously while on the lesson screen.
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  // Snapshot of currentTimeSeconds taken the moment "I lost the link" is clicked.
  const [confusionTimestampSeconds, setConfusionTimestampSeconds] =
    useState<number | null>(null);

  const [confusionText, setConfusionText] = useState("");
  const [language, setLanguage] = useState<Language>("english");

  const [aiRecoveryContent, setAiRecoveryContent] =
    useState<AIRecoveryContent | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Belt-and-braces guard against duplicate submissions, on top of the
  // isLoadingAI-based disabling already done in SignalPage.
  const isSubmittingRef = useRef(false);

  function handleTimeUpdate(seconds: number) {
    setCurrentTimeSeconds(seconds);
  }

  function handleLostTheLink() {
    setConfusionTimestampSeconds(currentTimeSeconds);
    setAiError(null);
    setScreen("signal");
  }

  async function handleSubmitQuestion(questionText: string) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setConfusionText(questionText);
    setIsLoadingAI(true);
    setAiError(null);

    const timestampForContext = confusionTimestampSeconds ?? currentTimeSeconds;

    try {
      const content = await askLearningAssistant({
        question: questionText,
        currentTimeSeconds: timestampForContext,
        transcript: lesson.transcript,
        language,
      });
      setAiRecoveryContent(content);
      setScreen("recovery");
    } catch (err) {
      setAiError(
        err instanceof AIRecoveryError
          ? err.message
          : "We couldn't generate the recovery right now. Try asking the question again."
      );
    } finally {
      setIsLoadingAI(false);
      isSubmittingRef.current = false;
    }
  }

  function handleLoopClosed() {
    setScreen("closed");
  }

  function handleReturnToLesson() {
    // Return the learner to the exact place they got stuck — not 0:00,
    // and not any old fixed timestamp.
    const restoreSeconds = confusionTimestampSeconds ?? 0;
    setLessonStartSeconds(restoreSeconds);
    setCurrentTimeSeconds(restoreSeconds);
    setConfusionTimestampSeconds(null);
    setConfusionText("");
    setAiRecoveryContent(null);
    setAiError(null);
    setScreen("lesson");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {screen === "lesson" && (
        <LessonPage
          startSeconds={lessonStartSeconds}
          currentTimeSeconds={currentTimeSeconds}
          onTimeUpdate={handleTimeUpdate}
          onLostTheLink={handleLostTheLink}
        />
      )}

      {screen === "signal" && (
        <SignalPage
          language={language}
          onLanguageChange={setLanguage}
          isLoading={isLoadingAI}
          error={aiError}
          onSubmitQuestion={handleSubmitQuestion}
        />
      )}

      {/* aiRecoveryContent is guaranteed non-null here because we only
          setScreen("recovery") right after successfully setting it —
          the guard just makes that invariant explicit and crash-proof. */}
      {screen === "recovery" && aiRecoveryContent && (
        <RecoveryPage
          content={aiRecoveryContent}
          onLoopClosed={handleLoopClosed}
        />
      )}

      {screen === "closed" && (
        <LoopClosedPage onReturnToLesson={handleReturnToLesson} />
      )}

      {/* confusionText retained in state for potential future use
          (e.g. logging, analytics, or reuse in a retry flow) */}
      <span className="sr-only">{confusionText}</span>
    </div>
  );
}
