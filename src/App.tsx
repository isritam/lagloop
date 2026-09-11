import { useEffect, useRef, useState } from "react";

import type {
  AIRecoveryContent,
  Language,
  Lesson,
  Screen,
} from "./types";

import { lesson } from "./data/lesson";
import { lesson2 } from "./data/lesson2";
import { lesson3 } from "./data/lesson3";
import { lesson4 } from "./data/lesson4";

import { supabase } from "./lib/supabase";
import {
  askLearningAssistant,
  generateSuggestedQuestion,
  AIRecoveryError,
} from "./lib/ai";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import ProgressPage from "./pages/ProgressPage";
import LessonPage from "./pages/LessonPage";
import SignalPage from "./pages/SignalPage";
import RecoveryPage from "./pages/RecoveryPage";
import LoopClosedPage from "./pages/LoopClosedPage";

type AppView =
  | "auth"
  | "home"
  | "learn"
  | "progress"
  | Screen;

const lessons: Lesson[] = [
  lesson,
  lesson2,
  lesson3,
  lesson4,
];

function getLessonDuration(lessonData: Lesson): number {
  if (lessonData.transcript.length === 0) {
    return 1;
  }

  const lastSegment =
    lessonData.transcript[
      lessonData.transcript.length - 1
    ];

  return Math.max(
    lastSegment.startSeconds + 10,
    1
  );
}

export default function App() {
  const [view, setView] =
    useState<AppView>("auth");

  const [username, setUsername] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [lessonProgress, setLessonProgress] =
    useState<Record<string, number>>({});

  const [linksRecovered, setLinksRecovered] =
    useState(0);

  const [retrievals, setRetrievals] =
    useState(0);

  const [lessonsCompleted, setLessonsCompleted] =
    useState(0);

  const [loopBalance, setLoopBalance] =
    useState(0);

  const [streak] = useState(0);

  // Currently selected lesson
  const [selectedLessonId, setSelectedLessonId] =
    useState<string>("matrix-multiplication");

  // Lesson playback
  const [lessonStartSeconds, setLessonStartSeconds] =
    useState(0);

  const [currentTimeSeconds, setCurrentTimeSeconds] =
    useState(0);

  // Recovery state
  const [
    confusionTimestampSeconds,
    setConfusionTimestampSeconds,
  ] = useState<number | null>(null);

  const [, setConfusionText] =
    useState("");

  const [language, setLanguage] =
    useState<Language>("english");

const [suggestedPhrase, setSuggestedPhrase] = useState(
  "What connection in this explanation is confusing me?"
);

const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const [
    aiRecoveryContent,
    setAiRecoveryContent,
  ] = useState<AIRecoveryContent | null>(null);

  const [isLoadingAI, setIsLoadingAI] =
    useState(false);

  const [aiError, setAiError] =
    useState<string | null>(null);

  const isSubmittingRef =
    useRef(false);

  const selectedLesson =
    lessons.find(
      (item) => item.id === selectedLessonId
    ) ?? lesson;

  useEffect(() => {
    async function checkAuth() {
      const { data } =
        await supabase.auth.getSession();

      if (!data.session) {
        setView("auth");
        return;
      }

      await loadUser(
        data.session.user.id
      );
    }

    checkAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!session) {
            setUserId(null);
            setUsername("");
            setLoopBalance(0);
            setView("auth");
            return;
          }

          await loadUser(
            session.user.id
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUser(
    currentUserId: string
  ) {
    setUserId(currentUserId);

    const { data: profile } =
      await supabase
        .from("profiles")
        .select(
          "username, loop_balance"
        )
        .eq("id", currentUserId)
        .maybeSingle();

    setUsername(
      profile?.username ?? "Learner"
    );

    setLoopBalance(
      profile?.loop_balance ?? 0
    );

    await loadLearningData(
      currentUserId
    );

    setView("home");
  }

  async function loadLearningData(
    currentUserId: string
  ) {
    const [
      { data: progressRows },
      { data: recoveryRows },
    ] = await Promise.all([
      supabase
        .from("lesson_progress")
        .select(
          "lesson_id, current_time_seconds, completed"
        )
        .eq(
          "user_id",
          currentUserId
        ),

      supabase
        .from("recoveries")
        .select("correct")
        .eq(
          "user_id",
          currentUserId
        ),
    ]);

    const progressMap:
      Record<string, number> = {};

    for (const row of progressRows ?? []) {
      const currentLesson =
        lessons.find(
          (item) =>
            item.id === row.lesson_id
        );

      if (!currentLesson) {
        continue;
      }

      const duration =
        getLessonDuration(
          currentLesson
        );

      const percent = row.completed
        ? 100
        : Math.min(
            100,
            Math.round(
              (row.current_time_seconds /
                duration) *
                100
            )
          );

      progressMap[
        row.lesson_id
      ] = percent;
    }

    setLessonProgress(
      progressMap
    );

    setLessonsCompleted(
      (progressRows ?? []).filter(
        (row) => row.completed
      ).length
    );

    setLinksRecovered(
      (recoveryRows ?? []).length
    );

    setRetrievals(
      (recoveryRows ?? []).filter(
        (row) => row.correct
      ).length
    );
  }

  async function awardLoop(
    currentUserId: string,
    amount: number,
    reason: string
  ) {
    if (amount <= 0) {
      return;
    }

    const { data: profile, error: profileFetchError } =
      await supabase
        .from("profiles")
        .select("loop_balance")
        .eq("id", currentUserId)
        .single();

    if (
      profileFetchError ||
      !profile
    ) {
      console.error(
        "Failed to load LOOP balance:",
        profileFetchError
      );
      return;
    }

    const newBalance =
      profile.loop_balance + amount;

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          loop_balance: newBalance,
        })
        .eq(
          "id",
          currentUserId
        );

    if (profileError) {
      console.error(
        "Failed to update LOOP:",
        profileError
      );
      return;
    }

    const { error: transactionError } =
      await supabase
        .from("loop_transactions")
        .insert({
          user_id: currentUserId,
          amount,
          reason,
        });

    if (transactionError) {
      console.error(
        "Failed to record LOOP transaction:",
        transactionError
      );
    }

    setLoopBalance(
      newBalance
    );
  }

  function handleAuthenticated() {
    // Supabase auth listener handles navigation.
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setUserId(null);
    setUsername("");
    setLoopBalance(0);
    setView("auth");
  }

  function handleOpenLesson(
    lessonId: string
  ) {
    const selected =
      lessons.find(
        (item) =>
          item.id === lessonId
      );

    if (!selected) {
      return;
    }

    setSelectedLessonId(
      lessonId
    );

    const percent =
      lessonProgress[
        lessonId
      ] ?? 0;

    const duration =
      getLessonDuration(
        selected
      );

    const resumeSeconds =
      percent > 0
        ? Math.floor(
            (percent / 100) *
              duration
          )
        : 0;

    setLessonStartSeconds(
      resumeSeconds
    );

    setCurrentTimeSeconds(
      resumeSeconds
    );

    setConfusionTimestampSeconds(
      null
    );

    setAiRecoveryContent(
      null
    );

    setAiError(null);

    setView("lesson");
  }

  function handleTimeUpdate(
    seconds: number
  ) {
    setCurrentTimeSeconds(
      seconds
    );
  }

  async function handleLostTheLink() {
  const timestamp =
    currentTimeSeconds;

  setConfusionTimestampSeconds(
    timestamp
  );

  setAiError(null);

  if (userId) {
    await awardLoop(
      userId,
      2,
      "Triggered recovery"
    );
  }

  setIsLoadingSuggestion(true);

  try {
    const suggestion =
      await generateSuggestedQuestion({
        transcript:
          selectedLesson.transcript,
        currentTimeSeconds:
          timestamp,
        language,
      });

    setSuggestedPhrase(
      suggestion
    );
  } catch (error) {
    console.error(
      "Failed to generate suggestion:",
      error
    );

    setSuggestedPhrase(
      "What connection in this explanation is confusing me?"
    );
  } finally {
    setIsLoadingSuggestion(false);
  }

  setView("signal");
}

  async function handleSubmitQuestion(
    questionText: string
  ) {
    if (
      isSubmittingRef.current
    ) {
      return;
    }

    isSubmittingRef.current =
      true;

    setConfusionText(
      questionText
    );

    setIsLoadingAI(true);
    setAiError(null);

    const timestampForContext =
      confusionTimestampSeconds ??
      currentTimeSeconds;

    try {
      const content =
        await askLearningAssistant({
          question: questionText,
          currentTimeSeconds:
            timestampForContext,
          transcript:
            selectedLesson.transcript,
          language,
        });

      setAiRecoveryContent(
        content
      );

      setView("recovery");
    } catch (err) {
      setAiError(
        err instanceof
          AIRecoveryError
          ? err.message
          : "We couldn't generate the recovery right now. Try asking the question again."
      );
    } finally {
      setIsLoadingAI(false);
      isSubmittingRef.current =
        false;
    }
  }

  function handleLoopClosed() {
    setView("closed");
  }

  function handleReturnToLesson() {
    const restoreSeconds =
      confusionTimestampSeconds ??
      currentTimeSeconds;

    setLessonStartSeconds(
      restoreSeconds
    );

    setCurrentTimeSeconds(
      restoreSeconds
    );

    setConfusionTimestampSeconds(
      null
    );

    setConfusionText("");

    setAiRecoveryContent(
      null
    );

    setAiError(null);

    setView("lesson");
  }

  if (view === "auth") {
    return (
      <LoginPage
        onAuthenticated={
          handleAuthenticated
        }
      />
    );
  }

  if (view === "home") {
    return (
      <HomePage
        username={username}
        progress={
          lessonProgress[
            "matrix-multiplication"
          ] ?? 0
        }
        streak={streak}
        linksRecovered={
          linksRecovered
        }
        loopBalance={
          loopBalance
        }
        lessons={lessons}
        lessonProgress={
          lessonProgress
        }
        onOpenLesson={
          handleOpenLesson
        }
        onStartLesson={() =>
          handleOpenLesson(
            "matrix-multiplication"
          )
        }
        onLearn={() =>
          setView("learn")
        }
        onProgress={() =>
          setView("progress")
        }
        onLogout={
          handleLogout
        }
      />
    );
  }

  if (view === "learn") {
    return (
      <LearnPage
        lessons={lessons}
        progress={
          lessonProgress
        }
        onOpenLesson={
          handleOpenLesson
        }
        onHome={() =>
          setView("home")
        }
        onProgress={() =>
          setView("progress")
        }
      />
    );
  }

  if (view === "progress") {
    return (
      <ProgressPage
        lessonProgress={
          lessonProgress
        }
        lessonsCompleted={
          lessonsCompleted
        }
        linksRecovered={
          linksRecovered
        }
        retrievals={
          retrievals
        }
        loopBalance={
          loopBalance
        }
        streak={streak}
        lessonTitles={Object.fromEntries(
          lessons.map(
            (item) => [
              item.id,
              item.title,
            ]
          )
        )}
        onHome={() =>
          setView("home")
        }
        onLearn={() =>
          setView("learn")
        }
      />
    );
  }

  if (view === "lesson") {
    return (
     <LessonPage
  lesson={selectedLesson}
  startSeconds={
    lessonStartSeconds
  }
  currentTimeSeconds={
    currentTimeSeconds
  }
  onTimeUpdate={
    handleTimeUpdate
  }
  onLostTheLink={
    handleLostTheLink
  }
  onHome={() =>
    setView("home")
  }
/>
    );
  }

  if (view === "signal") {
    return (
      <SignalPage
  language={language}
  onLanguageChange={setLanguage}
  isLoading={
    isLoadingAI ||
    isLoadingSuggestion
  }
  error={aiError}
  suggestedPhrase={suggestedPhrase}
  onSubmitQuestion={handleSubmitQuestion}
/>
    );
  }

  if (
    view === "recovery" &&
    aiRecoveryContent
  ) {
    return (
      <RecoveryPage
        content={
          aiRecoveryContent
        }
        onLoopClosed={
          handleLoopClosed
        }
      />
    );
  }

  return (
    <LoopClosedPage
      onReturnToLesson={
        handleReturnToLesson
      }
    />
  );
}