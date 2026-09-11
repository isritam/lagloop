import { useState } from "react";
import type { AIRecoveryContent, AnswerStatus } from "../types";
import QuestionOption from "../components/QuestionOption";
import ProgressIndicator from "../components/ProgressIndicator";

interface RecoveryPageProps {
  content: AIRecoveryContent;
  onLoopClosed: () => void;
}

export default function RecoveryPage({
  content,
  onLoopClosed,
}: RecoveryPageProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null
  );
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("unanswered");

  function handleSelectOption(optionId: string) {
    if (answerStatus === "correct") return;

    setSelectedOptionId(optionId);

    // Answer checking is deterministic and local — Gemini is never
    // asked whether the learner's selection was correct.
    const isCorrect = optionId === content.question.correctOptionId;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
  }

  function handleContinue() {
    onLoopClosed();
  }

  return (
<div className="min-h-screen bg-slate-950 text-white">
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
          <header className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-emerald-400">
          LAGLOOP
        </span>
        <ProgressIndicator currentScreen="recovery" />
      </header>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Here's the missing connection
        </p>
        <p className="mt-2 text-base leading-relaxed text-slate-100">
          {content.answer}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick check</h2>
        <p className="text-base text-slate-300">{content.question.prompt}</p>

        <div
          role="group"
          aria-label="Answer options"
          className="flex flex-col gap-3"
        >
          {content.question.options.map((option) => (
            <QuestionOption
              key={option.id}
              label={option.label}
              isSelected={selectedOptionId === option.id}
              isCorrectOption={option.id === content.question.correctOptionId}
              answerStatus={
                selectedOptionId === option.id ? answerStatus : "unanswered"
              }
              onSelect={() => handleSelectOption(option.id)}
            />
          ))}
        </div>

        <div aria-live="polite" className="min-h-[1.5rem] text-sm">
          {answerStatus === "incorrect" && (
            <p className="font-medium text-red-300">
              Not quite — reread the explanation above, then try the other
              option.
            </p>
          )}
          {answerStatus === "correct" && (
            <p className="font-medium text-emerald-300">Correct.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={answerStatus !== "correct"}
        className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Continue
      </button>
            </div>
  </div>
  );
}