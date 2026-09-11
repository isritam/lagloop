import { useState } from "react";
import type { Language } from "../types";
import { suggestedPhrases } from "../data/recovery";
import LanguageToggle from "../components/LanguageToggle";
import ProgressIndicator from "../components/ProgressIndicator";

interface SignalPageProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  isLoading: boolean;
  error: string | null;
  onSubmitQuestion: (questionText: string) => void;
}

export default function SignalPage({
  language,
  onLanguageChange,
  isLoading,
  error,
  onSubmitQuestion,
}: SignalPageProps) {
  const [confusionText, setConfusionText] = useState("");

  const suggestedPhrase = suggestedPhrases[language];

  function handleUseSuggestedPhrase() {
    setConfusionText(suggestedPhrase);
  }

  function handleSubmit() {
    if (isLoading) return;
    const trimmed = confusionText.trim();
    if (trimmed.length === 0) return;
    onSubmitQuestion(trimmed);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-emerald-400">
          LAGLOOP
        </span>
        <ProgressIndicator currentScreen="signal" />
      </header>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-white">
          What feels disconnected?
        </h1>
        <label htmlFor="confusion-input" className="sr-only">
          Describe what feels disconnected
        </label>
        <textarea
          id="confusion-input"
          value={confusionText}
          onChange={(e) => setConfusionText(e.target.value)}
          placeholder="Ask anything about what you just watched..."
          rows={4}
          disabled={isLoading}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-3">
        <LanguageToggle language={language} onChange={onLanguageChange} />

        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Suggested phrase
          </p>
          <button
            type="button"
            onClick={handleUseSuggestedPhrase}
            disabled={isLoading}
            className="mt-2 block w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            "{suggestedPhrase}"
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || confusionText.trim().length === 0}
            className="self-start rounded-md border border-red-400/60 px-3 py-1.5 font-medium text-red-100 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Try again
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || confusionText.trim().length === 0}
        className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {isLoading ? "Finding the missing connection..." : "Find my missing link"}
      </button>
    </div>
  );
}
