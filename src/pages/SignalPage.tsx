import { useState } from 'react'

type SignalPageProps = {
  onFindLink: () => void
  onBack: () => void
}

export default function SignalPage({
  onFindLink,
  onBack,
}: SignalPageProps) {
  const [language, setLanguage] = useState<'English' | 'Hinglish'>('English')
  const [confusion, setConfusion] = useState(
    'Parallel mein current divide kyun hota hai?',
  )

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={onBack}
          className="mb-8 text-sm text-slate-400 hover:text-white"
        >
          ← Back to lesson
        </button>

        <p className="mb-2 text-sm font-medium tracking-widest text-cyan-400">
          LAGLOOP
        </p>

        <h1 className="text-3xl font-bold">
          What feels disconnected?
        </h1>

        <p className="mt-3 text-slate-400">
          Tell us what stopped making sense. We'll help you recover the
          missing connection.
        </p>

        {/* Language toggle */}
        <div className="mt-8 flex rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(['English', 'Hinglish'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setLanguage(option)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                language === option
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Confusion input */}
        <div className="mt-4">
          <textarea
            value={confusion}
            onChange={(event) => setConfusion(event.target.value)}
            placeholder="Describe what confused you..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        {/* Suggested phrase */}
        <button
          onClick={() =>
            setConfusion('Parallel mein current divide kyun hota hai?')
          }
          className="mt-4 rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-300 hover:border-cyan-400"
        >
          Suggested phrase:
          <span className="mt-1 block text-cyan-400">
            Parallel mein current divide kyun hota hai?
          </span>
        </button>

        {/* Find link */}
        <button
          onClick={onFindLink}
          className="mt-6 w-full rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Find my missing link
        </button>

        <p className="mt-4 text-center text-xs text-slate-600">
          Language: {language}
        </p>

      </div>
    </main>
  )
}