import type { Language } from "../types";

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
}

export default function LanguageToggle({
  language,
  onChange,
}: LanguageToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex rounded-full border border-slate-700 bg-slate-800/60 p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={language === "english"}
        onClick={() => onChange("english")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          language === "english"
            ? "bg-emerald-500 text-slate-900"
            : "text-slate-300 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={language === "hinglish"}
        onClick={() => onChange("hinglish")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          language === "hinglish"
            ? "bg-emerald-500 text-slate-900"
            : "text-slate-300 hover:text-white"
        }`}
      >
        Hinglish
      </button>
    </div>
  );
}