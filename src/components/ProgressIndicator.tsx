import type { Screen } from "../types";

interface ProgressIndicatorProps {
  currentScreen: Screen;
}

const STEPS: { screen: Screen; label: string }[] = [
  { screen: "lesson", label: "Lesson" },
  { screen: "signal", label: "Signal" },
  { screen: "recovery", label: "Recovery" },
  { screen: "closed", label: "Closed" },
];

export default function ProgressIndicator({
  currentScreen,
}: ProgressIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.screen === currentScreen);

  return (
    <ol
      aria-label="Recovery loop progress"
      className="flex items-center gap-2 text-xs font-medium text-slate-400"
    >
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step.screen} className="flex items-center gap-2">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={`flex h-6 items-center rounded-full px-3 transition-colors ${
                isCurrent
                  ? "bg-emerald-500 text-slate-900"
                  : isDone
                  ? "bg-slate-600 text-slate-100"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="text-slate-600">
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}