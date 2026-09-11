import type { AnswerStatus } from "../types";

interface QuestionOptionProps {
  label: string;
  isSelected: boolean;
  isCorrectOption: boolean;
  answerStatus: AnswerStatus;
  onSelect: () => void;
}

export default function QuestionOption({
  label,
  isSelected,
  isCorrectOption,
  answerStatus,
  onSelect,
}: QuestionOptionProps) {
  const revealResult = answerStatus !== "unanswered" && isSelected;
  const showAsCorrect = revealResult && answerStatus === "correct";
  const showAsIncorrect = revealResult && answerStatus === "incorrect";

  let stateClasses =
    "border-slate-600 bg-slate-800/60 text-slate-100 hover:border-emerald-400/60";

  if (isSelected && answerStatus === "unanswered") {
    stateClasses = "border-emerald-400 bg-emerald-400/10 text-emerald-200";
  }
  if (showAsCorrect) {
    stateClasses = "border-emerald-500 bg-emerald-500/15 text-emerald-200";
  }
  if (showAsIncorrect) {
    stateClasses = "border-red-500 bg-red-500/15 text-red-200";
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${stateClasses}`}
    >
      <span>{label}</span>
      {showAsCorrect && (
        <span aria-label="Correct" className="ml-3 shrink-0 text-sm font-semibold">
          ✓ Correct
        </span>
      )}
      {showAsIncorrect && (
        <span aria-label="Incorrect" className="ml-3 shrink-0 text-sm font-semibold">
          ✕ Try again
        </span>
      )}
      {!isSelected && !revealResult && isCorrectOption === undefined && null}
    </button>
  );
}